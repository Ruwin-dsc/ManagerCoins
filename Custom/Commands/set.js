let database = require("../../index.js")
const config = require("../../index.js")

module.exports = {
    name: "set",
    permission: "MANAGE_GUILD",
    aliases: ["mettre"],
    async execute(client, message, args) {
        let member = message.mentions.members.length > 0 ? message.mentions.members[0] : null;
        if(!member) return message.channel.createMessage({ content: `:x: \`ERROR\` Pas de membre trouvé !`, messageReference: { messageID: message.id} })      
        let userData = await database.get(`${message.guild.id}_${member.user.id}_userdata`) || { user: member.user.id };

        if(args[1] == "bank" )  {
            userData.bank = parseInt(args[0])

        } else if(args[1] == "balance") {
            userData.balance = parseInt(args[0])

        } else if(args[1] == "reputation") {
            userData.reputation = parseInt(args[0])

        } else {
            return message.channel.createMessage({ content: ":x: Vous devez spécifier si il s'agit de la `reputation`, la `balance` ou la `bank` !"})
        }

        if(!args[0] || !parseInt(args[0]) > 0) return message.channel.createMessage({ content: "Montant invalide !"})

        await database.set(`${message.guild.id}_${member.user.id}_userdata`, userData)

        message.createReaction("✅")
    }
}