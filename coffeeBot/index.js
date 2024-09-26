const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(`[PERIGO] o comando no ${filePath} esta faltando as propriedades 'data' ou 'execute' que sao nescessarias.`);
    }
  }
}

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`nenhum comando com ${interaction.commandName} foi encontrado.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'ACONECEU ERRO ENQUANTO RODAVA O COMANDO!!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'ACONECEU ERRO ENQUANTO RODAVA O COMANDO!!', ephemeral: true });
    }
  }
});

const usersToDisconnect = {};

client.on('voiceStateUpdate', (oldState, newState) => {
  if (!oldState.channel && newState.channel) {
    const memberId = newState.member.id;
    if (usersToDisconnect[memberId]) {
      newState.member.voice.disconnect('Você perdeu na roleta russa.');
      delete usersToDisconnect[memberId];
    }
  }
});

module.exports = { client, usersToDisconnect };