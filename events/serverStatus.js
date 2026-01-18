const client = require('../index.js');
const { Rcon } = require('rcon-client');

// Obtener servidores desde .env
const MAP_SERVERS = process.env.MAP_SERVERS || '';
const CATEGORY_ID = process.env.CATEGORY_ID;

function parseMapServers() {
    const servers = [];
    MAP_SERVERS.split(',').forEach(entry => {
        const [name, host, port] = entry.split(':');
        servers.push({ name, host, port: parseInt(port) });
    });
    return servers;
}

async function updateServerStatus() {
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
        try {
            const rcon = await Rcon.connect({
                host: server.host,
                port: server.port,
                password: process.env.ARK_RCON_PASSWORD
            });

            await rcon.send('listplayers');
            status = 'Online';
            console.log(`[RCON] Conexión exitosa a ${server.name} (${server.host}:${server.port})`);
            rcon.end();
        } catch (err) {
            console.error(`[RCON] Error conectando a ${server.name} (${server.host}:${server.port}):`, err.message);
            status = 'Offline';
        }

        try {
            await channel.setName(`${server.name.toUpperCase()} - ${status}`);
            console.log(`ARK actualizado: ${server.name} - ${status}`);
        } catch (err) {
            console.error(`Error actualizando canal ${server.name}:`, err.message);
        }
    }
}

// Ejecutar cada 30s
setInterval(updateServerStatus, 30000);

// Ejecutar **inmediatamente al iniciar el bot**
async function startServerStatus(clientInstance) {
    console.log('Iniciando actualización inmediata de servidores...');
    await updateServerStatus();
    console.log('Actualización inicial completa.');
}

module.exports = { startServerStatus };
