const database = require("../../index");
const { InteractionCollector}= require("oceanic-collectors")
const ms = require("ms")

module.exports = {
    name: "enchères",
    permission: "MANAGE_GUILD",
    aliases: ["enchère"],
    
    async execute(client, message, args) {
        if(!args) return message.channel.createMessage({ content: "Vous devez spécifier un salon"})
        let msg = await message.channel.createMessage({ content: "⚙️ Chargement..." });
        let data = {};

        async function updateEmbed() {
            let embed = {
                title: "・Panel de l'enchère",
                footer: {
                    text: "Cliquez sur 🎉 pour lancer l'enchère",
                },
                timestamp: new Date().toISOString(),
                color: client.color,
                fields: [
                    { name: "`🌐` Salon", value: `${data.salon ? `<#${data.salon}>` : ":x:"}`, inline: false},
                    { name: "`🕙` Temps", value: `${data.time ? data.time : ":x:"}`, inline: false},
                    { name: "`🎁` Gain", value: `${data.gain ? data.gain : ":x:"}`, inline: false},
                    { name: "`💰` Prix", value: `${data.prix ? `${data.prix} :coin:` : ":x:"}`, inline: false},
                ]
            }

            const butts = [
                { emoji: { name: "🌐" }, customID: "salon", style: 2, type: 2 },
                { emoji: { name: "🕙" }, customID: "temps", style: 2, type: 2 },
                { emoji: { name: "🎁" }, customID: "gain", style: 2, type: 2 }, 
                { emoji: { name: "💰" }, customID: "prix", style: 2, type: 2 },
                { emoji: { name: "🎉" }, customID: "lancer", style: 3, type: 2 }
            ]

            let buttons = { type: 1, components: butts}
            msg.edit({ content: "", embeds: [embed], components: [buttons]})
        }

        const collector = await new InteractionCollector(client, {
           filter: (interaction) => interaction.user.id === message.author.id,
           message: msg,
           time: 300000,
           });

           
        await updateEmbed();
        
        collector.on("collect", async (interaction) => {
            interaction.deferUpdate();

            switch(interaction.data.customID) {
                case "salon":
                    msg.edit({ embeds: [], components: [{ type: 1, components: [{ type: 8, customID: "salonMenu", placeholder: "Séléctionnez le nouveau salon", channelTypes: [0] }] }]})
                    break;

                case "salonMenu":
                    data.salon = interaction.data.values.raw[0]
                    await updateEmbed();
                    break;

                    case "prix":
                        await msg.edit({ content: "Quel sera le nouveau prix ?", embeds: [], components: []});
                        const prix = await client.awaitReply(message);
                      
                        if (prix && prix.content) {
                          const parsedPrice = parseInt(prix.content);
                          if (!isNaN(parsedPrice) && parsedPrice > 0) {
                            data.prix = parsedPrice.toString();
                          } else {
                            interaction.createFollowup({ content: "Prix invalide !", flags: 64 });
                          }
                        }
                        updateEmbed();
                        break;
                      
                case "temps":
                    await msg.edit({ content: "Quel sera le nouveau temps ?", embeds: [], components: []})
                    const time = await client.awaitReply(message)
                    if(time && time.content) {
                        if(isNaN(ms(time.content)) || ms(time.content) <= 0 || !isNaN(time.content.slice(-1)) || ms(time.content) >= 2147483647) {
                            interaction.createFollowup({ content: "Temps invalide !", flags: 64})
                        } else {
                            data.time = time.content
                        }
                    } 
                    updateEmbed();
                    break;

                case "gain":
                    await msg.edit({ content: "Quel sera le nouveau gain ?", embeds: [], components: []})
                    const gain = await client.awaitReply(message)
                    if(gain && gain.content ) data.gain = gain.content
                    updateEmbed();

                    break;
                
                case "lancer":
                    if(!data.prix || !data.time || !data.gain || !data.salon ) return interaction.createFollowup({ content: `Vous devez spécifier: ${(!data.salon ? "\n・Un salon" : "") + (!data.gain ? "\n・Un gain" : "") + (!data.temps ? "\n・Un temps" : "") + (!data.prix ? "\n・Un prix" : "")}`, flags: 64})

                    let encherePanel = {
                        color: client.color,
                        title: data.gain,
                        description: `**Dernier enréchisseur:** :x:\n**Prix:** ${data.prix} :coin:\n*Se finit <t:${Math.floor((ms(data.time) + Date.now()) / 1000)}:R>*`,
                        footer: {
                            text: client.footer,
                            iconURL: client.user.avatarURL()
                        }
                    }

                    let buttonsEnchere = [
                        { type: 2, style: 2, label: "x1.5", customID: "enchère_1.5x"},
                        { type: 2, style: 2, label: "x2", customID: "enchère_2x"},
                        { type: 2, style: 2, label: "x3", customID: "enchère_3x"},
                        { type: 2, style: 2, label: "x5", customID: "enchère_5x"},
                        { type: 2, style: 1, emoji: { name: "ℹ️"}, customID: "preview"},
                    ]

                    let row = { type: 1, components: buttonsEnchere}
                    await message.guild.channels.get(data.salon).createMessage({ embeds: [encherePanel], components: [row]})
                    .then(async (x) => {
                        await database.set(`${x.id}_enchère`, { guildID: message.guild.id, id: x.id, prix: data.prix, gain: data.gain, salon: data.salon, time: (Date.now() + ms(data.time))})
                        console.log(data.time)
                        client.encheres.push(setTimeout(() => { client.endEncheres(x, database) }, ms(data.time)))
                        await msg.edit({ embeds: [], components: [], content: "Enchères lancées dans <#" + data.salon + "> !"})
                    })
                    break;
            }
        });

    }
}
