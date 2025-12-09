const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('paneltickets')
        .setDescription('Crea el panel de tickets con categorías.'),

    async execute(interaction) {
        try {
            // ✅ Embed principal del panel
            const embed = new EmbedBuilder()
                .setTitle('🎟️ Centro de Soporte')
                .setDescription('Selecciona la categoría correspondiente para abrir un ticket:')
                .setColor('#0099ff') // color azul
                .setFooter({ text: 'Soporte de ArceusHost' });

            // ✅ Menú desplegable con emojis y descripción
            const menu = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('ticket_menu')
                    .setPlaceholder('📂 Selecciona la categoría del ticket')
                    .addOptions([
                        {
                            label: '🛠 Soporte Técnico',
                            value: 'ticket_tecnico',
                            description: 'Problemas técnicos con el servidor'
                        },
                        {
                            label: '💸 Pagos',
                            value: 'ticket_pagos',
                            description: 'Consultas de facturación y pagos'
                        },
                        {
                            label: '📌 Otros',
                            value: 'ticket_otros',
                            description: 'Cualquier otra consulta'
                        }
                    ])
            );

            // ✅ Enviar mensaje principal visible para todos
            await interaction.reply({
                embeds: [embed],
                components: [menu],
                ephemeral: false
            });

        } catch (error) {
            console.error('Error en paneltickets:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: '❌ Error al enviar el panel.', ephemeral: true });
            }
        }
    }
};
