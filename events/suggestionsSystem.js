const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (message.author.bot) return;

    // 👉 ID del canal donde los usuarios envían sugerencias
    if (message.channel.id !== '1437112875779887266') return;

    // 👉 ID del canal donde se revisan
    const reviewChannel = await client.channels.fetch('1437110884127215796');

    const embed = new EmbedBuilder()
      .setTitle('📩 Nueva sugerencia')
      .setDescription(message.content)
      .setColor(0x3498db)
      .setFooter({
        text: `Enviada por ${message.author.tag}`,
        iconURL: message.author.displayAvatarURL()
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`sugerencia_aceptar_${message.author.id}`)
        .setLabel('Aceptar')
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId(`sugerencia_rechazar_${message.author.id}`)
        .setLabel('Rechazar')
        .setStyle(ButtonStyle.Danger)
    );

    await reviewChannel.send({
      embeds: [embed],
      components: [row]
    });

    // Borra el mensaje original
    await message.delete();
  }
};
