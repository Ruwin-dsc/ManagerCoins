const { ActivityTypes } = require("oceanic.js");
const database = require("../../index.js")

module.exports = {
    name: "ready",
    async execute(client) {
        console.log(`Ready as ${client.user.tag} (ID: ${client.user.id})`);

        let data = (await database.get("tokens")) || [];

        client.editStatus("dnd", [{
            name: data.find((x) => x.id == client.user.id) && data.find((x) => x.id == client.user.id).status || `&help | discord.gg/automod`,
            type: ActivityTypes.STREAMING,
            url: "https://twitch.tv/hawk",
          }])
    }
}