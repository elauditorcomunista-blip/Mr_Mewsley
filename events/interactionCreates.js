module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client, player, config) {
    // 🔹 Si es un botón
    if (interaction.isButton()) {
      if (interaction.customId === 'whisky') return await interaction.reply('🥃 Excelente elección.');
      if (interaction.customId === 'ginebra') return await interaction.reply('🍸 La ginebra es cosa de elegancia.');
      if (interaction.customId === 'ron') return await interaction.reply('🏴‍☠️ Ron, ¿eh? Que los piratas te acompañen.');
      return; // salimos para no continuar al siguiente bloque
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
