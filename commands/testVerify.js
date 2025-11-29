const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testverify")
        .setDescription("Envia el mensaje de verificación a tu privado para probar."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setTitle("🔐 Sistema de Verificación (TEST)")
            .setDescription(
                `Esto es un mensaje de prueba del sistema de verificación.\n\n
Selecciona un juego para ver si la interacción funciona correctamente.`
            )
            .setColor("#00A8FF");

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("verify_ark")
                .setLabel("ARK: Survival Evolved")
                .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId("verify_minecraft")
                .setLabel("Minecraft")
                .setStyle(ButtonStyle.Success),

            new ButtonBuilder()
                .setCustomId("verify_rust")
                .setLabel("Rust")
                .setStyle(ButtonStyle.Danger)
        );

        await interaction.user.send({
            embeds: [embed],
            components: [buttons]
        });

        await interaction.reply({ content: "📩 Te he enviado el mensaje de verificación al privado.", ephemeral: true });
    },
};
