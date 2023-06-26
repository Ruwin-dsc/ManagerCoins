const { QuickDB } = require('quick.db');
const database = new QuickDB();
const initialize = async () => {
  try {
    require("./Structure/anti-crash");

    const tokensData = await database.get("tokens") || [];
    const manager = await initializeManager(tokensData);
    await startTokens(tokensData, manager);
  } catch (error) {
    console.error('Erreur durant le lancement:', error);
  }
};

const startTokens = async (tokensData, manager) => {
  const tokens = tokensData.map((x) => x.token);
  await Promise.all(tokens.map((token) => initializeToken(token, manager)));
};

async function initializeToken(token, manager) {
  const { Bot } = require("./Structure/bot");
  const client = new Bot(token);
  client.once("ready", async () => {
    manager.clients.push(client);
  });

  await loadCommands(client, 'Custom/Commands', manager);
  await loadEvents(client, 'Custom/Events', manager);

  await client.connect().catch(err => { });
}

const initializeManager = async (tokensData) => {
  const { Client, Collection } = require("oceanic.js");
  const Utils = require("./Structure/utils");

  const manager = new Client({
    auth: "Bot ",
    gateway: {
      intents: Utils.Intents.ALL
    },
  });

  manager.commands = new Collection();
  manager.events = new Collection();
  manager.prefix = "+";
  manager.coooldowns = new Collection();
  manager.tokensData = tokensData;
  manager.clients = [];

  manager.awaitReply = async function(message, question, limit = 60000) {
    return new Promise(async (resolve, reject) => {
      let author = message.author || message.user;
      const filter = (m) => m.author.id === author.id;

      try {
        const collected = await require("oceanic-collectors").awaitMessages(this,message.channel,{
          filter: filter,
          max: 1,
          time: limit,
        });
        if (collected[0]) {
          await resolve(collected[0]);
        }

        await collected[0]
          .delete()
          .catch((e) => {});
        return collected[0].content;
      }
      catch (e) {

        await resolve(false)
        reject(false);
      }
    });
  };

  await loadCommands(manager, 'Manager/Commands');
  await loadEvents(manager, 'Manager/Events');

  await manager.connect().catch((err) => console.error(err));

  return manager;
};

const loadCommands = async (client, commandPath, manager) => {
  const fs = require('fs');
  const path = require('path');

  const commandFiles = fs.readdirSync(path.join(__dirname, commandPath)).filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(path.join(__dirname, commandPath, file));
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
};

const loadEvents = async (client, eventPath, manager) => {
  const fs = require('fs');
  const path = require('path');

  const eventFiles = fs.readdirSync(path.join(__dirname, eventPath)).filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(path.join(__dirname, eventPath, file));
    if (typeof event.name === 'string' && typeof event.execute === 'function') {
      client.events.set(event.name, event);
      client.on(event.name, (...args) => event.execute(client, ...args, manager));
    } else {
      console.log('Invalid event: ', file, event);
    }
  }
};

initialize();

module.exports = database;