const { startServerStatus } = require("../events/serverStatus");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} está listo!`);
    startServerStatus(client);
  },
};
