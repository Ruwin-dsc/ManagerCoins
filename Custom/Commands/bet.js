let database = require("../../index")

module.exports = {
    name: "bet",
    description: "- Vous permet de lancer un pari",
    usage: "- bet <somme>",
    aliases: ["parier"],
    async execute(client, message, args) {
        let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

        let betAmount = parseInt(args[0]);

        if (isNaN(betAmount) || betAmount <= 0) {
            return client.throwError(message, "Veuillez spécifier un montant de pari valide !");
        }

        if (betAmount > (parseInt(authorData.balance) || 0)) {
            return client.throwError(message, "Vous n'avez pas suffisamment de pièces pour effectuer ce pari !");
        }

        let winChance = 0.5; 
        let random = Math.random();

        if (random < winChance) {
            let winnings = Math.floor(betAmount * 2); 
            authorData.balance = (parseInt(authorData.balance) || 0) + winnings;
            message.channel.createMessage({ content: `Félicitations, vous avez gagné ${winnings} pièces !`});
        } else {
            authorData.balance = (parseInt(authorData.balance) || 0) - betAmount; 
            message.channel.createMessage({ content: `Dommage, vous avez perdu ${betAmount} pièces.`});
        }

        await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);
    },
}