const Gamedig = require("gamedig");

// ===== CONFIG =====
// Lista de servidores en formato: "Mapa:IP:Puerto"
const servers = process.env.MAP_SERVERS
  ? process.env.MAP_SERVERS.split(",")
  : [
      "TheIsland:127.0.0.1:27015", // ejemplo si no tienes MAP_SERVERS
    ];

async function checkServers() {
  for (const entry of servers) {
    const [mapName, ip, port] = entry.split(":");
    console.log(`🔎 Comprobando servidor: ${mapName} (${ip}:${port})...`);

    try {
      const state = await Gamedig.query({
        type: "arkse",
        host: ip,
        port: Number(port),
        maxAttempts: 3, // intenta 3 veces en caso de fallo
        socketTimeout: 5000, // espera hasta 5s por respuesta
      });

      console.log(`✅ ${mapName} está ONLINE`);
      console.log("   Jugadores:", state.players.length, "/", state.maxplayers);
      console.log("   Estado completo:", state);
    } catch (err) {
      console.log(`❌ ${mapName} OFFLINE o no responde`);
      console.error("   Error:", err.message);
    }

    console.log("---------------------------------------\n");
  }
}

// Ejecutar diagnóstico
checkServers();
