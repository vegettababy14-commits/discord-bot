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

        // ============================================
        // ✅ MANEJO DE BOTONES
        // ============================================
        if (interaction.isButton()) {
            const member = await guild.members.fetch(interaction.user.id);

            let rolesToAdd = [];
            let channelId;

            switch (interaction.customId) {

                case 'game_ark':
                    rolesToAdd = [
                        '1437111886918324396', // Rol ARK 1
                    ];
                    channelId = '1437112333909491813';
                    break;

                case 'game_rust':
                    rolesToAdd = ['ID_ROL_RUST']; // Completar
                    channelId = '1437119379383914586';
                    break;

                default:
                    return;
            }

            // ➡️ Añadir múltiples roles
            for (const r of rolesToAdd) {
                await member.roles.add(r).catch(() => {});
            }

            await interaction.reply({ content: `✅ ¡Verificado! Ahora tienes acceso a tu sección.`, ephemeral: true });

            const channel = guild.channels.cache.get(channelId);
            if (channel) channel.send(`¡Bienvenido ${member}! Disfruta de la sección.`);
        }

        // ============================================
        // ✅ MANEJO DE SELECT MENUS
        // ============================================
        if (interaction.isStringSelectMenu()) {
            const member = await guild.members.fetch(interaction.user.id);

            let rolesToAdd = [];
            let channelId;

            switch (interaction.values[0]) {

                case 'game_ark':
                    rolesToAdd = [
                        '1437111886918324396', // Rol ARK 1
                    ];
                    channelId = '1437112333909491813';
                    break;

                case 'game_minecraft':
                    rolesToAdd = ['ID_ROL_MINECRAFT'];
                    channelId = 'ID_CANAL_MINECRAFT';
                    break;

                case 'game_rust':
                    rolesToAdd = ['ID_ROL_RUST'];
                    channelId = '1437119379383914586';
                    break;

                default:
                    return;
            }

            // ➡️ Añadir múltiples roles
            for (const r of rolesToAdd) {
                await member.roles.add(r).catch(() => {});
            }

            await interaction.reply({
                content: `✅ ¡Verificado! Ahora tienes acceso a la sección de ${interaction.values[0].replace('game_', '')}.`,
                ephemeral: true
            });

            // Si quieres activar el mensaje de bienvenida del select menu, solo descomenta:
            //
            // const channel = guild.channels.cache.get(channelId);
            // if (channel) channel.send(`¡Bienvenido ${member}! Disfruta de la sección.`);
        }
    },
};
