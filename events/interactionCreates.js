module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client, player, config) {
    // 🔹 Si es un botón
    if (interaction.isButton()) {
      // Borrar el mensaje del menú si se puede
      if (interaction.message.deletable) {
        await interaction.message.delete();
      }

      // Responder al usuario de forma privada (ephemeral)
      if (interaction.customId === 'whisky') {
        await interaction.reply({ content: '🥃 Excelente elección.', ephemeral: true });
      } else if (interaction.customId === 'ginebra') {
        await interaction.reply({ content: '🍸 La ginebra es cosa de elegancia.', ephemeral: true });
      } else if (interaction.customId === 'ron') {
        await interaction.reply({ content: '🏴‍☠️ Ron, ¿eh? Que los piratas te acompañen.', ephemeral: true });
      }

      return; // salir para no continuar al siguiente bloque
    }

    // 🔹 Si es un comando slash
    if (interaction.isCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        console.error(`❌ No se encontró el comando: ${interaction.commandName}`);
        return;
      }

      try {
        console.log(`⚙️ Ejecutando comando: ${interaction.commandName}`);
        await command.execute(interaction, client, player, config);
        console.log(`✅ Comando ${interaction.commandName} ejecutado correctamente.`);
      } catch (error) {
        console.error(`💥 Error ejecutando el comando ${interaction.commandName}:`, error);

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: '❌ Ocurrió un error al ejecutar el comando.', ephemeral: true });
        } else {
          await interaction.reply({ content: '❌ Ocurrió un error al ejecutar el comando.', ephemeral: true });
        }
      }
    }
  },
};
