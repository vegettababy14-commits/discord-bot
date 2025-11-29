const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paneltickets')
        .setDescription('Crea el panel de tickets con categorías.'),

    async execute(interaction) {
        try {
            // Crear menú desplegable
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

            // Enviar el mensaje con menú
            await interaction.reply({
                content: '🎟️ **Centro de Soporte**\nSelecciona una categoría para abrir un ticket:',
                components: [menu],
                ephemeral: false // visible para todos en el canal
            });

        } catch (error) {
            console.error('Error al enviar panel de tickets:', error);

            // Responder para evitar "La aplicación no ha respondido"
            if (!interaction.replied) {
                await interaction.reply({
                    content: '❌ Hubo un error al enviar el panel de tickets.',
                    ephemeral: true
                });
            }
        }
    }
};
