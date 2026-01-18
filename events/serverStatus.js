const { Rcon } = require('rcon-client'); // Para conectarte a ARK si quieres
require('dotenv').config();

const SERVERS = [
    {
        name: 'ARK',
        rconHost: process.env.ARK_RCON_HOST,
        rconPort: parseInt(process.env.ARK_RCON_PORT),
        rconPassword: process.env.ARK_RCON_PASSWORD,
        channelId: process.env.ARK_DISCORD_CHANNEL, // Canal de texto donde pondremos el estado
    },
    // Puedes añadir más servidores aquí
];

async function startServerStatus(client) {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        if (!guild) {
            console.error('No se pudo obtener la guild');
            return;
        }

        console.log('Iniciando sistema de estado de servidores...');

        setInterval(async () => {
            for (const server of SERVERS) {
                try {
                    // Obtenemos el canal de texto
                    const channel = await guild.channels.fetch(server.channelId);
                    if (!channel) continue;

                    let online = false;

                    try {
                        const rcon = await Rcon.connect({
                            host: server.rconHost,
                            port: server.rconPort,
                            password: server.rconPassword
                        });
                        online = true;
                        await rcon.end();
                    } catch {
                        online = false;
                    }

                    // Actualizamos el nombre del canal según el estado
                    await channel.setName(`${server.name} ${online ? '🟢' : '🔴'}`);
                    console.log(`${server.name} actualizado: ${online ? 'Online' : 'Offline'}`);

                    // Si quieres, aquí también puedes actualizar canales por voz con el mismo estado
                    // const voiceChannel = await guild.channels.fetch(VOCAL_CHANNEL_ID);
                    // await voiceChannel.setName(`ARK ${online ? '🟢' : '🔴'}`);

                } catch (err) {
                    console.error(`Error actualizando canal ${server.name}:`, err);
                }
            }
        }, 60000); // cada minuto
    } catch (err) {
        console.error('Error en startServerStatus:', err);
    }
}

module.exports = { startServerStatus };
