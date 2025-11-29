const { SlashCommandBuilder } = require('discord.js');
const generateWelcomeImage = require('../utils/generateWelcomeImage');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('testwelcome')
        .setDescription('Genera la bienvenida de prueba')
        .addStringOption(option =>
            option.setName('game')
                  .setDescription('Juego para la bienvenida')
                  .setRequired(false)
        ),

    async execute(interaction) {
        const member = interaction.member; // usuario que ejecuta el comando
        const game = interaction.options.getString('game') || 'ninguno';
        const attachment = await generateWelcomeImage(member, game);

        await interaction.reply({
            content: `¡Bienvenido/a ${member.user.username}!`,
            files: [attachment]
        });
    }
};
