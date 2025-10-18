const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("expulsar")
    .setDescription("Expulsa a un usuario del servidor.")
    .addUserOption(option =>
      option.setName("usuario")
        .setDescription("Usuario a expulsar")
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName("razon")
        .setDescription("Razón de la expulsión")
        .setRequired(false)
    ),

  async execute(interaction, client, player, config) {
    try {
      const member = interaction.options.getMember("usuario");
      const reason = interaction.options.getString("razon") || "No especificada";

      // Verificar rol
      const hasRole = interaction.member.roles.cache.some(
        r => r.name === config.adminRole
      );
      if (!hasRole) {
        return interaction.reply({
          content: "🚫 No tienes permisos para expulsar usuarios.",
          ephemeral: true
        });
      }

      // Validaciones
      if (!member) return interaction.reply("❌ No se encontró al usuario.");
      if (!member.kickable)
        return interaction.reply("⚠️ No puedo expulsar a ese usuario.");

      // Expulsar
      await member.kick(reason);

      // Confirmación al ejecutor
      await interaction.reply(`👢 ${member.user.tag} fue expulsado. Razón: ${reason}`);

      // Canal de salidas
      const canalSalidas = interaction.guild.channels.cache.get(config.canalSalidas);
      if (!canalSalidas) {
        console.warn("⚠️ No se encontró el canal de salidas. No se enviará la notificación.");
        return;
      }

      // Crear embed con GIF
      const embed = new EmbedBuilder()
        .setColor(0xFF0000)
        .setTitle("🚪 Un miembro ha sido expulsado del Speakeasy")
        .setDescription(`👢 **${member.user.tag}** ha sido expulsado.\n📝 Razón: ${reason}`)
        .setImage("https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHhhZ3kwZ285YjVrbTRkcGFmY2EzZ3o4dzJmbHVvd2h3eGt4dHltayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RGFkPTe5BtAZIt9wmv/giphy.gif")
        .setFooter({ text: "El Speakeasy Lackadaisy mantiene el orden 🍸" })
        .setTimestamp();

      // Enviar notificación al canal
      await canalSalidas.send({ embeds: [embed] });

      // Aviso por consola
      console.log(`✅ Se expulsó a ${member.user.tag}. Notificación enviada a #${canalSalidas.name}`);
    } catch (error) {
      console.error("💥 Error en el comando /expulsar:", error);
      await interaction.reply({
        content: "❌ Ocurrió un error al intentar expulsar al usuario.",
        ephemeral: true
      });
    }
  },
};
