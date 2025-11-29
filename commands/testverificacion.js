const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'testverificacion',
    description: 'Envía un mensaje privado de prueba con el sistema de verificación.',
    async execute(message) {

        // Intentamos enviar el mensaje privado
        try {
            const embed = new EmbedBuilder()
                .setTitle("🔐 Sistema de Verificación")
                .setDescription(
                    "¡Hola! Para poder acceder al servidor, selecciona el juego al que perteneces.\n\n" +
                    "Esto ayudará a asignarte el rol adecuado y desbloquear los canales correctos."
                )
                .setColor("#00A2FF")
                .setFooter({ text: "Sistema de verificación de ArceusHost" })
                .setTimestamp();

            const botones = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("verificar_minecraft")
                    .setLabel("Minecraft")
                    .setStyle(ButtonStyle.Primary),

                new ButtonBuilder()
                    .setCustomId("verificar_ark")
                    .setLabel("ARK")
                    .setStyle(ButtonStyle.Success),

                new ButtonBuilder()
                    .setCustomId("verificar_rust")
                    .setLabel("Rust")
                    .setStyle(ButtonStyle.Danger)
            );

            await message.author.send({
                embeds: [embed],
                components: [botones]
            });

            message.reply("📬 Te he enviado un mensaje privado con la verificación.");

        } catch (err) {
            message.reply("❌ No puedo enviarte mensajes privados. Activa los DMs para poder continuar.");
        }
    }
};
