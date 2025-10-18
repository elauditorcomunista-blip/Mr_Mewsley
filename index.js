// ===============================
// ✅ Importaciones principales
// ===============================
require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const fs = require('fs');
const config = require('./config.json');
const express = require('express');
const axios = require('axios'); // 👈 para el autoping

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
(async () => await player.extractors.loadMulti(DefaultExtractors))();

// ===============================
// ✅ Colección de comandos
// ===============================
client.commands = new Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
const commandsJSON = [];

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  if (command.data) {
    client.commands.set(command.data.name, command);
    commandsJSON.push(command.data.toJSON());
  }
}

// ===============================
// ✅ Registro de comandos slash
// ===============================
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('📦 Registrando comandos slash...');
    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commandsJSON }
    );
    console.log('✅ Comandos slash registrados correctamente.');
  } catch (error) {
    console.error('❌ Error registrando comandos slash:', error);
  }
})();

// ===============================
// ✅ Manejo de eventos del cliente
// ===============================
const eventFiles = fs.readdirSync("./events").filter(file => file.endsWith(".js"));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client, player, config));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client, player, config));
  }
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

// ===============================
// 🌐 Servidor Express para Render
// ===============================
const app = express();
app.get('/', (req, res) => res.send('Bot online y funcionando.'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Servidor web escuchando en Render (puerto ${PORT})`));

// ===============================
// 🔁 AutoPing cada 4 minutos
// ===============================
const url = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
setInterval(async () => {
  try {
    await axios.get(url);
    console.log(`🔁 AutoPing exitoso a ${url}`);
  } catch (error) {
    console.error('⚠️ Error en el AutoPing:', error.message);
  }
}, 240000); // 4 minutos
