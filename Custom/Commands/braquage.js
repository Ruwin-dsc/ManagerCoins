const database = require('../../index.js');

module.exports = {
    name: 'braquage',
    description: "- Vous permet de faire un cambriolé un utilisateur",
    usage: "- braquage @user",
    aliases: [],
    async execute(client, message, args) {
        let member = message.mentions.members.length > 0 ? message.mentions.members[0] : null;

        if (!member) {
            return message.channel.createMessage({
                content: ':x: `ERROR` Pas de membre trouvé !',
                messageReference: { messageID: message.id },
            });
        }

        let userData = await database.get(`${message.guild.id}_${member.user.id}_userdata`) || { user: member.user.id };
        let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

        if(!authorData || !authorData.job || authorData.job != "braqueur") return message.channel.createMessage({ content: ":x: Vous devez être un braqueur de banques pour pouvoir utiliser cette commande !"});

        if (authorData.cooldowns && authorData.cooldowns.braquage > Date.now())
        return client.throwError(
          message,
          `Vous avez déjà braqué quelqu'un ! Vous pourrez revoler <t:${Math.floor(
              authorData.cooldowns.braquage / 1000
          )}:R>`
        );

        if (!userData.bank || userData.bank <= 0) {
            return message.channel.createMessage({ content: 'Cette personne n\'a pas d\'argent sur son compte !' });
        }

        let robRate = 0.4;
        let stolenAmount = Math.floor(parseInt(userData.balance) || 0 * robRate);

        if (stolenAmount <= 0) {
            return message.channel.createMessage({ content: 'Il n\'y a pas assez d\'argent à voler !' });
        }

        let isCaught = Math.random() < 0.5; 
        if (isCaught) {
            stolenAmount = 0;
            return message.channel.createMessage({ content: ':rotating_light: Vous avez été attrapé en train de braquer une banque !' });
        } else {
            authorData.balance = (parseInt(authorData.balance) || 0) + parseInt(stolenAmount);
            userData.bank = parseInt(userData.bank) || 0 - parseInt(stolenAmount);
            authorData.cooldowns ? authorData.cooldowns.braquage = Date.now() + 43200000 : authorData.cooldowns = { braquage: Date.now()  + 43200000  }
        }

        await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);
        await database.set(`${message.guild.id}_${member.user.id}_userdata`, userData);

        message.channel.createMessage({
            content: `:bank: Ce braquage vous a apporté ${stolenAmount} :coin:, la principale victime était ${member.user.tag} !`,
            messageReference: { messageID: message.id },
        });
    },
};
