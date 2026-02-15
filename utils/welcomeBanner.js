const { createCanvas, loadImage } = require('@napi-rs/canvas');

module.exports = async function sendWelcomeBanner(member, canal) {
    // Crear un canvas de 800x250
    const canvas = createCanvas(800, 250);
    const ctx = canvas.getContext('2d');

    // Cargar fondo (puede ser PNG o GIF)
    const background = await loadImage('https://i.imgur.com/0j7VLJJ.jpeg'); // tu banner
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Avatar del usuario
    const avatar = await loadImage(member.user.displayAvatarURL({ extension: 'png' }));
    ctx.drawImage(avatar, 50, 50, 150, 150);

    // Texto de bienvenida
    ctx.fillStyle = '#ffffff';
    ctx.font = '40px sans-serif';
    ctx.fillText(`¡Bienvenido ${member.user.username}!`, 220, 120);

    ctx.font = '25px sans-serif';
    ctx.fillText('¡Disfruta del servidor!', 220, 170);

    // Enviar al canal
    const buffer = canvas.toBuffer('image/png');
    canal.send({ files: [buffer] });
};
