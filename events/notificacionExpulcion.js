function notificarExpulsion(guild, usuarioTag, razon, canalId) {
  const canalAvisos = guild.channels.cache.get(canalId);
  if (!canalAvisos) return;

  const embed = {
    color: 0xFF0000,
    title: `👢 ${usuarioTag} fue expulsado`,
    description: `Razón: ${razon}`,
    image: { url: 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbHhhZ3kwZ285YjVrbTRkcGFmY2EzZ3o4dzJmbHVvd2h3eGt4dHltayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RGFkPTe5BtAZIt9wmv/giphy.gif' }
  };

  canalAvisos.send({ embeds: [embed] });
}
