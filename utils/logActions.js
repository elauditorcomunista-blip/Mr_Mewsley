module.exports = {
  logAction: async (guild, message) => {
    const canalId = '1427688193611923598'; // ID del canal de registros
    const canalAvisos = guild.channels.cache.get(canalId);
    if (canalAvisos) await canalAvisos.send(message);
  }
};
