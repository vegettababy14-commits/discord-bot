const { startServerStatus } = require("./serverStatus");

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} está listo!`);

    try {
      startServerStatus(client);
    } catch (err) {
      console.error("Error iniciando estado de servidores:", err);
    }
  },
};
