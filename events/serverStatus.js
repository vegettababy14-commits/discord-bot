const { ChannelType } = require("discord.js");
const Gamedig = require("gamedig");

// ===== CONFIG =====
const CHECK_INTERVAL = 60 * 1000; // 1 minuto

// ===== FUNCION: comprobar si el servidor ARK responde =====
async function checkArkServer(ip, port) {
  try {
    const state = await Gamedig.query({
      type: "arkse",
      host: ip,
      port: Number(port)
    });
    return true; // el servidor respondió
  } catch (err) {
    return false; // no respondió o está offline
  }
}

// ===== FUNCION PRINCIPAL =====
async function updateServerStatus(client) {
  const guild = await client.guilds.fetch(process.env.GUILD_ID);
  await guild.channels.fetch();

  const categoryId = process.env.CATEGORY_ID;
  const servers = process.env.MAP_SERVERS.split(",");

  for (const entry of servers) {
    const [mapName, ip, port] = entry.split(":");

    const baseName = `ARK | ${mapName}`;

    // 🔎 Buscar canal existente
    let channel = guild.channels.cache.find(
      c =>
        c.type === ChannelType.GuildVoice &&
        c.parentId === categoryId &&
        c.name.startsWith(baseName)
    );

    // ➕ Crear canal SOLO si no existe
    if (!channel) {
      channel = await guild.channels.create({
        name: `${baseName} - Checking...`,
        type: ChannelType.GuildVoice,
        parent: categoryId,
      });

      console.log(`Canal creado para ${mapName}`);
    }

    // 🌐 Comprobar estado del servidor
    const online = await checkArkServer(ip, Number(port));

    const newName = online
      ? `${baseName} - 🟢 Online`
      : `${baseName} - 🔴 Offline`;

    // ✏️ Actualizar nombre SOLO si cambia
    if (channel.name !== newName) {
      await channel.setName(newName);
      console.log(`Servidor ${mapName} actualizado: ${online ? "Online" : "Offline"}`);
    }
  }
}

// ===== LOOP =====
function startServerStatus(client) {
  // Primera actualización y devolver promesa
  const firstUpdate = updateServerStatus(client);

  // Loop con captura de errores
  setInterval(() => {
    updateServerStatus(client).catch(console.error);
  }, CHECK_INTERVAL);

  return firstUpdate;
}

module.exports = { startServerStatus };
