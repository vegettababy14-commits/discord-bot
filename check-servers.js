const Gamedig = require("gamedig").default; // <-- importante .default

const servers = [
  "TheIsland:127.0.0.1:27015",
  "Aberration:127.0.0.1:27020"
];

async function checkServers() {
  for (const entry of servers) {
    const [mapName, ip, port] = entry.split(":");
    console.log(`🔎 Comprobando servidor: ${mapName} (${ip}:${port})...`);

    try {
      const state = await Gamedig.query({
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
