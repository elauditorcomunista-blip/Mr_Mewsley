const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('personaje')
    .setDescription('Elige un personaje de Lackadaisy.'),

  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('menu_personajes')
      .setPlaceholder('Selecciona un personaje disponible...')
      .addOptions([
        {
          label: 'Rocky Rickaby',
          description: 'El impulsivo y carismático contrabandista.',
          value: 'rocky'
        },
        {
          label: 'Mordecai Heller',
          description: 'El meticuloso y letal contable de Lackadaisy.',
          value: 'mordecai'
        },
        {
          label: 'Ivy Pepper',
          description: 'La alegre y valiente chica del grupo.',
          value: 'ivy'
        },
        {
          label: 'Freckle McMurray',
          description: 'El tímido primo de Rocky con un lado oscuro.',
          value: 'freckle'
        },
        {
          label: 'Mitzi May',
          description: 'La elegante dueña del club Lackadaisy.',
          value: 'mitzi'
        }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await interaction.reply({
      content: '🎭 Selecciona el personaje que deseas interpretar:',
      components: [row],
      ephemeral: true
    });
  }
};
