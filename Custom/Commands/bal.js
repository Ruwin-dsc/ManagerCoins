let database = require("../../index.js")

module.exports = {
    name: "balance",
    aliases: ["bal", "coins", "bank"],
    description: "- Vous permet de voir votre inventaire",
    usage: "- bal @user",
    async execute(client, message, args) {

        let mention = message.mentions.members.length > 0 ? message.mentions.members[0] : null;
        let member = mention || message.member;
        let userData = await database.get(`${message.guild.id}_${member.user.id}_userdata`) || { user: member.user.id};
      
        let embed = {
            footer: {
                text: client.footer,
            },
            timestamp: new Date().toISOString(),
            color: client.color,
            author: {
              name: member.user.tag,
              iconURL: member.user.avatarURL()
            },
            description: `
            **${member.user.username}** a\n:coin: **${parseInt(userData.balance) || "0"}** coins en poche\n:bank: **${parseInt(userData.bank) || "0"}** coins en banque\n:small_red_triangle: **${userData.reputation || "0"}** points de réputation`
          }
      
          message.channel.createMessage({  embeds: [embed], messageReference: { messageID: message.id}})      

    }
}
