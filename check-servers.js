// check-servers.js
require("dotenv").config();
const Gamedig = (...args) => require("gamedig").query(...args); // <-- workaround para CommonJS

const servers = process.env.MAP_SERVERS.split(",");

async function checkServers() {
  for (const entry of servers) {
    const [mapName, ip, port] = entry.split(":");
    console.log(`🔎 Comprobando servidor: ${mapName} (${ip}:${port})...`);

    try {
      const state = await Gamedig({
        type: "arkse",
        host: ip,
        port: Number(port)
      });

      console.log(`✅ ${mapName} está ONLINE`);
      console.log("   Jugadores:", state.players.length, "/", state.maxplayers);
    } catch (err) {
      console.log(`❌ ${mapName} OFFLINE o no responde`);
      console.log("   Error:", err.message);
    }

    console.log("---------------------------------------\n");
  }
}

checkServers();
