const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            // ===========================
            // SLASH COMMANDS
            // ===========================
            if (interaction.isChatInputCommand()) {
                const command = client.commands.get(interaction.commandName);
                if (!command) {
                    console.log('Comando no encontrado:', interaction.commandName);
                    return;
                }
                await command.execute(interaction, client);
                return;
            }

            // ===========================
            // BOTONES
            // ===========================
            if (interaction.isButton()) {

                // ===========================
                // SUGERENCIAS
                // ===========================
                if (interaction.customId.startsWith('sugerencia_')) {

                    const MOD_ROLE_ID = '1437139317410627675';
                    const SUGGESTIONS_CHANNEL_ID = '1437112875779887266';

                    if (!interaction.member.roles.cache.has(MOD_ROLE_ID)) {
                        return interaction.reply({
                            content: '❌ No tienes permisos para revisar sugerencias.',
                            ephemeral: true
                        });
                    }

                    const embed = EmbedBuilder.from(interaction.message.embeds[0]);
                    const userId = interaction.customId.split('_')[2];

                    // =======================
                    // ACEPTAR SUGERENCIA
                    // =======================
                    if (interaction.customId.startsWith('sugerencia_aceptar')) {
                        embed.setTitle('✅ Sugerencia aceptada');
                        embed.setColor(0x2ecc71);

                        const suggestionsChannel = await client.channels.fetch(SUGGESTIONS_CHANNEL_ID);

                        // Borrar mensaje original del canal de sugerencias
                        await interaction.message.delete().catch(() => {});

                        // Enviar embed al canal de aprobación
                        await suggestionsChannel.send({ embeds: [embed] });

                        return interaction.reply({
                            content: '✅ Sugerencia aceptada y enviada al canal de aprobación.',
                            ephemeral: true
                        });
                    }

                    // =======================
                    // RECHAZAR SUGERENCIA
                    // =======================
                    if (interaction.customId.startsWith('sugerencia_rechazar')) {
                        embed.setTitle('❌ Sugerencia rechazada');
                        embed.setColor(0xe74c3c);

                        // Borrar mensaje original del canal de sugerencias
                        await interaction.message.delete().catch(() => {});

                        return interaction.reply({
                            content: '❌ Sugerencia rechazada.',
                            ephemeral: true
                        });
                    }
                }

                // ===========================
                // VERIFICACIÓN (SOLO EN UN CANAL)
                // ===========================
                const VERIFICATION_CHANNEL_ID = '1437110882545959145';

                if (interaction.channel.id !== VERIFICATION_CHANNEL_ID) {
                    return interaction.reply({
                        content: '❌ La verificación solo puede hacerse en el canal correspondiente.',
                        ephemeral: true
                    });
                }

                const guild = interaction.guild;
                if (!guild) return;

                const member = await guild.members.fetch(interaction.user.id);
                let rolesToAdd = [];

                switch (interaction.customId) {
                    case 'game_ark':
                        rolesToAdd = ['1437111886918324396'];
                        break;
                    case 'game_rust':
                        rolesToAdd = ['ID_ROL_RUST'];
                        break;
                    default:
                        return;
                }

                for (const r of rolesToAdd) {
                    await member.roles.add(r).catch(() => {});
                }

                await interaction.reply({
                    content: '✅ ¡Verificado correctamente! Ya tienes acceso.',
                    ephemeral: true
                });

                return;
            }

            // ===========================
            // SELECT MENUS
            // ===========================
            if (interaction.isStringSelectMenu()) {
                const guild = interaction.guild;
                if (!guild) return;

                const member = await guild.members.fetch(interaction.user.id);

                let rolesToAdd = [];
                let selectedCategory = '';

                switch (interaction.values[0]) {
                    case 'game_ark':
                        rolesToAdd = ['1437110881656770745',
                                      '1437111886918324396',
                        ];
                        selectedCategory = 'ARK';
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

                for (const r of rolesToAdd) {
                    await member.roles.add(r).catch(() => {});
                }

                const confirmationEmbed = new EmbedBuilder()
                    .setTitle('🎫 Ticket creado')
                    .setDescription(`✅ Has seleccionado la categoría: **${selectedCategory}**`)
                    .setColor('#00ff99')
                    .setFooter({ text: 'Soporte de ArceusHost' });

                await interaction.reply({
                    embeds: [confirmationEmbed],
                    ephemeral: true
                });
            }

        } catch (error) {
            console.error('Error en interactionCreate:', error);
            if (!interaction.replied && !interaction.deferred) {
                await interaction.reply({
                    content: '❌ Error interno.',
                    ephemeral: true
                });
            }
        }
    }
};
