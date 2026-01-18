// serverStatus.js
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');
const Rcon = require('rcon-client').Rcon;
const client = require('./index.js'); // tu cliente exportado desde index.js

const MAP_SERVERS = process.env.MAP_SERVERS; // "Aberration:IP:PORT,TheIsland:IP:PORT,..."
const CATEGORY_ID = process.env.CATEGORY_ID;

if (!MAP_SERVERS || !CATEGORY_ID) {
  console.error('❌ MAP_SERVERS o CATEGORY_ID no definidos en .env');
  process.exit(1);
}

// Parseamos los mapas
function parseMapServers() {
  const mapList = {};
  MAP_SERVERS.split(',').forEach(entry => {
    const [name, host, port] = entry.split(':');
    if (name && host && port) {
      mapList[name] = { host, port: Number(port) };
    }
  });
  return mapList;
}

const maps = parseMapServers();

// Función para crear o actualizar el canal de voz
async function updateMapChannel(mapName, status) {
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) return console.error('❌ Guild no encontrada');

  const category = guild.channels.cache.get(CATEGORY_ID);
  if (!category || category.type !== ChannelType.GuildCategory)
    return console.error('❌ Category inválida');

  // Buscar canal de voz existente
  let channel = guild.channels.cache.find(
    c => c.name.toLowerCase().includes(mapName.toLowerCase()) && c.type === ChannelType.GuildVoice
  );

  // Si no existe, lo creamos
  if (!channel) {
    channel = await guild.channels.create({
      name: `${mapName}: ${status}`,
      type: ChannelType.GuildVoice,
      parent: CATEGORY_ID,
    });
    console.log(`✅ Canal creado para ${mapName}`);
    return;
  }

  // Si existe, actualizamos su nombre
  await channel.setName(`${mapName}: ${status}`);
  console.log(`🔄 ${mapName} actualizado: ${status}`);
}

// Función para comprobar el estado del servidor vía RCON
async function checkServer(map) {
  try {
    const rcon = await Rcon.connect({
      host: map.host,
      port: map.port,
    });
    await rcon.end();
    return 'Online';
  } catch (e) {
    return 'Offline';
  }
}

// Función principal
async function updateServerStatus() {
  for (const [mapName, mapInfo] of Object.entries(maps)) {
    const status = await checkServer(mapInfo);
    await updateMapChannel(mapName, status);
  }
}

// Iniciamos cuando el cliente esté listo
if (client.isReady()) {
  updateServerStatus();
  setInterval(updateServerStatus, 60_000); // cada 1 minuto
} else {
  client.once('clientReady', () => {
    updateServerStatus();
    setInterval(updateServerStatus, 60_000);
  });
}

module.exports = { updateServerStatus };
