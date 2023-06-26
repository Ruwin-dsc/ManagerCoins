const { InteractionCollector } = require("oceanic-collectors");
let database = require("../../index");
const { ActivityTypes } = require("oceanic.js");

module.exports = {
  name: "mybots",
  aliases: ["bots"],
  async execute(client, message, args) {
    let userTokens = client.tokensData.filter((x) => x.owner === message.author.id);

    if (userTokens.length === 0) {
      return message.channel.createMessage({ content: "Vous n'avez pas encore créé de bots." });
    }

    let msg = await message.channel.createMessage({ content: "Chargement..." });

    async function upd() {
      userTokens = client.tokensData.filter((x) => x.owner === message.author.id);
      const userBots = [];

      for (const tokenData of userTokens.slice(0, 3)) {
        let cl = client.clients.find((client) => client.token === tokenData.token);
        if (cl && cl.user) {
          userBots.push({
            tag: cl.user.tag,
            id: cl.user.id,
            token: cl.token,
          });
        }
      }

      if (userBots.length === 0) {
        return msg.edit({ content: "Aucun de vos bots n'est actuellement un coins bot.", components: [] });
      }

      const botList = userBots.map((bot, index) => {
        const maskedToken = bot.token
          .slice(0, 35)
          .split("")
          .map((char, i) => {
            if (i >= bot.token.length * 0.25) {
              return "•";
            } else {
              return char;
            }
          })
          .join("");

        return `${index + 1}. - Nom: **${bot.tag}** | ID: \`${bot.id}\`\nToken: \`${maskedToken}\`\n\n`;
      });

      let menu = {
        type: 1,
        components: [
          {
            type: 3,
            customID: "menu",
            placeholder: "Choisissez un bot",
            options: userBots.map((x) => {
              return { label: x.tag, value: x.token, description: x.id };
            }),
          },
        ],
      };

      await msg.edit({ content: `Voici la liste de vos bots:\n${botList}`.replaceAll(",", ""), components: [menu] });
    }

    upd();

    const collector = await new InteractionCollector(client, {
      filter: (interaction) => interaction.user.id === message.author.id,
      message: msg,
      time: 75000,
    });

    async function getBot(bot) {
      const userBots = [];

      for (const tokenData of userTokens.slice(0, 3)) {
        const iencli = client.clients.find((client) => client.token === tokenData.token);
        if (iencli && iencli.user) {
          userBots.push({
            tag: iencli.user.tag,
            id: iencli.user.id,
            token: tokenData.token,
          });
        }
      }

      bot = userBots.find((x) => x.token === bot);
      const iencli = client.clients.find((x) => x.user.id == bot.id);

      msg.edit({
        content: `Nom: **${bot.tag}**\nID: \`${bot.id}\`\nEtat: ${iencli ? "`🟢` Connecté" : "🔴 Déconnecté"}`,
        components: [
          {
            type: 1,
            components: [
              { type: 2, style: 2, label: "Nom", customID: "name" },
              { type: 2, style: 2, label: "Avatar", customID: "avatar" },
              { type: 2, style: 2, label: "Status", customID: "status" },
              { type: 2, style: 1, label: "Token", customID: "token" },
              { type: 2, style: 4, label: "Supprimer le bot", customID: "delete" },
            ],
          },
        ],
      });
    }

    let currentClient;

    collector.on("collect", async (interaction) => {
      interaction.deferUpdate();
      switch (interaction.data.customID) {
        case "token":
          interaction.createFollowup({ content: currentClient.token, flags: 64 });
          break;

        case "name":
          msg.edit({
            content: "Quel sera le nouveau nom ?",
            components: [],
          });

          let name = await client.awaitReply(message);
          if (name.content) {
            try {
              await currentClient.user.edit({
                username: name.content,
              });

              await message.channel.createMessage({ content: "Le nom du bot a été changé avec succès." }).then((x) => {
                setTimeout(() => {
                  x.delete();
                }, 3000);
              });
            } catch (error) {
              await message.channel.createMessage({ content: "Le nom du bot n'a pas pu être changé." }).then((x) => {
                setTimeout(() => {
                  x.delete();
                }, 3000);
              });
            }
          } else {
            await message.channel.createMessage({ content: "Aucun nom éligible n'a été fourni." }).then((x) => {
              setTimeout(() => {
                x.delete();
              }, 3000);
            });
          }

          getBot(currentClient.token);
          break;

        case "status":
          msg.edit({ content: "Quel sera le nouveau status ?", components: [] });
          let m = await client.awaitReply(message);
          if (m.content) {
            await currentClient.editStatus("dnd", [
              {
                name: m.content,
                type: ActivityTypes.STREAMING,
                url: "https://twitch.tv/hawk",
              },
            ]);

            let data = (await database.get("tokens")) || [];
            data.find((x) => x.token == currentClient.token).status = m.content;

            await database.set("tokens", data);

            await message.channel.createMessage({ content: "Status changé avec succès." }).then((x) => {
              setTimeout(() => {
                x.delete();
              }, 3000);
            });
          } else {
            await message.channel.createMessage({ content: "Vous n'avez pas répondu dans les délais." }).then((x) => {
              setTimeout(() => {
                x.delete();
              }, 3000);
            });
          }

          getBot(currentClient.token);
          break;

        case "avatar":
          msg.edit({
            content: "Quelle sera la nouvelle pp du bot ?",
            components: [],
          });

          let messageImage = await client.awaitReply(message);

          if (messageImage.content || messageImage.attachments) {

            let avatar = messageImage.content || messageImage.attachments.first().url;

            await currentClient.user
              .edit({
                avatar: btoa(String.fromCharCode(...new Uint8Array(avatar))),
              })
              .then(async () => {
                await message.channel.createMessage({ content: "Pp du bot changée avec succès." }).then((x) => {
                  setTimeout(() => {
                    x.delete();
                  }, 3000);
                });
              })
              .catch(async (err) => {
                await message.channel.createMessage({ content: "Aucune image élgible trouvée" }).then((x) => {
                  setTimeout(() => {
                    x.delete();
                  }, 3000);
                });

                console.log(err);
              });
          } else {
            await message.channel.createMessage({ content: "Aucune image élgible trouvée" }).then((x) => {
              setTimeout(() => {
                x.delete();
              }, 3000);
            });
          }

          getBot(currentClient.token);

          break;

        case "delete":
          const tokenToDelete = currentClient.token;
          const tokenIndex = client.tokensData.findIndex((x) => x.token.startsWith(tokenToDelete) && x.owner == message.author.id);

          if (tokenIndex === -1) {
            return interaction.createFollowup({ content: "J'ai pas trouvé le bot", flags: 64 });
          }

          const deletedTokenData = client.tokensData[tokenIndex];
          const clientIndex = client.clients.findIndex((client) => client.token === deletedTokenData.token);

          if (clientIndex !== -1) {
            const clientToDel = client.clients[clientIndex];
            client.getChannel("1114917130605969458").createMessage({ content: `**${message.author.tag}** a supprimé le bot ${clientToDel.user.tag}` });
            clientToDel.disconnect({ reconnect: false });
          } else {
            return interaction.createFollowup({ content: "Le bot est actuellement déconnecté.", flags: 64 });
          }

          client.tokensData.splice(tokenIndex, 1);
          await database.set("tokens", client.tokensData).catch(() => interaction.createFollowup({ content: "P'tite erreur.", flags: 64 }));
          upd();

          let t2k = (await database.get("tokens")) || [];
          const t1k = t2k.map((x) => x.token);

          await client.editStatus("dnd", [
            {
              name: `v0.1 | ${t1k.length} clients`,
              type: ActivityTypes.STREAMING,
              url: "https://twitch.tv/hawk",
            },
          ]);

          interaction.createFollowup({ content: "Bot supprimé avec succès.", flags: 64 });
          break;

        case "menu":
          currentClient = client.clients.find((x) => x.token ==interaction.data.values.raw[0]);
          getBot(interaction.data.values.raw[0]);
          break;
      }
    });

    collector.on("end", () => {
      msg.edit({ content: "Ce menu a expiré.", components: [] });
    });
  },
};
