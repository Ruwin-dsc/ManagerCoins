const database = require("../../index");

module.exports = {
  name: "rep",
  aliases: ["reputation"],
  async execute(client, message, args) {
    let mention = message.mentions.members.length > 0 ? message.mentions.members[0] : null;
    let member = mention || message.member;

    let userData = await database.get(`${message.guild.id}_${member.user.id}_userdata`) || { user: member.user.id};
    let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id};

    if (!mention) return client.throwError(message, "Vous devez mentionner ou indiquer l'identifiant d'un utilisateur !");
    if (mention.user.id == message.author.id) return client.throwError(message, "Vous ne pouvez pas utiliser cette commande sur vous-même !");
    if (authorData.cooldowns && authorData.cooldowns.reputation > Date.now())
      return client.throwError(
        message,
        `Vous avez déjà donné un point de réputation à quelqu'un !\nVous ne pourrez réutiliser cette commande dans <t:${Math.floor(
          authorData.cooldowns.reputation / 1000
        )}:R>`
      );

    if (userData.reputation) {
      userData.reputation = (parseInt(userData.reputation) || 0) + 1;
    } else {
      userData.reputation = 1
    }

    authorData.cooldowns ? authorData.cooldowns.reputation = Date.now() + 43200000 : authorData.cooldowns = { reputation: Date.now()  + 43200000  }


    await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);
    await database.set(`${message.guild.id}_${member.user.id}_userdata`, userData);
    
    client.throwSuccess(message, `:small_red_triangle: <@${member.user.id}> vient de gagner 1 réputation\n:timer: Vous pourrez réutiliser cette commande dans <t:${Math.floor(
      (Date.now() + 43200000) / 1000
    )}:R>`);
  },
};