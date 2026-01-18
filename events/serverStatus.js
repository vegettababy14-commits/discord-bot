const fs = require("fs");
const Gamedig = require("gamedig");

const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

async function checkServer(server) {
  try {
    const state = await Gamedig.query({
      type: server.type,  // 'ark', 'minecraft', 'rust', etc.
      host: server.ip,
      port: server.port
    });
    return { online: true, players: state.players.length };
  } catch (err) {
    return { online: false, players: 0 };
  }
}

async function startServerStatus(client) {
  console.log("Iniciando sistema de estado de servidores...");

  // Obtener la guild por ID
  const guild = client.guilds.cache.get(config.guildId);
  if (!guild) {
    console.error("No se encontró la guild. Verifica guildId en config.json");
    return;
  }
  console.log(`Guild encontrada: ${guild.name}`);

  // Crear categoría si no existe
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
      console.log(`Canal de voz creado: ${channel.name}`);
    }
  }

  // Canal de resumen
  let summaryChannel = guild.channels.cache.get(config.statusChannelId);
  if (!summaryChannel) console.warn("Canal de resumen no encontrado.");

  // Intervalo de actualización
  setInterval(async () => {
    let summary = "";

    for (const server of config.servers) {
      try {
        const { online, players } = await checkServer(server);

        // Renombrar canal de voz
        const channel = guild.channels.cache.get(server.channelId);
        if (channel && channel.type === 2) {
          const emoji = online ? "✅" : "🛑";
          await channel.setName(`${emoji} ${server.name} ${online ? `(${players})` : ""}`);
        }

        // Texto de resumen
        summary += `${online ? "✅" : "🛑"} **${server.name}** ${online ? `(${players})` : ""}\n`;
      } catch (err) {
        console.error(`Error actualizando ${server.name}:`, err);
      }
    }

    // Actualizar mensaje único en canal de resumen
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
  }, 60 * 1000);
}

module.exports = { startServerStatus };
