const fishes = [
    { fish: "Une truite", value: 30, rarity: "Commun", emoji: "🐟" },
    { fish: "Une sardine", value: 60, rarity: "Commun", emoji: "🐟" },
    { fish: "Une carpe", value: 90, rarity: "Commun", emoji: "🐟" },
    { fish: "Un saumon", value: 120, rarity: "Commun", emoji: "🐟" },
    { fish: "Un thon", value: 150, rarity: "Rare", emoji: "🐠" },
    { fish: "Une dorade", value: 180, rarity: "Rare", emoji: "🐠" },
    { fish: "Un brochet", value: 210, rarity: "Rare", emoji: "🐠" },
    { fish: "Un bar", value: 240, rarity: "Rare", emoji: "🐠" },
    { fish: "Une anguille", value: 270, rarity: "Rare", emoji: "🐠" },
    { fish: "Un rouget", value: 300, rarity: "Rare", emoji: "🐠" },
    { fish: "Un turbot", value: 330, rarity: "Rare", emoji: "🐠" },
    { fish: "Un maquereau", value: 360, rarity: "Rare", emoji: "🐠" },
    { fish: "Un loup de mer", value: 390, rarity: "Rare", emoji: "🐠" },
    { fish: "Une raie", value: 420, rarity: "Epique", emoji: "🦈" },
    { fish: "Un espadon", value: 450, rarity: "Epique", emoji: "🦈" },
    { fish: "Un merlan", value: 480, rarity: "Epique", emoji: "🦈" },
    { fish: "Une morue", value: 510, rarity: "Epique", emoji: "🦈" },
    { fish: "Une barbue", value: 540, rarity: "Epique", emoji: "🦈" },
    { fish: "Une sole", value: 570, rarity: "Epique", emoji: "🦈" },
    { fish: "Un Saint-Pierre", value: 600, rarity: "Epique", emoji: "🦈" },
    { fish: "Un hareng", value: 630, rarity: "Epique", emoji: "🦈" },
    { fish: "Un églefin", value: 660, rarity: "Epique", emoji: "🦈" },
    { fish: "Un cabillaud", value: 690, rarity: "Epique", emoji: "🦈" },
    { fish: "Une plie", value: 720, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Une daurade royale", value: 750, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Une lotte", value: 780, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un turbotin", value: 810, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un tacaud", value: 840, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Une julienne", value: 870, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Une rascasse", value: 900, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un lieu jaune", value: 930, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un mérou", value: 960, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un rouget-barbet", value: 990, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un pagre", value: 1020, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un chinchard", value: 1050, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un mulet", value: 1080, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un thazard", value: 1110, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un vivaneau", value: 1140, rarity: "Légendaire", emoji: "🐋" },
    { fish: "Un calamar", value: 1170, rarity: "Mythique", emoji: "🐙" },
    { fish: "Un anchois", value: 1200, rarity: "Mythique", emoji: "🐙" },
    { fish: "Un poulpe", value: 1230, rarity: "Mythique", emoji: "🐙" },
    { fish: "Une langouste", value: 1260, rarity: "Mythique", emoji: "🦞" },
    { fish: "Une langoustine", value: 1290, rarity: "Mythique", emoji: "🦞" }
  ];

let database = require("../../index")

module.exports = {
    name: "fish",
    aliases: ["pêcher","pêche","pecher"],
    async execute(client, message) {
        let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id};
        if(!authorData || !authorData.job || authorData.job != "fish") return message.channel.createMessage({ content: ":x: Vous devez être un pécheur pour pouvoir utiliser cette commande !"});
        if (authorData.cooldowns && authorData.cooldowns.fish > Date.now()) {
                return client.throwError(
                message,
                `Vous avez déjà pêché un poisson ! Vous pourrez repêcher <t:${Math.floor(
                    authorData.cooldowns.fish / 1000
                )}:R>`
            );
        }
        
        let x = fishes[Math.floor(Math.random() * fishes.length)]
        
        authorData.fishes ? authorData.fishes.push(x.fish) : authorData.fishes = [x.fish] 
        authorData.cooldowns ? authorData.cooldowns.fish = Date.now() + 43200000 : authorData.cooldowns = { fish: Date.now() + 43200000 }
        await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData)

        await message.channel.createMessage({ content: `🎣 Vous avez pêché __${x.fish.toLowerCase()}__ ${x.emoji} qui est une espèce **${x.rarity.toLowerCase()}** d'une valeur de **${x.value}** pièces !` })

    }
}
