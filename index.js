const { Client, GatewayIntentBits } = require('discord.js');
const { startServerStatus } = require('./events/serverStatus'); // ruta relativa correcta

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

client.once('ready', () => {
    console.log(`${client.user.tag} está listo!`);
    startServerStatus(client).catch(console.error);
});

client.login(process.env.TOKEN);

module.exports = client;
