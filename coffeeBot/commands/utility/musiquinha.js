const { SlashCommandBuilder } = require('@discordjs/builders');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const SpotifyWebApi = require('spotify-web-api-node');
const config = require('coffebot/config.json'); 

// Configuração do Spotify API
const spotifyApi = new SpotifyWebApi({
  clientId: config.spoofyId,
  clientSecret: config.spoofyScrt,
});

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduz uma música do YouTube ou Spotify.')
    .addStringOption(option => 
      option.setName('url')
        .setDescription('URL do vídeo do YouTube ou Spotify')
        .setRequired(true)),
  async execute(interaction) {
    const url = interaction.options.getString('url');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply('Você precisa estar em um canal de voz para usar este comando!');
    }

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: interaction.guild.id,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    if (url.includes('spotify.com')) {
      // Autenticação com o Spotify API
      await spotifyApi.clientCredentialsGrant().then(data => {
        spotifyApi.setAccessToken(data.body['access_token']);
      }).catch(error => {
        console.error('Erro ao autenticar com o Spotify API:', error);
        return interaction.reply('Ocorreu um erro ao autenticar com o Spotify.');
      });

      // Obter informações da música do Spotify
      const trackId = url.split('/').pop().split('?')[0];
      const track = await spotifyApi.getTrack(trackId).catch(error => {
        console.error('Erro ao obter a música do Spotify:', error);
        return interaction.reply('Ocorreu um erro ao obter a música do Spotify.');
      });

      interaction.reply(`Informações da música: ${track.body.name} por ${track.body.artists.map(artist => artist.name).join(', ')}`);
      // Aqui você precisaria de uma maneira de reproduzir a música do Spotify, o que não é trivial devido às restrições de DRM.
    } else {
      const stream = ytdl(url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);
      const player = createAudioPlayer();

      player.play(resource);
      connection.subscribe(player);

      player.on(AudioPlayerStatus.Playing, () => {
        interaction.reply(`Reproduzindo: ${url}`);
      });

      player.on(AudioPlayerStatus.Idle, () => {
        connection.destroy();
      });

      player.on('error', error => {
        console.error(error);
        interaction.reply('Ocorreu um erro ao tentar reproduzir a música.');
      });
    }
  },
};