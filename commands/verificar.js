const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('verificar')
        .setDescription('Verifícate y obtén acceso al servidor'),

    async execute(interaction) {
        const rolVerificadoID = process.env.ROL_VERIFICADO_ID;
        const miembro = interaction.member;

        if (miembro.roles.cache.has(rolVerificadoID)) {
            return interaction.reply({ content: "Ya estás verificado ✅", ephemeral: true });
        }

        await miembro.roles.add(rolVerificadoID);

        const embed = new EmbedBuilder()
            .setTitle("¡Verificación exitosa!")
            .setDescription(`¡Bienvenido, ${miembro.user.username}! Ahora tienes acceso al servidor.`)
            .setColor("Green")
            .setImage("https://i.imgur.com/0j7VLJJ.jpeg")
            .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: false });
    }
};
