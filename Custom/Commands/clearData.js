let database = require("../../index.js")

module.exports = {
    name: "clearData",
    description: "- Vous permet de supprimer toutes les données du bot",
    usage: "- clearData",
    ownerOnly: true,
    async execute(client, message) {
        await database.deleteAll()
        message.createReaction("🪄")
    }
}