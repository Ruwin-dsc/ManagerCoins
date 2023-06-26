let database = require("../../index.js")
const config = require("../../index.js")

module.exports = {
    name: "pay",
    aliases: [],
    async execute(client, message, args) {
        let member = message.mentions.members.length > 0 ? message.mentions.members[0] : null;
        if(!member) return message.channel.createMessage({ content: `:x: \`ERROR\` Pas de membre trouvé !`, messageReference: { messageID: message.id} })      
        
        let userData = await database.get(`${message.guild.id}_${member.user.id}_userdata`) || { user: member.user.id};
        let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id};
        
        if(!args[1]) return message.channel.createMessage({content: ":x: Merci de préciser un montant à payer", messageReference: { messageID: message.id}})

        let nomoney = {
            color: client.color,
            footer: {
              text: message.author.username,
              iconURL: message.author.avatarURL()
            },
            description: ':x: Vous n\'avez pas assez de coins !'
        }
        if(!authorData.balance || authorData.balance == "0") return message.channel.createMessage({embeds: [nomoney], messageReference: { messageID: message.id}})

        if(isNaN(parseInt(args[1]))) return message.channel.createMessage({content: ":x: Ceci n'est pas un chiffre valide !", messageReference: { messageID: message.id}})
        if(args[1] > authorData.balance) return message.channel.createMessage({embeds: [nomoney], messageReference: { messageID: message.id}})

        authorData.balance = (parseInt(authorData.balance) || 0) -  parseInt(args[1])
        userData.balance = (parseInt(userData.balance) || 0) + parseInt(args[1])

        await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);
        await database.set(`${message.guild.id}_${member.user.id}_userdata`, userData);

        message.channel.createMessage({content: `:coin: Vous venez de payer ${member.user.tag} un montant de ${args[1]} coins`, messageReference: { messageID: message.id}})


    }

}