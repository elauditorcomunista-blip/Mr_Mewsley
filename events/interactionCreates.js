module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client, player, config) {
    try {
      // 🔹 Botones
      if (interaction.isButton()) {
        let replyText;
        switch (interaction.customId) {
          case 'whisky':
            replyText = '🥃 Excelente elección.';
            break;
          case 'ginebra':
            replyText = '🍸 La ginebra es cosa de elegancia.';
            break;
          case 'ron':
            replyText = '🏴‍☠️ Ron, ¿eh? Que los piratas te acompañen.';
            break;
          default:
            return; // Salir si no es un botón que manejamos
        }
        // Responder solo si aún no se ha respondido
        if (!interaction.replied && !interaction.deferred) {
          await interaction.reply({ content: replyText, ephemeral: true });
        }
        return; // Salir para no ejecutar comandos después
      }

      // 🔹 Comandos slash
      if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return console.error(`❌ No se encontró el comando: ${interaction.commandName}`);

        await command.execute(interaction, client, player, config);
        console.log(`✅ Comando ${interaction.commandName} ejecutado correctamente.`);
      }
    } catch (error) {
      console.error('💥 Error en interactionCreate:', error);

      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ content: '❌ Ocurrió un error al ejecutar la interacción.', ephemeral: true });
      }
    }
  },
};
