let database = require("../../index.js")
const config = require("../../index.js")

module.exports = {
    name: "add",
    permission: "MANAGE_GUILD",
    aliases: ["ajouter"],
    description: "- Vous permet d'ajouter de l'argent a un utilisateur",
    usage: "- add <bank/reputation/balance> <somme> @user",
    async execute(client, message, args) {

        let type;
        let emoji;
        let member = message.mentions.members.length > 0 ? message.mentions.members[0] : null;
        if(!member) return message.channel.createMessage({ content: `:warning: Utilisateur Invalide`, messageReference: { messageID: message.id} })      
        let userData = await database.get(`${message.guild.id}_${member.user.id}_userdata`) || { user: member.user.id };

        if(!args[2]) return message.channel.createMessage({ content: ":x: Merci de préciser un montant à ajouter"})
        if(!parseInt(args[1]) > 0) return message.channel.createMessage({ content: ":x: Ceci n'est pas un chiffre valide !"})
        
        if(args[1] == "bank" )  {
            userData.bank = (parseInt(authorData.bank) || 0) + parseInt(args[2])
            type = 'coins dans la banque'
            emoji = ":bank:"
        } else if(args[1] == "balance") {
            userData.balance = (parseInt(userData.balance) || 0) + parseInt(args[2])
            type = 'coins dans votre poche'
            emoji = ":coin:"
        } else if(args[1] == "reputation") {
            userData.reputation = (parseInt(userData.reputation) || 0) + parseInt(args[2])
            type = 'de reputation'
            emoji = ":small_red_triangle:"
        } else {
            return message.channel.createMessage({ content: ":x: Vous devez spécifier si il s'agit de la `reputation`, la `balance` ou la `bank` !"})
        }

        await database.set(`${message.guild.id}_${member.user.id}_userdata`, userData)

        await message.channel.createMessage({content: `${emoji} Vous venez de d'ajouter à ${member.user.username}, ${args[1]} ${type} !`})
    }
}