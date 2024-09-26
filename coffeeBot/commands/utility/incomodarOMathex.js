const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('Incomodar')
    .setDescription('incomoda um usuario especifico cargo sei la qq eu fiz')
    .addUserOption(option =>
      option.setName('usuario')
        .setDescription('o user q vai ser avacalhado')
        .setRequired(true))
    .addRoleOption(option =>
      option.SetName('cargo')
        .setDescription('o cargo do infeliz')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.option.getUser('usuario');
    const role = interaction.option.getRole('cargo');
    const member = interaction.guild.members.chace.get(user.id);

    if (member) {
      await member.roles.add(role);
      await interaction.reply(`o usuario ${user.username} recebeu o cargo ${role.name}. agora sei la oq nao sei oq la.`);
    } else {
      await interaction.reply('usario nem existe');
    }
  },
};