const {
    SlashCommandBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paneltickets')
        .setDescription('Crea el panel de tickets con categorías.'),

    async execute(interaction) {

        const menu = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('ticket_menu')
                .setPlaceholder('📂 Selecciona la categoría del ticket')
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
            content: '🎟️ **Centro de Soporte**\nSelecciona una categoría para abrir un ticket:',
            components: [menu]
        });
    }
};
