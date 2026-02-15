const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = (client) => {
    client.on('guildMemberAdd', async (member) => {
        try {
            // Canal de verificación
            const canal = member.guild.channels.cache.get(process.env.CANAL_VERIFICACION_ID);
            if (!canal) return console.warn('❌ Canal de verificación no encontrado');

            // Botones
            const botones = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('rol_a')
                        .setLabel('Opción A')
                        .setStyle(ButtonStyle.Primary),
                    new ButtonBuilder()
                        .setCustomId('rol_b')
                        .setLabel('Opción B')
                        .setStyle(ButtonStyle.Secondary),
                );

            // Embed de bienvenida
            const embed = new EmbedBuilder()
                .setTitle('¡Bienvenido al servidor!')
                .setDescription(`${member.user}, pulsa uno de los botones para verificarte y obtener acceso.`)
                .setColor('Blue')
                .setTimestamp();

            await canal.send({ embeds: [embed], components: [botones] });
        } catch (error) {
            console.error('❌ Error enviando mensaje de verificación automático:', error);
        }
    });
};
