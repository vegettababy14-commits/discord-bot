const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member, client) {
        try {
            // Crear botones para los juegos
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('game_ark')
                        .setLabel('ARK')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('game_minecraft')
                        .setLabel('Minecraft')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('game_rust')
                        .setLabel('Rust')
                        .setStyle(ButtonStyle.Primary),
                );

            // Enviar DM al usuario
            await member.send({
                content: '¡Bienvenido! Selecciona tu juego para verificarte y obtener acceso a la sección correspondiente:',
                components: [row],
            });

        } catch (error) {
            console.error(`No pude enviar DM a ${member.user.tag}:`, error);
        }
    },
};
