const Canvas = require('canvas');
const { AttachmentBuilder } = require('discord.js');
const path = require('path');

/**
 * Genera la imagen de bienvenida
 * @param {GuildMember} member - El miembro que se une
 * @param {string} game - Nombre del juego para instrucciones dinámicas
 * @returns {AttachmentBuilder} - Archivo listo para enviar
 */
async function generateWelcomeImage(member, game = 'ninguno') {
    const canvas = Canvas.createCanvas(1000, 400); // tamaño tipo tarjeta
    const ctx = canvas.getContext('2d');

    // Fondo
    const background = await Canvas.loadImage(path.join(__dirname, '../img/fondo.png'));
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Instrucciones dinámicas según el juego
    let instructions = '';
    switch (game.toLowerCase()) {
        case 'minecraft':
            instructions = '💎 Recuerda verificar tu cuenta con tu nombre de usuario de Minecraft.';
            break;
        case 'rust':
            instructions = '🔧 Verifica tu cuenta y conecta con tu perfil de Rust.';
            break;
        case 'ark':
            instructions = '🦖 Sigue los pasos para validar tu personaje de ARK.';
            break;
        default:
            instructions = '🎮 Recuerda verificar tu cuenta según el juego que escojas.';
            break;
    }

    // Texto de instrucciones
    ctx.font = '28px Sans';
    ctx.fillStyle = '#ffeb3b'; // amarillo llamativo
    ctx.fillText(instructions, 50, 50);

    // Texto de bienvenida
    ctx.font = '50px Sans';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Bienvenido/a ${member.user.username}!`, 250, 250);

    // Avatar circular
    const avatar = await Canvas.loadImage(member.user.displayAvatarURL({ extension: 'png' }));
    ctx.beginPath();
    ctx.arc(150, 250, 100, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 50, 150, 200, 200);

    // Crear archivo adjunto
    return new AttachmentBuilder(canvas.toBuffer(), { name: 'bienvenida.png' });
}

module.exports = generateWelcomeImage;
