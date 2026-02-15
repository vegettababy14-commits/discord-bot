// events/buttonInteraction.js
module.exports = (client) => {
    client.on('interactionCreate', async interaction => {
        if (!interaction.isButton()) return;

        const miembro = interaction.member;

        // IDs de roles desde .env
        const rolA_ID = process.env.ROL_A_ID;
        const rolB_ID = process.env.ROL_B_ID;

        if (interaction.customId === 'rol_a') {
            await miembro.roles.add(rolA_ID);
            await interaction.reply({ content: '✅ Te has verificado para Opción A', ephemeral: true });
        } else if (interaction.customId === 'rol_b') {
            await miembro.roles.add(rolB_ID);
            await interaction.reply({ content: '✅ Te has verificado para Opción B', ephemeral: true });
        }
    });
};
