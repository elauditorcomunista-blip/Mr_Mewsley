const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Reproduce una canción en el canal de voz actual.")
    .addStringOption(option =>
      option.setName("cancion")
        .setDescription("Nombre o enlace de la canción")
        .setRequired(true)
    ),
  
  async execute(interaction, client, player, config) {
    const query = interaction.options.getString("cancion");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply("🎙️ Debes estar en un canal de voz para reproducir algo.");
    }

    let result;
    try {
      result = await player.search(query, {
        requestedBy: interaction.user,
        searchEngine: query.startsWith("https://") ? "youtube" : "auto"
      });
    } catch (err) {
      console.error("Error en la búsqueda de música:", err);
      return interaction.reply("🥀 Hubo un error buscando la canción.");
    }

    if (!result || !result.tracks.length) {
      return interaction.reply("🥀 No encontré esa canción.");
    }

    const track = result.tracks[0];
    const queue = await player.nodes.create(interaction.guild, { metadata: interaction.channel });

    try {
      if (!queue.connection) {
        await queue.connect(voiceChannel);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error("Error al conectar al canal de voz:", err);
      queue.delete();
      return interaction.reply("🚪 No pude unirme al canal de voz.");
    }

    queue.addTrack(track);
    if (!queue.node.isPlaying()) await queue.node.play();

    await interaction.reply(`🎶 Reproduciendo ahora: **${track.title}**`);
  }
};
