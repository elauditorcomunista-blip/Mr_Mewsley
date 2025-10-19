const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client, player, config) {
    if (message.author.bot) return;

    const contenido = message.content.toLowerCase();

    // 🥃 COMANDOS DE INTERACCIÓN
    if (contenido === config.prefijo + 'saludo') {
      const { EmbedBuilder } = require('discord.js');

      const texto = '🎩 Bienvenido al Lackadaisy, socio. Pide algo fuerte.';
      const gifURL = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeGo1OWprMzJ5c2tmZDg0Z253MDkxYWI2b2ZvcTFwMTl3aDBlMjBhMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/F6J4lqFuxoP4GvFzKV/giphy.gif';

      const embed = new EmbedBuilder()
        .setColor('#00BFFF')
        .setTitle('¡Bienvenido al Lackadaisy!')
        .setDescription(texto)
        .setImage(gifURL);

      message.channel.send({ embeds: [embed] });
    }

    else if (contenido === config.prefijo + 'brindis') {
      const { EmbedBuilder } = require('discord.js');

      const texto = '🥂 Por los viejos tiempos y las noches sin ley.';
      const gifURL = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnBiazQ3ZHcyc2ppYW5udjNrdHR2cmRpNWRydGozZXJxYzdkZzRnZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xpO9wQXP3KOC8ssMOc/giphy.gif';

      const embed = new EmbedBuilder()
        .setColor('#FFD700')
        .setTitle('¡Brindis en el Lackadaisy!')
        .setDescription(texto)
        .setImage(gifURL);

      message.channel.send({ embeds: [embed] });
    }

    else if (contenido === config.prefijo + 'historia') {
      message.channel.send('📜 Este bar nació en tiempos difíciles, pero el espíritu nunca decayó...');
    }

    else if (contenido === config.prefijo + 'despedida') {
      const { EmbedBuilder } = require('discord.js');

      const texto = '🚪 Que la luna te guíe de regreso, socio.';
      const gifURL = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExODg2NDU0MjBidjQ2ZHN3aXl1MjM0dm5wNWh0ZTVjY2RnZjJhOTI4MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/j5Z6IY7k6ohA7muBrQ/giphy.gif';

      const embed = new EmbedBuilder()
        .setColor('#8B0000')
        .setTitle('¡Hasta luego en el Lackadaisy!')
        .setDescription(texto)
        .setImage(gifURL);

      message.channel.send({ embeds: [embed] });
    }

    // 📖 AYUDA ACTUALIZADA
    else if (contenido === config.prefijo + 'ayuda') {
      message.channel.send(
        `📖 **Menú de comandos del Lackadaisy:**
        
🎩 **Sociales**
> \`${config.prefijo}saludo\` — El bot te da la bienvenida.
> \`${config.prefijo}menu\` — Muestra el menú de bebidas.
> \`${config.prefijo}brindis\` — Haz un brindis con clase.
> \`${config.prefijo}historia\` — Conoce el origen del Lackadaisy.
> \`${config.prefijo}despedida\` — Despídete con estilo.

🎭 **Roles de Personajes**
> \`/asignarrol\` — Abre un menú para elegir tu personaje de *Lackadaisy* (máx. 2 usuarios por rol).

🎵 **Música**
> \`${config.prefijo}play <canción o enlace>\` — Reproduce música desde YouTube.

🛠️ **Administración (solo "Jefe del establecimiento")**
> \`/expulsar @usuario [razón]\` — Expulsa a un usuario del servidor.
> \`/banear @usuario [razón]\` — Banea a un usuario del servidor.
> \`${config.prefijo}clean\` — Limpia todos los mensajes del canal actual (solo administradores).

💡 *Recuerda:* Algunos comandos requieren permisos especiales o roles específicos.`
      );
    }

    // 🧹 LIMPIEZA
    else if (contenido === config.prefijo + 'clean') {
      const isAdmin = message.member.roles.cache.some(r => r.name === config.adminRole);
      if (!isAdmin) return message.reply("🚫 Solo los administradores pueden limpiar este canal.");

      try {
        const deleted = await message.channel.bulkDelete(100, true);
        message.channel.send(`🧹 Se han eliminado ${deleted.size} mensajes.`).then(msg => {
          setTimeout(() => msg.delete(), 5000);
        });
      } catch (err) {
        console.error("💥 Error al limpiar mensajes:", err);
        message.channel.send("❌ No se pudieron eliminar los mensajes.");
      }
    }

    // 🎶 COMANDO DE MÚSICA
    if (contenido.startsWith(config.prefijo + 'play')) {
      client.commands.get('play').execute(message, client, player, config);
    }
  },
};
