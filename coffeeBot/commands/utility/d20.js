const { SlashCommandBuilder } = require('@discordjs/builders');
const crypto = require('crypto');

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
    .setName('d20')
    .setDescription('Rola um dado de 20 lados e retorna o resultado.'),
  async execute(interaction) {
    const roll = getRandomNumber(1, 20);
    await interaction.reply(`Você rolou um ${roll}!`);
  },
};