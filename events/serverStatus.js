const { Client, GatewayIntentBits } = require('discord.js');
const Rcon = require('rcon-client').Rcon;
const client = require('../index'); // Ajusta según tu estructura
const { CATEGORY_ID, MAP_SERVERS } = process.env; // CATEGORY_ID = categoría donde crear los canales

// MAP_SERVERS debe estar en el .env así:
// MAP_SERVERS='Aberration:IP:PORT,Ragnarok:IP:PORT,TheIsland:IP:PORT,Extinction:IP:PORT'

const parseMapServers = () => {
  const maps = {};
  MAP_SERVERS.split(',').forEach(entry => {
    const [name, ip, port] = entry.split(':');
    maps[name] = { ip, port };
  });
  return maps;
};

const mapServers = parseMapServers();

async function updateServerStatus() {
  const guild = client.guilds.cache.first(); // Ajusta si tienes más de un servidor
  const category = guild.channels.cache.get(CATEGORY_ID);
  if (!category) {
    console.error('Categoría no encontrada para los canales de voz');
    return;
  }

  for (const mapName in mapServers) {
    const server = mapServers[mapName];
    let channel = category.children.find(c => c.name.startsWith(mapName));
    
    // Si no existe, creamos el canal de voz automáticamente
    if (!channel) {
      channel = await guild.channels.create({
        name: `${mapName}: Offline`,
        type: 2, // Canal de voz
        parent: CATEGORY_ID,
      });
      console.log(`Canal creado automáticamente: ${mapName}`);
    }

    try {
      const rcon = await Rcon.connect({
        host: server.ip,
        port: parseInt(server.port),
      });

      const status = await rcon.send('status'); // Ajusta según tu comando RCON
      const isOnline = status.includes('players'); // Ejemplo simple
      const newName = `${mapName}: ${isOnline ? 'Online' : 'Offline'}`;
      await channel.edit({ name: newName });
      console.log(`${mapName} actualizado: ${isOnline ? 'Online' : 'Offline'}`);

      await rcon.end();
    } catch (err) {
      console.error(`Error actualizando canal ${mapName}:`, err.message);
      await channel.edit({ name: `${mapName}: Offline` });
    }
  }
}

// Ejecutamos al iniciar y cada 30s
client.on('clientReady', () => {
  console.log('Iniciando sistema de estado de servidores...');
  updateServerStatus();
  setInterval(updateServerStatus, 30000);
});

module.exports = { updateServerStatus };
