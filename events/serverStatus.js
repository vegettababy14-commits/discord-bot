const fs = require("fs");
const Gamedig = require("gamedig");

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

// Función para consultar servidor de ARK
async function checkServer(server) {
  try {
    const state = await Gamedig.query({
      type: "ark",
      host: server.ip,
      port: server.port,
    });
    return { online: true, players: state.players.length };
  } catch (err) {
    return { online: false, players: 0 };
  }
}

// Función que actualiza todos los servidores
async function updateServerStatus(client) {
  // Obtener guild de manera segura
  let guild;
  try {
    guild = await client.guilds.fetch(config.guildId);
  } catch (err) {
    console.error("No se pudo obtener la guild:", err);
    return;
  }

  // Obtener canal de resumen de manera segura
  let summaryChannel;
  try {
    summaryChannel = await guild.channels.fetch(config.statusChannelId);
  } catch (err) {
    console.warn("No se pudo obtener el canal de resumen:", err);
  }

  // Categoría
  let category = guild.channels.cache.find(
    (c) => c.name === config.statusCategory && c.type === 4
  );
  if (!category) {
    category = await guild.channels.create({
      name: config.statusCategory,
      type: 4, // Categoria
    });
    console.log("Categoría de estado creada:", category.name);
  }

  let summary = "";

  for (const server of config.servers) {
    // Crear canal de voz si no existe
    let channel = guild.channels.cache.get(server.channelId);
    if (!channel) {
      channel = await guild.channels.create({
        name: server.name,
        type: 2, // Voz
        parent: category.id,
      });
      server.channelId = channel.id;
    }

    // Consultar estado del servidor
    const { online, players } = await checkServer(server);

    // Actualizar nombre del canal de voz
    const emoji = online ? "✅" : "🛑";
    const newName = online
      ? `${emoji} ${server.name} (${players})`
      : `${emoji} ${server.name}`;
    if (channel.name !== newName) await channel.setName(newName);

    // Construir mensaje de resumen
    summary += `${emoji} **${server.name}** ${online ? `(${players})` : ""}\n`;
  }

  // Actualizar mensaje en canal de resumen
  if (summaryChannel) {
    try {
      let messages = await summaryChannel.messages.fetch({ limit: 10 });
      let botMessage = messages.find((m) => m.author.id === client.user.id);
      if (botMessage) await botMessage.edit({ content: summary });
      else await summaryChannel.send(summary);
    } catch (err) {
      console.error("Error actualizando canal de resumen:", err);
    }
  }
}

// Función principal para iniciar el sistema
async function startServerStatus(client) {
  console.log("Iniciando sistema de estado de servidores...");

  // Primera actualización inmediata
  await updateServerStatus(client);

  // Intervalo cada minuto
  setInterval(() => updateServerStatus(client), 60 * 1000);
}

module.exports = { startServerStatus };
