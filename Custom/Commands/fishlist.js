const { InteractionCollector } = require("oceanic-collectors");
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

module.exports = {
  name: "fishlist",
  aliases: ["poissons"],
  async execute(client, message) {
    const pageSize = 10;
    const totalPages = Math.ceil(fishes.length / pageSize);

    const getPageFishes = (page) => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = page * pageSize;
      return fishes.slice(startIndex, endIndex);
    };

    const formatFishes = (pageFishes) => {
      return pageFishes
        .map(
          (x) =>
            `${x.emoji} ${x.fish} - **${x.value * 2}** (${x.rarity})`
        )
        .join("\n");
    };

    let currentPage = 1;
    let pageFishes = getPageFishes(currentPage);

    let embed = {
      title: "・Liste des poissons disponibles",
      color: client.color,
      footer: {
        text: client.footer,
      },
      timestamp: new Date().toISOString(),
      description: formatFishes(pageFishes),
    };

    let butts = [
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
    ];

    let msg = await message.channel.createMessage({
      embeds: [embed],
      components: [{ type: 1, components: butts }],
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
      }

      pageFishes = getPageFishes(currentPage);

      embed.description = formatFishes(pageFishes);

      if (currentPage === totalPages) {
        butts.find((button) => button.customID === "right").disabled = true;
      } else {
        butts.find((button) => button.customID === "right").disabled = false;
      }

      if (currentPage === 1) {
        butts.find((button) => button.customID === "left").disabled = true;
      } else {
        butts.find((button) => button.customID === "left").disabled = false;
      }

      await msg.edit({
        embeds: [embed],
        components: [{ type: 1, components: butts }],
      });
    });
  },
};
