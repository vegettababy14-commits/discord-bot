const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            // ---------------------------
            // Slash commands
            // ---------------------------
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) {
                    console.log('Comando no encontrado:', interaction.commandName);
                    return;
                }
                await command.execute(interaction, client);
            }

            // ---------------------------
            // Botones
            // ---------------------------
            if (interaction.isButton()) {
                const guild = interaction.guild;
                if (!guild) return;

                const member = await guild.members.fetch(interaction.user.id);
                let rolesToAdd = [];
                let channelId;

                switch (interaction.customId) {
                    case 'game_ark':
                        rolesToAdd = ['1437111886918324396'];
                        channelId = '1437112333909491813';
                        break;
                    case 'game_rust':
                        rolesToAdd = ['ID_ROL_RUST'];
                        channelId = '1437119379383914586';
                        break;
                    default:
                        return;
                }

                for (const r of rolesToAdd) {
                    await member.roles.add(r).catch(() => {});
                }

                await interaction.reply({ content: '✅ ¡Verificado! Ahora tienes acceso a tu sección.', ephemeral: true });
            }

            // ---------------------------
            // Select menus
            // ---------------------------
            if (interaction.isStringSelectMenu()) {
                const guild = interaction.guild;
                if (!guild) return;

                const member = await guild.members.fetch(interaction.user.id);

                // Tickets y roles según selección
                let rolesToAdd = [];
                let selectedCategory = '';
                switch (interaction.values[0]) {
                    case 'game_ark':
                        rolesToAdd = ['1437111886918324396'];
                        selectedCategory = 'ARK';
                        break;
                    case 'game_minecraft':
                        rolesToAdd = ['ID_ROL_MINECRAFT'];
                        selectedCategory = 'Minecraft';
                        break;
                    case 'game_rust':
                        rolesToAdd = ['ID_ROL_RUST'];
                        selectedCategory = 'Rust';
                        break;
                    case 'ticket_tecnico':
                        selectedCategory = 'Soporte Técnico';
                        break;
                    case 'ticket_pagos':
                        selectedCategory = 'Pagos';
                        break;
                    case 'ticket_otros':
                        selectedCategory = 'Otros';
                        break;
                    default:
                        return;
                }

                // Añadir roles si corresponde
                for (const r of rolesToAdd) {
                    await member.roles.add(r).catch(() => {});
                }

                // Embed de confirmación
                const confirmationEmbed = new EmbedBuilder()
                    .setTitle('🎫 Ticket creado')
                    .setDescription(`✅ Has seleccionado la categoría: **${selectedCategory}**`)
                    .setColor('#00ff99')
                    .setFooter({ text: 'Soporte de ArceusHost' });

                await interaction.reply({ embeds: [confirmationEmbed], ephemeral: true });
            }
        } catch (error) {
            console.error('Error en interactionCreate:', error);
            if (!interaction.replied) {
                await interaction.reply({ content: '❌ Error interno.', ephemeral: true });
            }
        }
    }
};
