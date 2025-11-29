const { ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    name: 'test_verify',
    description: 'Envia DM de prueba con menú desplegable para seleccionar juego',
    async execute(interaction) {
        try {
            const user = interaction.user;
            
            // Crear el menú desplegable
            const row = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('select_game')
                    .setPlaceholder('Selecciona tu juego')
                    .addOptions([
                        { label: 'ARK', value: 'game_ark' },
                        { label: 'Minecraft', value: 'game_minecraft' },
                        { label: 'Rust', value: 'game_rust' },
                    ])
            );

            // Enviar DM con el menú
            await user.send({
                content: '🔹 Prueba de verificación: selecciona tu juego para obtener acceso a la sección correspondiente.',
                components: [row],
            });

            await interaction.reply({ content: '✅ DM de prueba enviado con menú desplegable.', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Error al enviar DM de prueba.', ephemeral: true });
        }
    },
};
