module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isButton()) return;

        const guild = interaction.guild;
        const member = await guild.members.fetch(interaction.user.id);

        let roleId;
        let channelId;

        // Asignar rol y canal según botón
        switch (interaction.customId) {
            case 'game_ark':
                roleId = '1437124002630860841';
                channelId = '1437112333909491813';
                break;
            case 'game_rust':
                roleId = 'ID_ROL_RUST';
                channelId = '1437119379383914586';
                break;
            default:
                return;
        }

        // Asignar rol
        await member.roles.add(roleId);

        // Responder interacción
        await interaction.reply({ content: `✅ ¡Verificado! Ahora tienes acceso a tu sección de ${interaction.component.label}.`, ephemeral: true });

        // Opcional: enviar un mensaje en el canal correspondiente
        const channel = guild.channels.cache.get(channelId);
        if (channel) channel.send(`¡Bienvenido ${member}! Disfruta de la sección de ${interaction.component.label}.`);
    },
};
