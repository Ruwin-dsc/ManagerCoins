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
    { fish: "Une raie", value: 420, rarity: "Épique", emoji: "🦈" },
    { fish: "Un espadon", value: 450, rarity: "Épique", emoji: "🦈" },
    { fish: "Un merlan", value: 480, rarity: "Épique", emoji: "🦈" },
    { fish: "Une morue", value: 510, rarity: "Épique", emoji: "🦈" },
    { fish: "Une barbue", value: 540, rarity: "Épique", emoji: "🦈" },
    { fish: "Une sole", value: 570, rarity: "Épique", emoji: "🦈" },
    { fish: "Un Saint-Pierre", value: 600, rarity: "Épique", emoji: "🦈" },
    { fish: "Un hareng", value: 630, rarity: "Épique", emoji: "🦈" },
    { fish: "Un églefin", value: 660, rarity: "Épique", emoji: "🦈" },
    { fish: "Un cabillaud", value: 690, rarity: "Épique", emoji: "🦈" },
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

  const { InteractionCollector } = require("oceanic-collectors");
  let database = require("../../index");
  
  module.exports = {
    name: "fishes",
    aliases: ["fishinv"],
    async execute(client, message) {
      let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`);
  
      if (!authorData || !authorData.fishes || authorData.fishes.length === 0) {
        return message.channel.createMessage({
          content: ":x: Votre inventaire est vide!",
        });
      }
  
      const fishCount = {};
      let totalValue = 0;
  
      let fishs = authorData.fishes

      authorData.fishes.forEach((fish) => {
        fishCount[fish] = (fishCount[fish] || 0) + 1;
        const fishData = fishes.find((f) => f.fish.toLowerCase() === fish.toLowerCase());
        if (fishData) {
          totalValue += fishData.value * 2;
        }
      });
  
      const fishInventory = Object.entries(fishCount)
        .sort((a, b) => b[1] - a[1])
        .map(([fish, count]) => {
          const fishData = fishes.find((f) => f.fish.toLowerCase() === fish.toLowerCase());
          const rarity = fishData ? fishData.rarity : "Inconnue";
          const emoji = fishData ? fishData.emoji : "";
  
          return `__${count}x__ ${emoji} **${fish}** - Rareté: **${rarity}**`;
        });
  
      const itemsPerPage = 10;
      const totalPages = Math.ceil(fishInventory.length / itemsPerPage);
      let currentPage = 1;
  
      const getPageFishes = (page) => {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return fishInventory.slice(start, end);
      };
  
      const formatFishes = (pageFishes) => {
        return pageFishes.join("\n");
      };
  
      let pageFishes = getPageFishes(currentPage);
      let embed = {
        title: "🎣 Voici votre inventaire de poissons",
        description: formatFishes(pageFishes),
        color: client.color,
      };
  
      let buttons = [
        {
          customID: "left",
          emoji: { id: "1112745994304622642" },
          type: 2,
          style: 1,
          disabled: true,
        },
        {
          customID: "right",
          emoji: { id: "1112745992836624465" },
          type: 2,
          style: 1,
        },
        {
          customID: "sell",
          emoji: { name: "🪙"},
          type: 2,
          style: 3,
          label: `Tout vendre pour ${totalValue}`
        }
      ];
  
      let msg = await message.channel.createMessage({
        embeds: [embed],
        components: [{ type: 1, components: buttons }],
      });
  
      const collector = new InteractionCollector(client, {
        filter: (interaction) => interaction.user.id === message.author.id,
        message: msg,
        time: 300000,
      });
  
      collector.on("collect", async (interaction) => {
        interaction.deferUpdate();
  
        if (interaction.data.customID === "left") {
          currentPage = Math.max(1, currentPage - 1);
        } else if (interaction.data.customID === "right") {
          currentPage = Math.min(totalPages, currentPage + 1);
        } else if(interaction.data.customID === "sell") {
            let authorData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

            if(authorData.fishes.length != fishs.length) return interaction.createFollowup({ content: "Des changements ont eu lieu entre temps, veuillez réeffectuer la commande à fin d'avoir des donées à jour !", flags: 64})
            
            authorData.balance = ((parseInt(authorData.balance) || 0)) + totalValue        
            authorData.fishes = [];

            await database.set(`${message.guild.id}_${message.author.id}_userdata`, authorData);
            return msg.edit({
                content: `🪙 Vous avez vendu tout vos poissons pour **${totalValue}** !`,
                embeds: [],
                components: []
            })
        } 
  
        pageFishes = getPageFishes(currentPage);
  
        embed.description = formatFishes(pageFishes);
  
        buttons.find((button) => button.customID === "right").disabled = currentPage === totalPages;
        buttons.find((button) => button.customID === "left").disabled = currentPage === 1;
  
        await msg.edit({
          embeds: [embed],
          components: [{ type: 1, components: buttons }],
        });
      });
    },
  };
  