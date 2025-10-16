module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'whisky') await interaction.reply('🥃 Excelente elección.');
    else if (interaction.customId === 'ginebra') await interaction.reply('🍸 La ginebra es cosa de elegancia.');
    else if (interaction.customId === 'ron') await interaction.reply('🏴‍☠️ Ron, ¿eh? Que los piratas te acompañen.');
  }
};

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client, player, config) {
    // Solo responder a comandos slash
    if (!interaction.isCommand()) return;

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

      // Enviar mensaje de error al usuario si algo falla
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: '❌ Ocurrió un error al ejecutar el comando.', ephemeral: true });
      } else {
        await interaction.reply({ content: '❌ Ocurrió un error al ejecutar el comando.', ephemeral: true });
      }
    }
  },
};
