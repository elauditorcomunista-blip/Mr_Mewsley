// ===============================
// ✅ Importaciones principales
// ===============================
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require('fs');
const path = require('path');

// ===============================
// ✅ Inicializa cliente de Discord
// ===============================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// ===============================
// ✅ Inicializa el reproductor
// ===============================
const player = new Player(client);
(async () => {
  await player.extractors.loadMulti(DefaultExtractors);
})();

// ===============================
// ✅ Colección de comandos
// ===============================
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandsJSON = [];

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if (command.data) {
      client.commands.set(command.data.name, command);
      commandsJSON.push(command.data.toJSON());
    }
  }
} else {
  console.warn('⚠️  Carpeta ./commands no encontrada. Saltando registro de comandos.');
}

// ===============================
// ✅ Registro de comandos slash
// ===============================
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    if (process.env.CLIENT_ID && process.env.GUILD_ID) {
      console.log('📦 Registrando comandos slash...');
      await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
        { body: commandsJSON }
      );
      console.log('✅ Comandos slash registrados correctamente.');
    } else {
      console.warn('⚠️  CLIENT_ID o GUILD_ID no definidos. Saltando registro de comandos.');
    }
  } catch (error) {
    console.error('❌ Error registrando comandos slash:', error);
  }
})();

// ===============================
// ✅ Manejo de eventos del cliente
// ===============================
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
  for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client, player));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client, player));
    }
  }
} else {
  console.warn('⚠️  Carpeta ./events no encontrada. Saltando carga de eventos.');
}

// ===============================
// ✅ Manejo global de errores
// ===============================
client.on('error', (error) => console.error('💥 Error general del cliente:', error));
player.events.on('playerError', (queue, error) => console.error('🎷 Error en el reproductor:', error.message));
player.events.on('error', (queue, error) => console.error('🥀 Error general del reproductor:', error.message));

process.on('unhandledRejection', (error) => {
  if (error.code === 'ENOTFOUND' || (error.message && error.message.includes('getaddrinfo ENOTFOUND'))) {
    console.log('⚠️  No se pudo conectar con discord.com — verifica tu conexión o DNS.');
  } else {
    console.error('🚨 Error no manejado:', error);
  }
});

process.on('uncaughtException', (error) => {
  if (error.code === 'ENOTFOUND' || (error.message && error.message.includes('getaddrinfo ENOTFOUND'))) {
    console.log('⚠️  Error de red: no se puede resolver discord.com');
  } else {
    console.error('💣 Excepción no capturada:', error);
  }
});

// ===============================
// ✅ Iniciar sesión del bot
// ===============================
client.login(process.env.DISCORD_TOKEN);
