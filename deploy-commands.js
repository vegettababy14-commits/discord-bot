const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

// Filtrar solo los que tengan `data` y `execute`
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    if (!command.data || !command.execute) {
        console.log(`❌ Ignorado: ${file} no es un slash command válido`);
        continue;
    }
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('🔄 Registrando comandos slash...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log('✅ Comandos slash registrados correctamente.');
    } catch (error) {
        console.error(error);
    }
})();
