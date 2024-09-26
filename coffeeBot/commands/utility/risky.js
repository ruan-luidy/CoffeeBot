const { SlashCommandBuilder } = require('@discordjs/builders');
const crypto = require('crypto');
const { client, usersToDisconnect } = require('../index'); // Importa o cliente e o objeto usersToDisconnect do arquivo index.js

function getRandomNumber(minimumValue, maximumValue) {
  const randomNumber = crypto.randomBytes(1)[0];
  const asciiValueOfRandomCharacter = Number(randomNumber);
  const multiplier = Math.max(0, (asciiValueOfRandomCharacter / 255) - 0.00000000001);
  const range = maximumValue - minimumValue + 1;
  const randomValueInRange = Math.floor(multiplier * range);
  return minimumValue + randomValueInRange;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('roletarussa')
    .setDescription('Joga roleta russa. Se você receber o número 1, você será desconectado do canal de voz.'),
  async execute(interaction) {
    const roll = getRandomNumber(1, 6);
    const member = interaction.member;
    if (roll === 1) {
      if (member.voice.channel) {
        await member.voice.disconnect('Você perdeu na roleta russa.');
        await interaction.reply(`Você rolou um ${roll} e morreu :p.`);
      } else {
        usersToDisconnect[member.id] = member.user.username;
        await interaction.reply(`Você rolou um ${roll}, mas não está em um canal de voz. Fica pra próxima!`);
      }
    } else {
      await interaction.reply(`Você rolou um ${roll} e sobreviveu!`);
    }
  },
};