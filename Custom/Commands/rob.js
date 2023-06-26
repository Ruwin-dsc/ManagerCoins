const database = require('../../index.js');

module.exports = {
    name: 'rob',
    aliases: [],
    async execute(client, message, args) {
        let data = await database.get(`${message.guild.id}_config`) || {};
        if (!data || !data.rob || !data.rob.rate > 0) {
            return message.channel.createMessage({
                content: ':x: La commande rob n\'a pas été configurée dans ce serveur !',
                messageReference: { messageID: message.id },
            });
        }

        let member = message.mentions.members.length > 0 ? message.mentions.members[0] : null;
        if (!member) {
            return message.channel.createMessage({
                content: ':x: `ERROR` Pas de membre trouvé !',
                messageReference: { messageID: message.id },
            });
        }

        let userData = await database.get(`${message.guild.id}_${member.user.id}_userdata`) || { user: member.user.id };
        let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

        if (authorData.cooldowns && authorData.cooldowns.rob > Date.now())
        return client.throwError(
          message,
          `Vous avez déjà volé quelqu'un ! Vous pourrez revoler <t:${Math.floor(
              authorData.cooldowns.rob / 1000
          )}:R>`
        );

        if (!userData.balance || userData.balance <= 0) {
            return message.channel.createMessage({ content: 'Cette personne n\'a pas d\'argent sur elle !' });
        }

        let robRate = data.rob.rate || 0;
        let stolenAmount = Math.floor(parseInt(userData.balance) || 0 * robRate);

        if (stolenAmount <= 0) {
            return message.channel.createMessage({ content: 'Il n\'y a pas assez d\'argent à voler !' });
        }

        let isCaught = Math.random() < 0.5; 
        if (isCaught) {
            stolenAmount = 0;
            authorData.cooldowns ? authorData.cooldowns.rob = Date.now() + 28800000 : authorData.cooldowns = { rob: Date.now()  + 28800000  }
            await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);

            return message.channel.createMessage({ content: ':rotating_light: Vous avez été attrapé en train de voler !' });
        } else {
            authorData.balance = (parseInt(authorData.balance) || 0) + parseInt(stolenAmount);
            userData.balance = (parseInt(userData.balance) || 0) - parseInt(stolenAmount);
        }

        await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);
        await database.set(`${message.guild.id}_${member.user.id}_userdata`, userData);

        message.channel.createMessage({
            content: `:coin: Vous venez de voler ${stolenAmount} coins à ${member.user.tag} !`,
            messageReference: { messageID: message.id },
        });
    },
};