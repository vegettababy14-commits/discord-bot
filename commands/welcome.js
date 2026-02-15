const sendWelcomeBanner = require('../utils/welcomeBanner');

module.exports = {
    name: 'welcome',
    description: 'Envía un banner de bienvenida (prueba)',
    execute: async (interaction) => {
        const canal = interaction.guild.channels.cache.get(process.env.VERIFICATION_CHANNEL_ID);
        await sendWelcomeBanner(interaction.member, canal);
        await interaction.reply({ content: '✅ Banner enviado', ephemeral: true });
    },
};
