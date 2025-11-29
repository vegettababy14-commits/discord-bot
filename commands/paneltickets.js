const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paneltickets')
        .setDescription('Crea el panel de tickets con categorías.'),

    async execute(interaction) {
        try {
            const menu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_menu')
                    .setPlaceholder('📂 Selecciona la categoría del ticket')
                    .addOptions([
                        { label: '🛠 Soporte Técnico', value: 'ticket_tecnico' },
                        { label: '💸 Pagos', value: 'ticket_pagos' },
                        { label: '📌 Otros', value: 'ticket_otros' },
                    ])
            );

            // Enviar mensaje visible para todos en el canal
            await interaction.reply({
                content: '🎟️ **Centro de Soporte**\nSelecciona una categoría para abrir un ticket:',
                components: [menu],
                ephemeral: false
            });
        } catch (error) {
            console.error('Error en paneltickets:', error);
            if (!interaction.replied) await interaction.reply({ content: '❌ Error al enviar el panel.', ephemeral: true });
        }
    }
};
