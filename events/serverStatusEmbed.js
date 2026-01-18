const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const ping = require("net-ping"); // opcional para check de puertos

let statusMessageId = null;

async function startServerStatus(client) {
  // Se ejecuta cada minuto
  setInterval(async () => {
    for (const guild of client.guilds.cache.values()) {
      await updateGuild(client, guild);
    }
  }, 60000);

  // Ejecutamos al iniciar también
  for (const guild of client.guilds.cache.values()) {
    await updateGuild(client, guild);
  }
}

async function updateGuild(client, guild) {
  // 1️⃣ Categoría
  const category = await getOrCreateCategory(guild);

  // 2️⃣ Actualizar canales de servidores
  for (const server of config.servers) {
    const channel = guild.channels.cache.get(server.channelId);
    if (!channel) continue;

    const online = await checkServer(server.ip, server.port);
    await channel.setParent(category.id).catch(() => {});
    await channel.setName(`${online ? "🟢" : "🔴"} ${server.name}`).catch(() => {});
    server.online = online; // guardamos estado
  }

  // 3️⃣ Canal de mensaje único
  const statusChannel = guild.channels.cache.get(config.statusChannelId);
  if (!statusChannel) return;

  const content = generateStatusEmbed(config.servers);
  await updateStatusMessage(statusChannel, content);
}

async function getOrCreateCategory(guild) {
  let category = guild.channels.cache.find(
    c => c.type === 4 && c.name === config.statusCategory
  );

  if (!category) {
    category = await guild.channels.create({
      name: config.statusCategory,
      type: 4
    });
  }
  return category;
}

// ---- MENSAJE ÚNICO ----
async function updateStatusMessage(channel, embed) {
  let message;

  if (statusMessageId) {
    try {
      message = await channel.messages.fetch(statusMessageId);
      await message.edit({ embeds: [embed] });
      return;
    } catch (err) {
      statusMessageId = null; // si se borró
    }
  }

  message = await channel.send({ embeds: [embed] });
  statusMessageId = message.id;
}

// ---- GENERAR EMBED ----
function generateStatusEmbed(servers) {
  const embed = new EmbedBuilder()
    .setTitle("📡 Estado de los servidores")
    .setColor(0x00ff00)
    .setTimestamp();

  servers.forEach(s => {
    embed.addFields({
      name: s.name,
      value: s.online ? "🟢 ONLINE" : "🔴 OFFLINE",
      inline: true
    });
  });

  return embed;
}

// ---- CHECK SERVIDOR ----
async function checkServer(ip, port) {
  // Aquí tu check real
  // Ejemplo simplificado: true/false random
  // Puedes reemplazar con ping real o check de puerto
  return Math.random() > 0.3;
}

module.exports = { startServerStatus };
