const { Client, GatewayIntentBits, Collection } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

// Crear cliente
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Colección de comandos
client.commands = new Collection();

// ----------------------------
// 🔹 Cargar comandos
// ----------------------------
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data?.name || command.name, command);
    console.log(`Comando cargado: ${command.data?.name || command.name}`);
}

// ----------------------------
// 🔹 Cargar eventos
// ----------------------------
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }

    console.log(`Evento cargado: ${event.name}`);
}

// ----------------------------
// 🔹 Iniciar bot cuando esté listo
// ----------------------------
client.once('ready', () => {
    console.log(`${client.user.tag} está listo!`);

    // 🔹 Cargar estado del servidor ARK
    const { startServerStatus } = require('./events/serverStatus');
    startServerStatus(client);
});

// ----------------------------
// 🔹 Login con token
// ----------------------------
client.login(process.env.TOKEN);
