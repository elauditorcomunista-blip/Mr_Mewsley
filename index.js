const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config(); // Si usas archivo .env
client.login(process.env.DISCORD_TOKEN);
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');

// Inicializa cliente
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

// Colección de comandos
client.commands = new Collection();

// Inicializa player
const player = new Player(client);
(async () => await player.extractors.loadMulti(DefaultExtractors))();

// Manejo global de errores
client.on('error', (error) => console.error('💥 Error general del cliente:', error));
player.events.on('playerError', (queue, error) => console.error('🎷 Error en el reproductor:', error.message));
player.events.on('error', (queue, error) => console.error('🥀 Error general del reproductor:', error.message));

// Cargar comandos de carpeta commands
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const commandsJSON = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  // Verifica si es un comando slash (tiene data)
  if (command.data) {
    client.commands.set(command.data.name, command);
    commandsJSON.push(command.data.toJSON());
  }
}


// Registrar comandos slash en Discord
const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
  try {
    console.log('Registrando comandos slash...');
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commandsJSON }
    );
    console.log('✅ Comandos slash registrados.');
  } catch (error) {
    console.error('❌ Error registrando comandos slash:', error);
  }
})();

// 🔥 Manejo de errores globales para red o Discord
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

// Cargar eventos
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client, player, config));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client, player, config));
  }
}

