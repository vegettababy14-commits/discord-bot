require('dotenv').config();
const { REST, Routes } = require('discord.js');

(async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        const commands = await rest.get(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
        );
        console.log('Comandos registrados en el servidor:');
        console.log(commands);
    } catch (err) {
        console.error(err);
    }
})();
