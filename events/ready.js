module.exports = {
  name: 'ready',
  execute(client) {
    console.log(`🍸 ${client.user.tag} está listo para poner música en el speakeasy.`);
    console.log(`🥃 ${client.user.tag} está sirviendo copas en el Lackadaisy.`);
  }
};
