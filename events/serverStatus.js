const { ChannelType } = require("discord.js");
const dgram = require("dgram");

// ===== CONFIG =====
const CHECK_INTERVAL = 60 * 1000; // 1 minuto

// ===== FUNCION: comprobar si el servidor ARK responde =====
function checkArkServer(ip, port, timeout = 3000) {
  return new Promise((resolve) => {
    const socket = dgram.createSocket("udp4");
    const message = Buffer.from([
      0xff, 0xff, 0xff, 0xff,
      0x54,
      ...Buffer.from("Source Engine Query"),
      0x00
    ]);

    const timer = setTimeout(() => {
      socket.close();
      resolve(false);
    }, timeout);

    socket.on("message", () => {
      clearTimeout(timer);
      socket.close();
      resolve(true);
    });

    socket.send(message, port, ip, (err) => {
      if (err) {
        clearTimeout(timer);
        socket.close();
        resolve(false);
      }
    });
  });
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
  // Devolver la promesa de la primera actualización
  const firstUpdate = updateServerStatus(client);

  // Configurar loop
  setInterval(() => updateServerStatus(client).catch(console.error), CHECK_INTERVAL);

  return firstUpdate; // ahora se puede usar .catch() correctamente
}

module.exports = { startServerStatus };
