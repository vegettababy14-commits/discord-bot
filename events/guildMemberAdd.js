const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            const VERIFICATION_CHANNEL_ID = '1437110882545959145'; // tu canal de verificación
            const channel = member.guild.channels.cache.get(VERIFICATION_CHANNEL_ID);
            if (!channel) return;

            // Crear botones para los juegos
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('game_ark')
                        .setLabel('ARK')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('game_rust')
                        .setLabel('Rust')
                        .setStyle(ButtonStyle.Primary)
                );

            // Enviar mensaje al canal de verificación
            await channel.send({
                content: `¡Bienvenido ${member.user.tag}! Haz click en el botón correspondiente para verificarte y obtener acceso al juego deseado:`,
                components: [row],
            });

        } catch (error) {
            console.error(`No pude enviar mensaje al canal de verificación para ${member.user.tag}:`, error);
        }
    },
};
