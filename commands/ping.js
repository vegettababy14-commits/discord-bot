// commands/ping.js
module.exports = {
    name: 'ping',
    description: 'Responde con Pong para verificar que el bot funciona',
    execute: async (interaction) => {
        await interaction.reply({ content: '🏓 Pong!', ephemeral: true });
    },
};
