const { Client } = require('discord.js');
const Rcon = require('rcon-client').Rcon;

// Obtener servidores desde .env
const MAP_SERVERS = process.env.MAP_SERVERS || '';
const CATEGORY_ID = process.env.CATEGORY_ID;
const RCON_PASSWORD = process.env.ARK_RCON_PASSWORD || null;

function parseMapServers() {
    const servers = [];
    MAP_SERVERS.split(',').forEach(entry => {
        const [name, host, port] = entry.split(':');
        servers.push({ name, host, port: parseInt(port) });
    });
    return servers;
}

async function updateServerStatus(client) {
    if (!client) return console.error('Cliente no definido para updateServerStatus');

    const guild = await client.guilds.fetch(process.env.GUILD_ID);
    const category = guild.channels.cache.get(CATEGORY_ID);

    if (!category) {
        console.log('No se encontró la categoría definida en CATEGORY_ID');
        return;
    }

    const servers = parseMapServers();

    for (const server of servers) {
        let channel = guild.channels.cache.find(c => c.name.startsWith(server.name.toUpperCase()));

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

        if (!RCON_PASSWORD) {
            status = 'Sin RCON';
        } else {
            try {
                const rcon = await Rcon.connect({
                    host: server.host,
                    port: server.port,
                    password: RCON_PASSWORD
                });
                await rcon.send('listplayers');
                status = 'Online';
                rcon.end();
            } catch {
                status = 'Offline';
            }
        }

        try {
            await channel.setName(`${server.name.toUpperCase()} - ${status}`);
            console.log(`Servidor ${server.name} actualizado: ${status}`);
        } catch (err) {
            console.error(`Error actualizando canal ${server.name}:`, err.message);
        }
    }
}

// Función que inicia el ciclo de actualización
async function startServerStatus(client) {
    await updateServerStatus(client); // Actualización inmediata
    setInterval(() => updateServerStatus(client), 30000); // Cada 30s
}

module.exports = { startServerStatus };
