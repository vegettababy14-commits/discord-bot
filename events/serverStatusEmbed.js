const { EmbedBuilder } = require('discord.js');
const net = require('net');

module.exports = (client) => {

    const CHANNEL_ID = '1437110883087028263';
    const CHECK_INTERVAL = 60 * 1000; // 1 minuto

    // 👉 MAPAS / SERVIDORES
    const servers = [
        {
            name: 'Ragnarok',
            ip: '192.168.1.101',
            port: 7779
        },
        {
            name: 'The Island',
            ip: '192.168.1.101',
            port: 7778
        },
        {
            name: 'Extincion',
            ip: '192.168.1.101',
            port: 7780
        },
        {
            name: 'Aberration',
            ip: '192.168.1.101',
            port: 7777
        }
    ];

    let statusMessageId = null;

    const checkServer = (ip, port) => {
        return new Promise((resolve) => {
            const socket = new net.Socket();
            socket.setTimeout(3000);

            socket.on('connect', () => {
                socket.destroy();
                resolve(true);
            });

            socket.on('timeout', () => {
                socket.destroy();
                resolve(false);
            });

            socket.on('error', () => {
                socket.destroy();
                resolve(false);
            });

            socket.connect(port, ip);
        });
    };

    const updateEmbed = async () => {
        const channel = await client.channels.fetch(CHANNEL_ID).catch(() => null);
        if (!channel) return;

        let description = '';

        for (const server of servers) {
            const online = await checkServer(server.ip, server.port);
            description += `🗺️ **${server.name}** — ${online ? '✅ Online' : '🛑 Offline'}\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle('📊 Estado de servidores')
            .setDescription(description)
            .setColor('#00ff99')
            .setFooter({ text: 'Estado actualizado automáticamente' })
            .setTimestamp();

        if (!statusMessageId) {
            const msg = await channel.send({ embeds: [embed] });
            statusMessageId = msg.id;
        } else {
            const msg = await channel.messages.fetch(statusMessageId).catch(() => null);
            if (msg) {
                await msg.edit({ embeds: [embed] });
            }
        }
    };

    client.once('ready', async () => {
        await updateEmbed();
        setInterval(updateEmbed, CHECK_INTERVAL);
    });
};
