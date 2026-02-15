// index.js
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const fs = require('fs');

if (!process.env.TOKEN) {
    console.error('❌ TOKEN no definido en .env');
    process.exit(1);
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

// -------------------
// Cargar comandos slash
// -------------------
const commands = new Map();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    // ✅ Usar data.name para mapear correctamente
    if (!command.data || !command.execute) {
        console.warn(`⚠️ Comando "${file}" inválido, se omitirá`);
        continue;
    }
    commands.set(command.data.name, command);
}

console.log(`✅ Comandos cargados: ${[...commands.keys()].join(', ')}`);

// -------------------
// Listener de interacciones
// -------------------
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    console.log(`🔹 Comando recibido: ${interaction.commandName} por ${interaction.user.tag}`);

    const command = commands.get(interaction.commandName);
    if (!command) {
        console.warn(`⚠️ Comando ${interaction.commandName} no encontrado`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: '❌ Error al ejecutar el comando', ephemeral: true });
    }
});

// -------------------
// Cargar eventos
// -------------------
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    event(client); // Pasamos el client al evento
}
console.log(`✅ Eventos cargados: ${eventFiles.join(', ')}`);

// -------------------
// Evento ready
// -------------------
client.once('ready', () => {
    console.log(`✅ ${client.user.tag} está listo!`);
});

// -------------------
// Login
// -------------------
client.login(process.env.TOKEN).catch(err => {
    console.error('❌ ERROR: Token inválido o problema de conexión');
    console.error(err);
    process.exit(1);
});

module.exports = client;
