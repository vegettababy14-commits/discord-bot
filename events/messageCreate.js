const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        // Ignorar mensajes de bots
        if (message.author.bot) return;

        const SUGGESTIONS_CHANNEL_ID = '1437112875779887266'; // canal donde los usuarios escriben sugerencias
        const APPROVED_CHANNEL_ID = '143711288888888888'; // canal donde van las sugerencias aprobadas
        const MOD_ROLE_ID = '1437139317410627675'; // rol de moderador

        // Solo procesar mensajes en el canal de sugerencias
        if (message.channel.id !== SUGGESTIONS_CHANNEL_ID) return;

        // Crear embed de la sugerencia
        const embed = new EmbedBuilder()
            .setTitle('Nueva sugerencia')
            .setDescription(message.content)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setColor(0x3498db)
            .setFooter({ text: 'Haz click en los botones para aceptar o rechazar' });

        // Crear botones
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`sugerencia_aceptar_${message.author.id}`)
                    .setLabel('Aceptar')
                    .setStyle(ButtonStyle.Success),
                new ButtonBuilder()
                    .setCustomId(`sugerencia_rechazar_${message.author.id}`)
                    .setLabel('Rechazar')
                    .setStyle(ButtonStyle.Danger)
            );

        // Enviar embed con botones al canal de sugerencias
        await message.channel.send({ embeds: [embed], components: [row] });

        // Opcional: eliminar mensaje original del usuario para que solo quede el embed con botones
        await message.delete().catch(() => {});
    }
};
