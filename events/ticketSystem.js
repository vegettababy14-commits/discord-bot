const {
    ChannelType,
    PermissionFlagsBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const fs = require('fs');
const path = require('path');

const STAFF_ROLE = '1437124002630860841';
const LOG_CHANNEL = '1444355536383643708';

module.exports = {
    name: 'interactionCreate',

    async execute(interaction, client) {

        // ============================
        // 📌 Ticket creado desde MENÚ
        // ============================
        if (interaction.isStringSelectMenu() && (interaction.customId === 'ticket_menu' || interaction.customId === 'ticket_menu_test')) {

            const guild = interaction.guild;
            const member = interaction.member;
            const selected = interaction.values[0];

            const categoryName = {
                ticket_tecnico: "soporte-tecnico",
                ticket_pagos: "pagos",
                ticket_otros: "otros"
            }[selected];

            const readableName = {
                ticket_tecnico: "Soporte Técnico",
                ticket_pagos: "Pagos",
                ticket_otros: "Otros"
            }[selected];

            // 🛑 Evitar duplicar tickets
            if (guild.channels.cache.find(c => c.name === `ticket-${member.id}`)) {
                return interaction.reply({
                    content: '❌ Ya tienes un ticket abierto.',
                    ephemeral: true
                });
            }

            // Crear canal
            const channel = await guild.channels.create({
                name: `ticket-${categoryName}-${member.id}`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    { id: guild.id, deny: [PermissionFlagsBits.ViewChannel] },
                    { id: member.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] },
                    { id: STAFF_ROLE, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages] }
                ]
            });

            // Botón de cierre
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('ticket_close')
                    .setLabel('🔒 Cerrar Ticket')
                    .setStyle(ButtonStyle.Danger)
            );

            await channel.send({
                content: `🎫 Ticket abierto por ${member}\n**Categoría:** ${readableName}\nUn miembro del soporte te atenderá pronto.`,
                components: [row]
            });

            return interaction.reply({
                content: `✅ Ticket creado en la categoría **${readableName}**.\nCanal: ${channel}`,
                ephemeral: true
            });
        }

        // ============================
        // 🔒 CERRAR TICKET
        // ============================
        if (interaction.isButton() && interaction.customId === 'ticket_close') {

            const channel = interaction.channel;

            // Obtener mensajes y hacer transcripción
            const messages = await channel.messages.fetch({ limit: 100 });
            const transcript = messages
                .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
                .map(m => `${m.author.tag}: ${m.content}`)
                .join('\n');

            const filePath = path.join(__dirname, `transcript-${channel.id}.txt`);
            fs.writeFileSync(filePath, transcript);

            const logChannel = interaction.guild.channels.cache.get(LOG_CHANNEL);

            if (logChannel) {
                await logChannel.send({
                    content: `📄 Transcripción del ticket **${channel.name}**`,
                    files: [filePath]
                });
            }

            fs.unlinkSync(filePath);

            await channel.delete();
        }

    }
};
