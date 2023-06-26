let database = require("../../index.js");
const config = require("../../index.js");

module.exports = {
  name: "with",
  aliases: ["withdraw"],
  async execute(client, message, args) {

    let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id};

    if (!authorData.bank || authorData.bank === "0") return client.throwError(message, "Vous n'avez plus d'argent en banque pour retirer !");

    if (args[0] === "all") {
      authorData.balance = (parseInt(authorData.balance)  || 0) + (parseInt(authorData.bank) || 0);
      authorData.bank = "0";

      client.throwSuccess(message, "Vous venez de deoiser tout votre argent avec succès.");
    } else {
      if (!args[0] || isNaN(parseInt(args[0]))) return client.throwError(message, "Vous devez spécifier le montant de votre depôt !");
      if (parseInt(args[0]) > authorData.bank) return client.throwError(message, "Vous n'avez pas autant d'argent dans vos poches !");

      authorData.balance = (parseInt(authorData.balance) || 0) + parseInt(args[0]);
      authorData.bank = (parseInt(authorData.bank) || 0) - parseInt(args[0]);

      client.throwSuccess(message, `Vous venez de deposer **${args[0]}** pièces avec succès.`);
    }

    await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);
  },
};