const Rcon = require('rcon');

const host = process.env.ARK_RCON_HOST;
const port = process.env.ARK_RCON_PORT;
const password = process.env.ARK_RCON_PASSWORD;

let rcon;
let client;

module.exports = {
    start(clientInstance) {
        client = clientInstance;
        connectRCON();

        // → Discord → ARK
        client.on('messageCreate', async (msg) => {
            if (msg.author.bot) return;
            if (msg.channel.id !== process.env.ARK_DISCORD_CHANNEL) return;

            const text = msg.content.replace(/"/g, "'");

            sendToArk(`ServerChat "[DISCORD] ${msg.author.username}: ${text}"`);
        });
    }
};

function connectRCON() {
    rcon = new Rcon(host, port, password);

    rcon.on('auth', () => {
        console.log("🟢 RCON conectado a ARK Ascended");
        listenArkChat();
    });

    rcon.on('error', (err) => {
        console.log("⚠️ Error RCON:", err);
    });

    rcon.on('end', () => {
        console.log("🔴 RCON desconectado. Reintentando...");
        setTimeout(connectRCON, 5000);
    });

    rcon.connect();
}

function sendToArk(command) {
    if (!rcon) return console.log("❌ RCON no conectado");
    rcon.send(command);
}

function listenArkChat() {
    setInterval(() => {
        rcon.send("getchat");
    }, 2000);

    rcon.on("response", (res) => {
        if (!res || res.includes("No chat messages")) return;

        const channel = client.channels.cache.get(process.env.ARK_DISCORD_CHANNEL);
        if (!channel) return;

        channel.send(`🎮 **ARK** → ${res}`);
    });
}
