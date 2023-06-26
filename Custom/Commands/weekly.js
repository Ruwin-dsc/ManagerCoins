const database = require("../../index");
const ms = require("ms");

module.exports = {
  name: "weekly",
  aliases: ["wk"],
  async execute(client, message) {
    let data = await database.get(`${message.guild.id}_config`) || {};

    let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

    if (!data || !data.weekly || !data.weekly.max > 0) {
        return message.channel.createMessage({
            content: ':x: La commande weekly n\'a pas été configurée dans ce serveur !',
            messageReference: { messageID: message.id },
        });
    }

    if (authorData.cooldowns && authorData.cooldowns.weekly > Date.now())
    return client.throwError(
      message,
      `Vous avez déjà récuperé votre daily quelqu'un ! Vous pourrez retravailler <t:${Math.floor(
          authorData.cooldowns.weekly / 1000
      )}:R>`
    );

    let maxCoins = parseInt(data.weekly.max) || 0
    let minCoins = parseInt(data.weekly.min) || 0
    let earnedCoins = Math.floor(Math.random() * (parseInt(maxCoins) - parseInt(minCoins) + 1)) + parseInt(minCoins)

    authorData.balance = (parseInt(authorData.balance) || 0) + (parseInt(earnedCoins) || 0)
    authorData.cooldowns ? authorData.cooldowns.weekly = Date.now() + 604800000 : authorData.cooldowns = { weekly: Date.now() + 604800000 }

    await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);

    message.channel.createMessage({ content: `📆 Vous avez récupéré **${earnedCoins}** pièces grâce à votre weekly !`});
  },
};