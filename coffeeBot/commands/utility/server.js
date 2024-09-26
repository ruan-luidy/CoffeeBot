const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('da informaçoes sobre o server.'),
  async execute(interaction) {
    const guild = interaction.guild;

    const members = await guild.members.fetch();

    const bans = await guild.bans.fetch();

    const currentMembers = [];
    const bannedMembers = [];

    const messages = await guild.channels.cache
      .filter(channel => channel.isText())
      .reduce(async (acc, channel) => {
        const channelMessages = await channel.messages.fetch({ limit: 100 });
        return acc.concat(channelMessages);
      }, []);

    members.forEach(member => {
      const userMessages = messages.filter(msg => msg.author.id === member.id);
      currentMembers.push({ username: member.user.username, messageCount: userMessages.size });
    });

    bans.forEach(ban => {
      bannedMembers.push({ username: ban.user.username });
    });

    let response = 'Informações sobre o servidor:\n\nMembros Atuais:\n';
    currentMembers.forEach(member => {
      response += `${member.username}: ${member.messageCount} mensagens\n`;
    });

    response += '\nMembros Banidos:\n';
    bannedMembers.forEach(member => {
      response += `${member.username}\n`;
    });

    await interaction.reply(response);
  }
};