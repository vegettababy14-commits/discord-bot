const { startServerStatus } = require("../events/serverStatus");
module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    startServerStatus(client);
  }
};
