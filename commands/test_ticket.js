const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test_ticket')
        .setDescription('Prueba el sistema de tickets (solo visible para ti).'),

    async execute(interaction) {

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu_test')
                .setPlaceholder('📂 Selecciona la categoría para probar el ticket')
                .addOptions([
                    {
                        label: '🛠 Soporte Técnico',
                        value: 'ticket_tecnico'
                    },
                    {
                        label: '💸 Pagos',
                        value: 'ticket_pagos'
                    },
                    {
                        label: '📌 Otros',
                        value: 'ticket_otros'
                    }
                ])
        );

        await interaction.reply({
            content: '🎟️ **TEST del sistema de tickets**\nSelecciona una categoría:',
            components: [menu],
            ephemeral: true
        });
    }
};
