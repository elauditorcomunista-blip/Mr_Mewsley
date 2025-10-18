const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  execute(member, client, player, config) {
    const canal = member.guild.channels.cache.get(config.canalBienvenida);
    if (!canal) return;

    // Rol de trebol
    const rolTrebol = member.guild.roles.cache.get(config.rolTrebol); 
    if (rolTrebol) member.roles.add(rolTrebol).catch(console.error);

    // Embed de bienvenida
    const embed = new EmbedBuilder()
      .setColor('#00FF7F')
      .setTitle('¡Nuevo miembro en el Lackadaisy!')
      .setDescription(`🍸 Bienvenido, ${member}. Toma asiento, la noche apenas comienza.`)
      .setImage('https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm90MGllYzJtYWd6dW8zaWVjMXYxYm8zMzJ4aW52cWRvaDZtNXYyNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8bjOyW1bgKiTaWJ53D/giphy.gif');

    canal.send({ embeds: [embed] });
  },
};
