const database = require("../../index");
const deposit = require("./deposit");

module.exports = {
    name: "drop",
    usage: "- drop #salon <somme>",
    description: "- Vous permet de drop des pièces au premier interagissant avec le bot",
    aliases: ["cadeau", "gift"],
    permission: "MANAGE_GUILD",
    async execute(client, message, args) {
        if (!args || args.length < 2) {
            return message.channel.createMessage({ content: "Vous devez spécifier des arguments après la commande: `&drop #salon 300`"})
        }

        const channel = message.guild.channels.get(message.mentions.channels[0]);
        if (!channel || channel.type !== 0) {
            return message.channel.createMessage({ content: "Le salon spécifié est invalide!" });
        }

        const amount = parseInt(args[1]);
        if (isNaN(amount) || amount <= 0) {
            return message.channel.createMessage({ content: "Le montant spécifié est invalide!" });
        }

        const data = {
            channelId: message.mentions.channels[0],
            amount: amount,
        };

        let gift = {
            color: client.color,
            title: "・Nouveau Drop",
            description: `\🎁 Offert par <@${message.author.id}>
            \🪙 La récompense est de **${amount}**
            \🎉 Vainqueur: ❌`,
            footer: {
                text: client.footer,
            },
            timestamp: new Date().toISOString()
        }

        let row = { type: 1, components: [{ style: 2, type: 2, emoji: { name: "🎉"}, customID: "drop" }]}

        let x = await channel.createMessage({ embeds: [gift], components: [row]})

        await database.set(`drop_${x.id}`, data);
        await message.channel.createMessage({ content: "Le cadeau a été configuré avec succès!" });
        
    }
};
