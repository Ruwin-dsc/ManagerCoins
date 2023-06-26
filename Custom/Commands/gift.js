let database = require("../../index.js");
const { InteractionCollector } = require("oceanic-collectors");

module.exports = {
  name: "gift",
  async execute(client, message) {
    let data = await database.get(`${message.guild.id}_config`) || {};
    let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

    const minmoney = -400
    const maxmoney = 500

    const money1 = Math.floor(Math.random() * (parseInt(maxmoney) - parseInt(minmoney) + 1)) + parseInt(minmoney)
    const money2 = Math.floor(Math.random() * (parseInt(maxmoney) - parseInt(minmoney) + 1)) + parseInt(minmoney)
    const money3 = Math.floor(Math.random() * (parseInt(maxmoney) - parseInt(minmoney) + 1)) + parseInt(minmoney)

      let gift = {
        title: `Trois cartes sont à votre disposition...`,
        color: client.color,
        description: `Choisissez une des cartes ci-dessous !\nEt tentez de gagner entre \`-400 coins\` et \`500 coins !\`\n:warning: Elles expirent dans <t:${Math.floor((Date.now() + 60000) / 1000)}:R>`,
        image: { url: `https://media.discordapp.net/attachments/857612230748930078/1014239087638618173/coinsbot_gift.png?width=900&height=600`},
        footer: {
            text: client.footer,
        },
    }

    let butts = [
        {
          customID: "one",
          emoji: { name: "1️⃣"},
          type: 2,
          style: 1,
        },
        {
          customID: "two",
          emoji: { name: "2️⃣"},
          type: 2,
          style: 1,
        },
        {
          customID: "three",
          emoji: { name: "3️⃣"},
          type: 2, 
          style: 1,
        }
      ];

   let msg = await message.channel.createMessage({ embeds: [gift], components: [{ type: 1, components: butts }]})

   const collector = new InteractionCollector(client, {
    filter: (interaction) => interaction.user.id === message.author.id,
    message: msg,
    time: Math.floor((Date.now() + 60000) / 1000),
  });
  let money1embed;
  let money2embed

  collector.on("collect", async (interaction) => {
    interaction.deferUpdate();

       switch(interaction.data.customID) {
        case "one":
        case "two":
        case "three":
          money1embed = {
            color: client.color,
            title: `:gift: Vous venez de gagner ${money3} coins !`,
            fields: [
                { name: `Carte 1`, value: `\`${money1}\``, inline: true },
                { name: `Carte 2`, value: `\`${money2}\``, inline: true },
                { name: `Carte 3`, value: `\`${money3}\``, inline: true },
                ]
          }
           msg.delete()

           authorData.balance = (parseInt(authorData.balance) || 0) +  parseInt(money1)
           await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);

           message.channel.createMessage({embeds: [money1embed], messageReference: { messageID: message.id}})
          break;
    }

  })


  }}