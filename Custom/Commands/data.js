let database = require("../../index.js");

module.exports = {
  name: "data",
  ownerOnly: true,
  usage: "- data",
  description: "- Vous permet de récupérer toutes les données du bot",
  async execute(client, message) {
    let data = (await database.all()) || {};

    let formattedData = Object.entries(data).map(([id, value]) => JSON.stringify(value));
    let formattedMessage = ("```" + formattedData.join("\n\n") + "```").replace("``````", "```Rien```");

    message.channel.createMessage({ content: formattedMessage });
  }
};
