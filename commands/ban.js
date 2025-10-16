const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banear")
    .setDescription("Banea a un usuario del servidor.")
    .addUserOption(option =>
      option.setName("usuario").setDescription("Usuario a banear").setRequired(true)
    )
    .addStringOption(option =>
      option.setName("razon").setDescription("Razón del baneo").setRequired(false)
    ),

  async execute(interaction) {
    const member = interaction.options.getMember("usuario");
    const reason = interaction.options.getString("razon") || "No especificada";

    const hasRole = interaction.member.roles.cache.some(
      r => r.name === "Jefe del establecimiento"
    );

    if (!hasRole) {
      return interaction.reply({
        content: "🚫 No tienes permisos para banear usuarios.",
        ephemeral: true,
      });
    }

    if (!member) {
      return interaction.reply("❌ No se encontró al usuario.");
    }

    if (!member.bannable) {
      return interaction.reply("⚠️ No puedo banear a ese usuario.");
    }

    await member.ban({ reason });
    await interaction.reply(`🔨 ${member.user.tag} fue baneado. Razón: ${reason}`);
  },
};
