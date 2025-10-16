module.exports = {
  name: "guildMemberRemove",
  async execute(member, client) {
    const logChannel = member.guild.channels.cache.find(ch => ch.name === "registro");
    if (!logChannel) return;

    logChannel.send(`👋 El usuario **${member.user.tag}** fue expulsado del servidor.`);
  },
};
