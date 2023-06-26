const { InteractionCollector } = require('oceanic-collectors');
const database = require('../../index');

module.exports = {
    name: 'leaderboard',
    aliases: ['lb', "top"],
    async execute(client, message) {
        let data = await database.all();
        let serverData = data.filter((x) => x.id.endsWith('_userdata') && x.id.startsWith(`${message.guild.id}_`)) || [];
        let sortedData = serverData.sort((a, b) => (b.value.bank || 0) - (a.value.bank || 0)).slice(0, 10);
        let selectMenu;
        let leaderboard;

        let msg = await message.channel.createMessage({ content: "⚙️ Chargement..." });

        async function bank() {
            data = await database.all();
            serverData = data.filter((x) => x.id.endsWith('_userdata') && x.id.startsWith(`${message.guild.id}_`)) || [];
            sortedData = serverData.sort((a, b) => (b.value.bank || 0) - (a.value.bank || 0)).slice(0, 10);

            selectMenu = {
                type: 3,
                customID: "selectMenu",
                options: [
                    { label: "Top 10 par banque", value: "bank", description: "Affiche le top 10 des gens les plus riche selon leur argent en banque", emoji: { name: "🏦"}, default: true},
                    { label: "Top 10 par argent en poche", value: "balance", description: "Affiche le top 10 des gens les plus riches selon leur argent en poche", emoji: { name: "🪙"}, default: false},
                    { label: "Top 10 par reputation", value: "reputation", description: "Affiche le top 10 des gens avec la meilleur reputation", emoji: { name: "🔺"}, default: false}
                ]
            }    

            leaderboard = {
                color: client.color,
                title: '・Classement par banque :bank:',
                fields: [],
                footer: {
                    text: client.footer,
                },
                timestamp: new Date().toISOString(),
            };

            sortedData.forEach((x, index) => {
                let position = index + 1;
                let user = client.users.get(x.value.user);
                let bank = x.value.bank || '0';
                let balance = x.value.balance || '0';
                let reputation = x.value.reputation || "0"

                leaderboard.fields.push({
                    name: `${position}) ${user.tag}`,
                    value: `:coin: **${balance}** coins en poche
                    :bank: **${bank}** coins en banque
                    :small_red_triangle: **${reputation}** points de réputation`,
                    inline: true,
                });
            });

            msg.edit({ embeds: [leaderboard], components: [{ type: 1, components: [selectMenu]}], content: ""})
        }

        async function balance() {
            data = await database.all();
            serverData = data.filter((x) => x.id.endsWith('_userdata') && x.id.startsWith(`${message.guild.id}_`)) || [];
            sortedData = serverData.sort((a, b) => (b.value.balance || 0) - (a.value.balance || 0)).slice(0, 10);

            selectMenu = {
                type: 3,
                customID: "selectMenu",
                options: [
                    { label: "Top 10 par argent en poche", value: "balance", description: "Affiche le top 10 des gens les plus riches selon leur argent en poche", emoji: { name: "🪙"}, default: true},
                    { label: "Top 10 par banque", value: "bank", description: "Affiche le top 10 des gens les plus riche selon leur argent en banque", emoji: { name: "🏦"}, default: false},
                    { label: "Top 10 par reputation", value: "reputation", description: "Affiche le top 10 des gens avec la meilleur reputation", emoji: { name: "🔺"}, default: false},
                ]
            }    

            leaderboard = {
                color: client.color,
                title: '・Classement par argent en poche :coin:',
                fields: [],
                footer: {
                    text: client.footer,
                },
                timestamp: new Date().toISOString(),
            };

            sortedData.forEach((x, index) => {
                let position = index + 1;
                let user = client.users.get(x.value.user);
                let bank = x.value.bank || '0';
                let balance = x.value.balance || '0';
                let reputation = x.value.reputation || "0"

                leaderboard.fields.push({
                    name: `${position}) ${user.tag}`,
                    value: `:coin: **${balance}** coins en poche
                    :bank: **${bank}** coins en banque
                    :small_red_triangle: **${reputation}** points de réputation`,
                    inline: true,
                });
            });

            msg.edit({ embeds: [leaderboard], components: [{ type: 1, components: [selectMenu],  content: ""}]})
        }

        async function reputation() {
            data = await database.all();
            serverData = data.filter((x) => x.id.endsWith('_userdata') && x.id.startsWith(`${message.guild.id}_`)) || [];
            sortedData = serverData.sort((a, b) => (b.value.reputation || 0) - (a.value.reputation || 0)).slice(0, 10);

            selectMenu = {
                type: 3,
                customID: "selectMenu",
                options: [
                    { label: "Top 10 par reputation", value: "reputation", description: "Affiche le top 10 des gens avec la meilleur reputation", emoji: { name: "🔺"}, default: true},
                    { label: "Top 10 par argent en poche", value: "balance", description: "Affiche le top 10 des gens les plus riches selon leur argent en poche", emoji: { name: "🪙"}, default: false},
                    { label: "Top 10 par banque", value: "bank", description: "Affiche le top 10 des gens les plus riche selon leur argent en banque", emoji: { name: "🏦"}, default: false}
                ]
            }    

            leaderboard = {
                color: client.color,
                title: '・Classement par reputation :small_red_triangle:',
                fields: [],
                footer: {
                    text: client.footer,
                },
                timestamp: new Date().toISOString(),
            };

            sortedData.forEach((x, index) => {
                let position = index + 1;
                let user = client.users.get(x.value.user);
                let bank = x.value.bank || '0';
                let balance = x.value.balance || '0';
                let reputation = x.value.reputation || "0"

                leaderboard.fields.push({
                    name: `${position}) ${user.tag}`,
                    value: `:coin: **${balance}** coins en poche
                    :bank: **${bank}** coins en banque
                    :small_red_triangle: **${reputation}** points de réputation`,
                    inline: true,
                });
            });

            msg.edit({ embeds: [leaderboard], components: [{ type: 1, components: [selectMenu],  content: ""}]})
        }

        const collector = await new InteractionCollector(client, {
            filter: (interaction) => interaction.user.id === message.author.id,
            message: msg,
            time: 300000,
        });

        await bank()

        collector.on("collect", async (interaction) => {
            interaction.deferUpdate()
            switch(interaction.data.values.raw[0]) {
                case "bank":
                    bank()
                    break;

                case "reputation":
                    reputation()
                    break;

                case "balance":
                    balance()
                    break;
            }
        })

    },
};
