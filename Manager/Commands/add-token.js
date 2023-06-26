const database = require("../../index");
const fs = require('fs');
const path = require('path');
const { Bot } = require("../../Structure/bot");

module.exports = {
  name: "add-token",
  aliases: ["create-bot"],
  async execute(client, message, args) {

    if (client.tokensData.find((x) => x.token === args[0])) return message.channel.createMessage({ content: "Ce bot est déjà un bot coins !" });
    client.coooldowns.set(message.author.id, Date.now() + 3000);

    if (!args[0]) return message.channel.createMessage({ content: "Vous devez spécifier un token après le message." });
    message.createReaction("loading_blue:1112708872516415588");
    const bot = await initializeToken(args[0], client);
        
    try {
      bot.once("ready", async () => {
        client.clients.push(bot);
        client.tokensData.push({ id: bot.user.id, owner: message.author.id, token: args[0] });
        await database.set("tokens", client.tokensData).catch(() => message.channel.createMessage({ content: "Une erreur s'est produite" }));

        message.deleteReaction("loading_blue:1112708872516415588");
        message.createReaction("✅");
        client.getChannel("1114917130605969458").createMessage({ content: `**${message.author.tag}** vient de créer le bot ${bot.user.tag}`});
        return message.channel.createMessage({ content: `Bot coins créé avec succès sous le nom de ${bot.user.tag} (\`ID: ${bot.user.id}\`) !\nLien d'invitation: https://discord.com/api/oauth2/authorize?client_id=${bot.user.id}&permissions=8&scope=bot` });
      });

      bot.on("error", (error) => {
          message.deleteReaction("loading_blue:1112708872516415588");
          message.createReaction("❌");
          
        if (error.message.includes("Disallowed token")) {
          return message.channel.createMessage({ content: "Intents invalides." });
        }
       message.channel.createMessage({ content: "Ce token est invalide." });
      });
    } catch (error) {
      message.deleteReaction("loading_blue:1112708872516415588");
      message.createReaction("❌");
        
      message.channel.createMessage({ content: "Ce token est invalide." });
    }

    setTimeout(() => {
    if(!bot.ready) {
            message.deleteReaction("loading_blue:1112708872516415588");
            message.createReaction("❌");
        message.channel.createMessage({ content: "Ce token est invalide." });	
            }
    }, 5000)

  }
}

async function initializeToken(token, manager) {
    const client = new Bot(token);
    client.once("ready", async () => {
      manager.clients.push(client);
    })
  
  
    const commandPath = path.join(__dirname, "..", "..", 'Custom', 'Commands');
    const commandFiles = fs.readdirSync(commandPath).filter((file) => file.endsWith('.js'));
  
    for (const file of commandFiles) {
      const command = require(path.join(commandPath, file));
      if ('execute' in command) {
        client.commands.set(command.name.toLowerCase(), command);
        if (Array.isArray(command.aliases)) {
          command.aliases.forEach((alias) => {
            client.commands.set(alias.toLowerCase(), command);
          });
        }
      } else {
        console.log('Erreur: ', file, command);
      }
    }
  
    const eventPath = path.join(__dirname, "..", "..", 'Custom', 'Events');
    const eventFiles = fs.readdirSync(eventPath).filter((file) => file.endsWith('.js'));
  
    for (const file of eventFiles) {
      const event = require(path.join(eventPath, file));
      if (typeof event.name === 'string' && typeof event.execute === 'function') {
        client.events.set(event.name, event);
        client.on(event.name, (...args) => event.execute(client, ...args, manager));
      } else {
        console.log('Invalid event: ', file, event);
      }
    }
  
    await client.connect().catch(err => {});
    return client;
  }
  