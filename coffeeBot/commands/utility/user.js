const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('da informaçoes sobre o user.'),
  async execute(interaction) {
    const user = interaction.user;
    const channel = interaction.channel;

    const messages = await channel.messages.fetch({ limit: 100 });

    const userMessages = messages.filter(msg => msg.author.id === user.id);

    const messageCount = userMessages.size;

    let response;
    if (messageCount > 50) {
      response = `o ${user.username}, já mandou ${messageCount} mensagens! fale menos porfavor!`;
    } else if (messageCount > 10) {
      response = `o ${user.username}, você já mandou ${messageCount} mensagens. fala pouco mais fala muita merda!`;
    } else {
      response = `o ${user.username}, só mandou ${messageCount} mensagens? ta com vergonha porque hein!`;
    }

    await interaction.reply(response);
  }
}