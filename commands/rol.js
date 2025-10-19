const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  EmbedBuilder,
  InteractionResponseFlags
} = require('discord.js');

// 🧩 Lista de personajes (puedes agregar más siguiendo este formato)
const personajes = [
  { nombre: 'Rocky Rickaby', rolId: '1429227897901551706' },
  { nombre: 'Freckle McMurray', rolId: '1429227744352403506' },
  { nombre: 'Ivy Pepper', rolId: '1429228050868080741' },
  { nombre: 'Mitzi May', rolId: '1429228189405806764' },
  { nombre: 'Mordecai Heller', rolId: '1429228445921054770' }
];

// 🎭 Máximo de usuarios permitidos por personaje
const LIMITE = 2;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('asignarrol')
    .setDescription('Elige tu personaje de Lackadaisy (máximo 2 personas por rol)'),

  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('menuPersonaje')
      .setPlaceholder('Selecciona un personaje...')
      .addOptions(
        personajes.map(p => ({
          label: p.nombre,
          description: `Rol: ${p.nombre}`,
          value: p.rolId
        }))
      );

    const row = new ActionRowBuilder().addComponents(menu);

    const embed = new EmbedBuilder()
      .setTitle('🎭 Selección de Personaje')
      .setDescription('Elige el personaje que quieres interpretar.\nCada rol puede tener **hasta 2 usuarios.**')
      .setColor('#f5c542');

    // ✅ Usamos el nuevo sistema de flags para respuestas efímeras
    await interaction.reply({
      embeds: [embed],
      components: [row],
      flags: InteractionResponseFlags.Ephemeral
    });
  },
};

// ============================
// ⚙️ Manejador del menú
// ============================
module.exports.handleSelect = async (interaction) => {
  if (!interaction.isStringSelectMenu() || interaction.customId !== 'menuPersonaje') return;

  const rolId = interaction.values[0];
  const guild = interaction.guild;
  const rol = guild.roles.cache.get(rolId);

  if (!rol) {
    return interaction.reply({
      content: '❌ No se encontró el rol seleccionado.',
      flags: InteractionResponseFlags.Ephemeral
    });
  }

  const miembrosConRol = rol.members.size;
  const LIMITE = 2;

  if (miembrosConRol >= LIMITE) {
    return interaction.reply({
      content: `❌ Todos los espacios para **${rol.name}** están ocupados.`,
      flags: InteractionResponseFlags.Ephemeral
    });
  }

  const miembro = interaction.member;

  // ❌ Evitar que el usuario tenga múltiples personajes
  const rolesLackadaisy = personajes.map(p => p.rolId);
  const rolesARemover = miembro.roles.cache.filter(r => rolesLackadaisy.includes(r.id));

  for (const [id] of rolesARemover) {
    await miembro.roles.remove(id);
  }

  await miembro.roles.add(rolId);

  await interaction.reply({
    content: `✅ Se te ha asignado el personaje **${rol.name}**.`,
    flags: InteractionResponseFlags.Ephemeral
  });
};
