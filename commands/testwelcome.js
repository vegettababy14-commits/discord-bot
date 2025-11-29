const generateWelcomeImage = require('../utils/generateWelcomeImage');

module.exports = {
    name: 'testwelcome',
    description: 'Genera la bienvenida de prueba',
    async execute(message, args) {
        const member = message.member; // usuario que ejecuta el comando
        const game = args[0] || 'ninguno'; // ejemplo: !testwelcome minecraft
        const attachment = await generateWelcomeImage(member, game);

        message.channel.send({ content: `¡Bienvenido/a ${member.user.username}!`, files: [attachment] });
    }
};
