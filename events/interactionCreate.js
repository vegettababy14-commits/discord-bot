module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {

        const GUILD_ID = '1437110881262501972'; // ID de tu servidor
        const guild = client.guilds.cache.get(GUILD_ID);
        if (!guild) return;

        // ✅ Manejo de slash commands
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            try {
                await command.execute(interaction, client);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: '❌ Error ejecutando el comando.', ephemeral: true });
            }
        }

        // ✅ Manejo de botones
        if (interaction.isButton()) {
            const member = await guild.members.fetch(interaction.user.id);

            let roleId;
            let channelId;

            switch (interaction.customId) {
                case 'game_ark':
                    roleId = '1437124002630860841';
                    channelId = '1437112333909491813';
                    break;
                case 'game_rust':
                    roleId = 'ID_ROL_RUST'; // Completar con tu ID
                    channelId = '1437119379383914586';
                    break;
                default:
                    return;
            }

            await member.roles.add(roleId);

            await interaction.reply({ content: `✅ ¡Verificado! Ahora tienes acceso a tu sección.`, ephemeral: true });

            const channel = guild.channels.cache.get(channelId);
            if (channel) channel.send(`¡Bienvenido ${member}! Disfruta de la sección.`);
        }

        // ✅ Manejo de select menus
        if (interaction.isStringSelectMenu()) {
            const member = await guild.members.fetch(interaction.user.id);

            let roleId, channelId;

            switch (interaction.values[0]) {
                case 'game_ark':
                    roleId = '1437124002630860841';
                    channelId = '1437112333909491813';
                    break;
                case 'game_minecraft':
                    roleId = 'ID_ROL_MINECRAFT'; // Completar con tu ID
                    channelId = 'ID_CANAL_MINECRAFT'; // Completar con tu canal
                    break;
                case 'game_rust':
                    roleId = 'ID_ROL_RUST'; // Completar con tu ID
                    channelId = '1437119379383914586';
                    break;
                default:
                    return;
            }

            await member.roles.add(roleId);

            await interaction.reply({ content: `✅ ¡Verificado! Ahora tienes acceso a la sección de ${interaction.values[0].replace('game_', '')}.`, ephemeral: true });

            const channel = guild.channels.cache.get(channelId);
            if (channel) channel.send(`¡Bienvenido ${member}! Disfruta de la sección de ${interaction.values[0].replace('game_', '')}.`);
        }
    },
};
