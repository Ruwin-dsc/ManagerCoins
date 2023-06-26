const { ActivityTypes } = require("oceanic.js");
const database = require("../../index");

module.exports = {
    name: "ready",
    async execute(manager) {

    let tk = await database.get("tokens") || [];
    const tk1 = tk.map((x) => x.token);

    await manager.editStatus("dnd", [{
          name: `v0.1 | ${tk1.length} clients`,
          type: ActivityTypes.STREAMING,
          url: "https://twitch.tv/hawk",
        }])
    console.log("[-] Manager is ready");
    }
}