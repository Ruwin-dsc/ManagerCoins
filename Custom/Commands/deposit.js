let database = require("../../index.js");
const config = require("../../index.js");

module.exports = {
  name: "dep",
  aliases: ["deposit"],
  usage: "- dep <somme>",
  description: "- Vous permet de déposez de l'argent en banque",
  async execute(client, message, args) {
    let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: member.author.id};

    if (!authorData.balance || authorData.balance === "0") return client.throwError(message, "Vous n'avez plus d'argent en banque pour retirer !");

    if (args[0] === "all") {
      authorData.bank = (parseInt(authorData.balance) || 0) + (parseInt(authorData.bank) || 0);
      authorData.balance = "0";

      client.throwSuccess(message, "Vous venez de deposer tout votre argent avec succès.");
    } else {
      if (!args[0] || isNaN(parseInt(args[0]))) return client.throwError(message, "Vous devez spécifier le montant de votre depôt !");
      if (parseInt(args[0]) > authorData.bank) return client.throwError(message, "Vous n'avez pas autant d'argent dans vos poches !");

      authorData.bank = (parseInt(authorData.bank) || 0) + parseInt(args[0]);
      authorData.balance = (parseInt(authorData.balance) || 0) - parseInt(args[0]);

      client.throwSuccess(message, `Vous venez de deposer **${args[0]}** pièces avec succès.`);
    }

    await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);
  },
};
