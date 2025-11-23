const { Client, GatewayIntentBits, AttachmentBuilder } = require('discord.js');
const Canvas = require('canvas');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Bot iniciado como: ${client.user.tag}`);
});

client.on('messageCreate', message => {
    if (message.author.bot) return;

    if (message.content === '!ping') {
        message.reply('🏓 Pong!');
    }
});

// Sistema de bienvenida
client.on('guildMemberAdd', async member => {
    const canal = member.guild.channels.cache.get("ID_DEL_CANAL");
    if (!canal) return;

    const canvas = Canvas.createCanvas(1000, 300);
    const ctx = canvas.getContext('2d');

    const background = await Canvas.loadImage('./img/fondo.png');
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.font = '50px Sans';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Bienvenido/a ${member.user.username}!`, 250, 150);

    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png' }));
    ctx.beginPath();
    ctx.arc(150, 150, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 50, 50, 200, 200);

    const attachment = new AttachmentBuilder(canvas.toBuffer(), { name: 'bienvenida.png' });
    canal.send({ content: `¡Bienvenido/a ${member}!`, files: [attachment] });
});

client.login(process.env.TOKEN);
