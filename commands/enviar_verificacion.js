const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('enviar_verificacion')
        .setDescription('Envía el mensaje de verificación en el canal de verificación'),

    async execute(interaction) {
        // Cambia por el ID de tu canal de verificación
        const canalVerificacionID = process.env.CANAL_VERIFICACION_ID;

        const canal = interaction.guild.channels.cache.get(canalVerificacionID);
        if (!canal) return interaction.reply({ content: '❌ No se encontró el canal de verificación', ephemeral: true });

        // Botones
        const botones = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('rol_a')
                    .setLabel('ARK')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('rol_b')
                    .setLabel('RUST')
                    .setStyle(ButtonStyle.Secondary),
            );

        // Embed
        const embed = new EmbedBuilder()
            .setTitle('¡Verificación del servidor!')
            .setDescription('Pulsa uno de los botones para verificarte y entrar al servidor correspondiente.')
            .setColor('Blue')
            .setTimestamp();

        await canal.send({ embeds: [embed], components: [botones] });
        await interaction.reply({ content: '✅ Mensaje de verificación enviado', ephemeral: true });
    }
};
