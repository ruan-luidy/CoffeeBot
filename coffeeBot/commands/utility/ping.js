const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com o ping real do usuário com o servidor'),
  async execute(interaction) {
    const ping = Date.now() - interaction.createdTimestamp;
    await interaction.reply(`Pong! Seu ping é ${ping}ms.`);
  },
};