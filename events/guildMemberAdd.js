const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {

        // ------------------------
        // MENSAJE DE BIENVENIDA (canal público)
        // ------------------------

        const channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
        if (!channel) return;

        const welcomeEmbed = new EmbedBuilder()
            .setTitle("👋 ¡Bienvenido a la comunidad!")
            .setDescription(`¡Hola ${member.user.username}! Gracias por unirte.  
Por favor revisa tu **mensaje privado**, ahí encontrarás el sistema de verificación.`)
            .setColor("#5865F2")
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }));

        channel.send({ content: `¡Bienvenido ${member}!`, embeds: [welcomeEmbed] });


        // ------------------------
        // MENSAJE PRIVADO CON VERIFICACIÓN
        // ------------------------

        const verifyEmbed = new EmbedBuilder()
            .setTitle("🔐 Sistema de Verificación")
            .setDescription(
                `¡Hola **${member.user.username}**! 👋  

Antes de entrar al servidor, necesitamos saber qué juego utilizas.  
Selecciona tu juego para continuar con la verificación.

Esto nos permitirá darte acceso a las secciones correctas del servidor.`
            )
            .setColor("#00A8FF")
            .setFooter({ text: "ArceusHost • Sistema de verificación" });

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

        // Enviar el mensaje privado
        member.send({
            embeds: [verifyEmbed],
            components: [buttons]
        }).catch(() => {
            channel.send(`⚠️ **No pude enviar DM a ${member}.** Asegúrate de que tenga los MD activados.`);
        });

    }
};
