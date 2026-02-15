// deploy-commands.js
const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

// Revisa que las variables necesarias existan
if (!process.env.TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
    console.error('❌ Faltan variables en .env (TOKEN, CLIENT_ID o GUILD_ID)');
    process.exit(1);
}

// Cargar comandos válidos
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    // Solo registrar comandos que tengan data (SlashCommandBuilder)
    if (!command.data) {
        console.warn(`⚠️ Comando "${file}" no tiene data y se omitirá`);
        continue;
    }

    commands.push(command.data.toJSON());
}

if (commands.length === 0) {
    console.log('⚠️ No hay comandos válidos para registrar');
    process.exit(0);
}

// Registrar comandos en el servidor (Guild) para pruebas rápidas
const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log(`🚀 Registrando ${commands.length} comandos slash...`);
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log(`✅ Comandos registrados: ${commands.map(c => c.name).join(', ')}`);
    } catch (error) {
        console.error('❌ Error registrando comandos:');
        console.error(error);
    }
})();
