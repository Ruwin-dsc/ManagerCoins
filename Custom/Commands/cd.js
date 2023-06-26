let database = require("../../index");

module.exports = {
    name: "cooldowns",
    aliases: ["cd", "cooldown", "timers"],
    description: "- Vous permet de voir la liste de vos cooldowns",
    usage: "- cooldowns",
    async execute(client, message) {
        let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

        let embed = {
            footer: {
                text: client.footer,
            },
            timestamp: new Date().toISOString(),
            color: client.color,
            title: "・⏱️ Vos Cooldowns:",
            description: 
            `💰 **Rob:** ${authorData.cooldowns && authorData.cooldowns.rob && authorData.cooldowns.rob > Date.now() ? `<t:${Math.floor(authorData.cooldowns.rob / 1000)}:R>` : ":white_check_mark:"} \n🔨 **Work:**  ${authorData.cooldowns && authorData.cooldowns.work && authorData.cooldowns.work > Date.now() ? `<t:${Math.floor(authorData.cooldowns.work / 1000)}:R>` : ":white_check_mark:"} \n⏰ **Daily:**  ${authorData.cooldowns && authorData.cooldowns.daily && authorData.cooldowns.daily > Date.now() ? `<t:${Math.floor(authorData.cooldowns.daily / 1000)}:R>` : ":white_check_mark:"}\n📆 **Weekly:**  ${authorData.cooldowns && authorData.cooldowns.weekly && authorData.cooldowns.weekly > Date.now() ? `<t:${Math.floor(authorData.cooldowns.weekly / 1000)}:R>` : ":white_check_mark:"}\n:small_red_triangle: **Réputation:**  ${authorData.cooldowns && authorData.cooldowns.reputation && authorData.cooldowns.reputation > Date.now() ? `<t:${Math.floor(authorData.cooldowns.reputation / 1000)}:R>` : ":white_check_mark:"} `,
            fields: [
                { name: "・⚒️ Métiers", value: `🎣 **Pêcheur:** ${authorData.cooldowns && authorData.cooldowns.fish && authorData.cooldowns.fish > Date.now() ? `<t:${Math.floor(authorData.cooldowns.fish / 1000)}:R>` : ":white_check_mark:"}\n🏦 **Braqueur:** ${authorData.cooldowns && authorData.cooldowns.braqueur && authorData.cooldowns.braqueur > Date.now() ? `<t:${Math.floor(authorData.cooldowns.braqueur / 1000)}:R>` : ":white_check_mark:"}`}
            ]
        }

        message.channel.createMessage({ embeds: [embed]})
    }
}