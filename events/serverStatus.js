const { Rcon } = require('rcon-client');

// Obtener servidores desde .env
const MAP_SERVERS = process.env.MAP_SERVERS || '';
const CATEGORY_ID = process.env.CATEGORY_ID;
const GUILD_ID = process.env.GUILD_ID;

function parseMapServers() {
    const servers = [];
    MAP_SERVERS.split(',').forEach(entry => {
        const [name, host, port] = entry.split(':');
        servers.push({ name, host, port: parseInt(port) });
    });
    return servers;
}

async function updateServerStatus(client) {
    if (!client) return console.error("El client no está definido en updateServerStatus");

    const guild = await client.guilds.fetch(GUILD_ID);
    const category = guild.channels.cache.get(CATEGORY_ID);

    if (!category) {
        console.log('No se encontró la categoría definida en CATEGORY_ID');
        return;
    }

    const servers = parseMapServers();

    for (const server of servers) {
        let channel = guild.channels.cache.find(c => c.name === server.name.toUpperCase());

        // Si no existe el canal, lo creamos automáticamente
        if (!channel) {
            channel = await guild.channels.create({
                name: server.name.toUpperCase(),
                type: 2, // 2 = GUILD_VOICE
                parent: CATEGORY_ID,
            });
            console.log(`Canal de voz creado para ${server.name}`);
        }

        let status = 'Offline';
        try {
            const rcon = await Rcon.connect({
                host: server.host,
                port: server.port,
                password: process.env.ARK_RCON_PASSWORD
            });
            await rcon.send('listplayers');
            status = 'Online';
            rcon.end();
        } catch {
            status = 'Offline';
        }

        try {
            await channel.setName(`${server.name.toUpperCase()} - ${status}`);
            console.log(`Servidor ${server.name} actualizado: ${status}`);
        } catch (err) {
            console.error(`Error actualizando canal ${server.name}:`, err.message);
        }
    }
}

async function startServerStatus(client) {
    if (!client) return;
    console.log("Iniciando actualización inmediata de servidores...");
    await updateServerStatus(client);

    // Ejecutar cada 30 segundos
    setInterval(() => updateServerStatus(client), 30000);
}

module.exports = { startServerStatus };
