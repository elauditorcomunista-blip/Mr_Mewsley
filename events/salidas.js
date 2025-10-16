const { EmbedBuilder } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  execute(member, client, player, config) {
    const canalSalidas = member.guild.channels.cache.get(config.canalSalidas);
    if (!canalSalidas) return;

    // Embed de expulsión
    const embed = new EmbedBuilder()
      .setColor("#FF0000")
      .setTitle(`Mordecai de ha encargado de ${member.user.tag}`)
      .setDescription("Parece que fue expulsado o se fue del servidor.")
      .setImage("https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHhhZ3kwZ285YjVrbTRkcGFmY2EzZ3o4dzJmbHVvd2h3eGt4dHltayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RGFkPTe5BtAZIt9wmv/giphy.gif");

    canalSalidas.send({ embeds: [embed] });
  },
};
