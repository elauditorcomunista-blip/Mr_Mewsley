// ✅ events/interactionCreate.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'interactionCreate',

  async execute(interaction, client, player, config) {
    try {
      // ==========================
      // 🎛️ BOTONES
      // ==========================
      if (interaction.isButton()) {
        if (interaction.customId === 'whisky') {
          const embed = new EmbedBuilder()
            .setColor('#b5651d')
            .setTitle('🥃 Whisky servido')
            .setDescription('Excelente elección, socio.');
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.customId === 'ginebra') {
          const embed = new EmbedBuilder()
            .setColor('#8be9fd')
            .setTitle('🍸 Ginebra servida')
            .setDescription('La ginebra es cosa de elegancia.');
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.customId === 'ron') {
          const embed = new EmbedBuilder()
            .setColor('#deb887')
            .setTitle('🏴‍☠️ Ron servido')
            .setDescription('Ron, ¿eh? Que los piratas te acompañen.');
          return await interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Si llega aquí, el botón no tiene handler
        console.warn(`⚠️ Botón sin manejador: ${interaction.customId}`);
        return await interaction.reply({
          content: '🤔 Ese botón no tiene acción definida aún.',
          ephemeral: true
        });
      }

      // ==========================
      // ⚙️ COMANDOS SLASH
      // ==========================
      if (interaction.isCommand()) {
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          console.error(`❌ No se encontró el comando: ${interaction.commandName}`);
          return;
        }

        console.log(`⚙️ Ejecutando comando: ${interaction.commandName}`);
        await command.execute(interaction, client, player, config);
        console.log(`✅ Comando ${interaction.commandName} ejecutado correctamente.`);
      }

    } catch (error) {
      console.error('💥 Error manejando interacción:', error);

      if (!interaction.replied) {
        await interaction.reply({
          content: '❌ Ocurrió un error al procesar tu interacción.',
          ephemeral: true
        });
      }
    }
  },
};
