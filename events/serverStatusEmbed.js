const { Client, TextChannel, VoiceChannel, CategoryChannel } = require("discord.js");
const net = require("net");
const fs = require("fs");

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

async function checkServer(ip, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = false;

    socket.setTimeout(timeout);

    socket.on("connect", () => {
      status = true;
      socket.destroy();
    });

    socket.on("timeout", () => socket.destroy());
    socket.on("error", () => {});
    socket.on("close", () => resolve(status));

    socket.connect(port, ip);
  });
}

async function startServerStatus(client) {
  // Obtener la guild (primer servidor donde está el bot)
  const guild = client.guilds.cache.first();
  if (!guild) return console.error("Bot no está en ninguna guild.");

  // Crear categoría si no existe
  let category = guild.channels.cache.find(
    (c) => c.name === config.statusCategory && c.type === 4
  );
  if (!category) {
    category = await guild.channels.create({
      name: config.statusCategory,
      type: 4, // Categoria
    });
  }

  // Crear canales de voz si no existen
  for (const server of config.servers) {
    let channel = guild.channels.cache.get(server.channelId);
    if (!channel) {
      channel = await guild.channels.create({
        name: server.name,
        type: 2, // Voz
        parent: category.id,
      });
      server.channelId = channel.id; // Guardar ID para el bot
    }
  }

  // Canal de resumen
  let summaryChannel = guild.channels.cache.get(config.statusChannelId);
  if (!summaryChannel) {
    console.warn("Canal de resumen no encontrado, se omitirá mensaje embed.");
  }

  // Intervalo de actualización
  setInterval(async () => {
    let summary = "";

    for (const server of config.servers) {
      const online = await checkServer(server.ip, server.port);

      // Renombrar canal de voz
      const channel = guild.channels.cache.get(server.channelId);
      if (channel && channel.type === 2) {
        const emoji = online ? "✅" : "🛑";
        await channel.setName(`${emoji} ${server.name}`);
      }

      // Texto de resumen
      summary += `${online ? "✅" : "🛑"} **${server.name}**\n`;
    }

    // Actualizar mensaje único en canal de resumen
    if (summaryChannel) {
      let messages = await summaryChannel.messages.fetch({ limit: 10 });
      let botMessage = messages.find((m) => m.author.id === client.user.id);

      if (botMessage) {
        await botMessage.edit({ content: summary });
      } else {
        await summaryChannel.send(summary);
      }
    }
  }, 60 * 1000); // Cada minuto
}

module.exports = { startServerStatus };
