const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: "interactionCreate",
    async execute(interaction) {

        // Ignorar cosas que no sean botones
        if (!interaction.isButton()) return;

        // ------------------------------
        // JUEGO: ARK
        // ------------------------------
        if (interaction.customId === "verify_ark") {
            const embed = new EmbedBuilder()
                .setTitle("🦖 Verificación — ARK: Survival Evolved")
                .setDescription(
                    `¡Perfecto! Has elegido **ARK**.  
Para completar tu verificación sigue estos pasos:

1️⃣ Proporciona tu **SteamID64**.  
2️⃣ El bot verificará automáticamente si cumples los requisitos.  
3️⃣ Si todo está correcto, se te dará acceso a la sección exclusiva de ARK.`
                )
                .setColor("#00A8FF");

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Aquí puedes añadir la asignación de rol (si ya tienes roles creados)
            // await interaction.member.roles.add(process.env.ROLE_ARK_ID);

            return;
        }

        // ------------------------------
        // JUEGO: MINECRAFT
        // ------------------------------
        if (interaction.customId === "verify_minecraft") {
            const embed = new EmbedBuilder()
                .setTitle("⛏️ Verificación — Minecraft")
                .setDescription(
                    `¡Perfecto! Has elegido **Minecraft**.  
Para completar tu verificación sigue estos pasos:

1️⃣ Proporciona tu **nombre de usuario de Minecraft**.  
2️⃣ El sistema comprobará si el nombre es válido.  
3️⃣ Te daremos acceso automático a la sección de Minecraft.`
                )
                .setColor("#57F287");

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Asignación de rol si ya tienes roles
            // await interaction.member.roles.add(process.env.ROLE_MINECRAFT_ID);

            return;
        }

        // ------------------------------
        // JUEGO: RUST
        // ------------------------------
        if (interaction.customId === "verify_rust") {
            const embed = new EmbedBuilder()
                .setTitle("🔫 Verificación — Rust")
                .setDescription(
                    `¡Perfecto! Has elegido **Rust**.  
Para completar tu verificación sigue estos pasos:

1️⃣ Envía tu **SteamID64**.  
2️⃣ El bot comprobará que es válido.  
3️⃣ Se te dará acceso automático a la sección de Rust.`
                )
                .setColor("#ED4245");

            await interaction.reply({ embeds: [embed], ephemeral: true });

            // Asignación de rol opcional si ya tienes roles
            // await interaction.member.roles.add(process.env.ROLE_RUST_ID);

            return;
        }
    },
};
