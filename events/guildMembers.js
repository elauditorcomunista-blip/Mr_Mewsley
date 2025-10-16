const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'guildMemberAdd',
  execute(member, client, player, config) {
    const canal = member.guild.channels.cache.get(config.canalBienvenida);
    if (!canal) return;

    const texto = `🍸 Bienvenido, ${member}. El Speakeasy Lackadaisy abre sus puertas. Toma asiento, la noche apenas comienza.`;

    const gifURL = 'https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbm90MGllYzJtYWd6dW8zaWVjMXYxYm8zMzJ4aW52cWRvaDZtNXYyNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8bjOyW1bgKiTaWJ53D/giphy.gif';

    const embed = new EmbedBuilder()
      .setColor('#00FF7F')
      .setTitle('¡Nuevo miembro en el Lackadaisy!')
      .setDescription(texto)
      .setImage(gifURL);

    canal.send({ embeds: [embed] });
  },
};
