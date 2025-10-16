const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('menu')
    .setDescription('Muestra el menú de bebidas del Lackadaisy'),

  async execute(interaction) {
    const fila = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('whisky')
        .setLabel('🥃 Whisky')
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId('ginebra')
        .setLabel('🍸 Ginebra')
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId('ron')
        .setLabel('🏴‍☠️ Ron')
        .setStyle(ButtonStyle.Secondary)
    );

    await interaction.reply({
      content: '🍸 Tenemos whisky, ginebra y ron de contrabando. ¿Cuál te apetece?',
      components: [fila],
      ephemeral: false, // cambiar a true si quieres que solo el usuario vea el mensaje
    });
  },
};
