const database = require("../../index")
const ms = require("ms")

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if(!interaction.data.customID || !interaction.data.customID.startsWith("enchère_") && interaction.data.customID != "preview") return;
        interaction.deferUpdate()

        let data = await database.get(interaction.message.id + "_enchère")
        if(!data) return;
        let userData = await database.get(`${interaction.guild.id}_${interaction.user.id}_userdata`) || { user: interaction.user.id };
        let multiplicator = interaction.data.customID.substring(interaction.data.customID.indexOf("_") + 1, interaction.data.customID.indexOf("x"))

        if(interaction.data.customID == "preview") {
            let embed = {
                color: client.color,
                title: `・Vous possèdez **${userData.bank ? userData.bank : "0" }** :coin:`,
                description:
                `Faire un **1.5x** vous coûtera **${data.prix * 1.5}**
                Faire un **2x** vous coûtera **${data.prix * 2}**
                Faire un **3x** vous coûtera **${data.prix * 3}**
                Faire un **5x** vous coûtera **${data.prix * 5}**`
            }

            return interaction.createFollowup({ embeds: [embed], flags: 64})
        }

        if(!userData.bank || (parseInt(userData.bank) || 0)< (data.prix * multiplicator)) {
            interaction.createFollowup({ content: "Vous n'avez pas assez d'argent en banque !", flags: 64})
        } else {
            data.prix = (parseInt(data.prix) * multiplicator).toString()

            let encherePanel = {
                color: client.color,
                title: data.gain,
                description: `**Dernier enréchisseur:** <@${interaction.user.id}>\n**Prix:** ${data.prix} :coin:\n*Se finit <t:${Math.floor((data.time) / 1000)}:R>*`,
                footer: {
                    text: client.footer,
                    iconURL: client.user.avatarURL()
                }
            }

            await database.set(interaction.message.id + "_enchère", data)

            interaction.message.edit({
                embeds: [encherePanel]
            })
            
            interaction.channel.createMessage({ content: `<@${interaction.user.id}> vient d'éncherir pour **${data.gain}** avec un ${multiplicator}x !`})

        }
    }
}