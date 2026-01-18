const { Client, GatewayIntentBits } = require('discord.js');
const { startServerStatus } = require('./events/serverStatus');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once('clientReady', () => {
    console.log(`${client.user.tag} está listo!`);
    startServerStatus(client).catch(console.error);
});

client.login(process.env.TOKEN);

module.exports = client;
