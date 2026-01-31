const { Rcon } = require('rcon-client');

const CATEGORY_ID = process.env.CATEGORY_ID;
const GUILD_ID = process.env.GUILD_ID;
const RCON_PASSWORD = process.env.ARK_RCON_PASSWORD || null;

const MAP_SERVERS = process.env.MAP_SERVERS
  .split(',')
  .map(s => {
    const [name, host, port] = s.split(':');
    return {
      name: name.toUpperCase(),
      host,
      port: Number(port),
    };
  });

async function updateServerStatus(client) {
  const guild = await client.guilds.fetch(GUILD_ID);
  const category = guild.channels.cache.get(CATEGORY_ID);

  if (!category) {
    console.error('❌ CATEGORY_ID no es una categoría válida');
    return;
  }

  // Solo canales de voz dentro de la categoría
  const voiceChannels = category.children.cache.filter(c => c.isVoiceBased());

  for (const server of MAP_SERVERS) {
    const channel = voiceChannels.find(c =>
      c.name.startsWith(server.name)
    );

    if (!channel) {
      console.warn(`⚠️ No existe canal para ${server.name}, se omite`);
      continue;
    }

    let status = 'Offline';

    if (!RCON_PASSWORD) {
      status = 'Sin RCON';
    } else {
      try {
        const rcon = await Rcon.connect({
          host: server.host,
          port: server.port,
          password: RCON_PASSWORD,
          timeout: 3000,
        });

        await rcon.send('listplayers');
        status = 'Online';
        rcon.end();
      } catch {
        status = 'Offline';
      }
    }

    const newName = `${server.name} - ${status}`;

    if (channel.name !== newName) {
      await channel.setName(newName);
      console.log(`🔄 ${server.name} → ${status}`);
    }
  }
}

async function startServerStatus(client) {
  console.log('Iniciando actualización inmediata de servidores...');
  await updateServerStatus(client);
  setInterval(() => updateServerStatus(client), 30000);
}

module.exports = { startServerStatus };
