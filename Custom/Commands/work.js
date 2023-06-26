const database = require("../../index");
const ms = require("ms");

module.exports = {
  name: "work",
  async execute(client, message) {
    let data = await database.get(`${message.guild.id}_config`) || {};

    let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

    if (!data || !data.work || !data.work.max > 0) {
        return message.channel.createMessage({
            content: ':x: La commande work n\'a pas été configurée dans ce serveur !',
            messageReference: { messageID: message.id },
        });
    }

    if (authorData.cooldowns && authorData.cooldowns.work > Date.now())
    return client.throwError(
      message,
      `Vous avez déjà travaillé quelqu'un ! Vous pourrez retravailler <t:${Math.floor(
          authorData.cooldowns.work / 1000
      )}:R>`
    );

    let maxCoins = data.work.max
    let minCoins = data.work.min || 0
    let earnedCoins = Math.floor(Math.random() * (parseInt(maxCoins) - parseInt(minCoins) + 1)) + parseInt(minCoins)

    authorData.balance =( parseInt(authorData.balance) || 0) + (parseInt(earnedCoins) || 0)
    authorData.cooldowns ? authorData.cooldowns.work = Date.now() + 28800000 : authorData.cooldowns = { work: Date.now()  + 28800000  }

    await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);

    message.channel.createMessage({ content: `:coin: Vous avez gagné ${earnedCoins} pièces en travaillant !`});
  },
};