const Gamedig = require('gamedig');

const CATEGORY_ID = process.env.CATEGORY_ID;
const GUILD_ID = process.env.GUILD_ID;

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

  if (!category || !category.isGuildCategory()) {
    console.error('❌ CATEGORY_ID no es una categoría válida');
    return;
  }

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

    try {
      await Gamedig.query({
        type: 'arkse',
        host: server.host,
        port: server.port,
        socketTimeout: 3000,
        maxAttempts: 1,
      });

      status = 'Online';
    } catch {
      status = 'Offline';
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
