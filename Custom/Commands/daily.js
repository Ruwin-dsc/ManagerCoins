const database = require("../../index");
const ms = require("ms");

module.exports = {
  name: "daily",
  description: "- Vous permet de récupérer votre somme quotidienne",
  usage: "- daily",
  async execute(client, message) {
    let data = await database.get(`${message.guild.id}_config`) || {};

    let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

    if (!data || !data.daily || !data.daily.max > 0) {
        return message.channel.createMessage({
            content: ':x: La commande daily n\'a pas été configurée dans ce serveur, faîtes la commande `config` pour le configurer !',
            messageReference: { messageID: message.id },
        });
    }

    if (authorData.cooldowns && authorData.cooldowns.daily > Date.now())
    return client.throwError(
      message,
      `Vous avez déjà récuperé votre daily quelqu'un ! Vous pourrez retravailler <t:${Math.floor(
          authorData.cooldowns.daily / 1000
      )}:R>`
    );

    let maxCoins = data.daily.max || 0
    let minCoins = data.daily.min || 0
    let earnedCoins = Math.floor(Math.random() * (parseInt(maxCoins) - parseInt(minCoins) + 1)) + parseInt(minCoins)

    authorData.balance = (parseInt(authorData.balance) || 0) + parseInt(earnedCoins)
    authorData.cooldowns ? authorData.cooldowns.daily = Date.now() + 86400000 : authorData.cooldowns = { daily: Date.now()  + 86400000 }

    await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);

    message.channel.createMessage({ content: `⏰ Vous avez gagné récupéré ${earnedCoins} pièces grâce à votre daily !`});
  },
};