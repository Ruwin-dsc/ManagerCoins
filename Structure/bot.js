const oceanic = require('oceanic.js');
const Utils = require("../Structure/utils")
const { Constants, Collection } = require('oceanic.js');

class Bot extends oceanic.Client {
  constructor(token) {
    super({
      auth: `Bot ${token}`,
      allowedMentions: [],
      gateway: {
          intents: Utils.Intents.ALL
      },
    });

    this.config = {
      prefix: '&',
      color: 0x2c2d31,
      footer: 'discord.gg/automod',
    };

    this.commands = new Collection();
    this.events = new Collection();
    this.voice = new Collection();
    this.encheres = [];
    this.color = this.config.color;
    this.prefix = this.config.prefix;
    this.footer = this.config.footer;
    this.token = token
      
      /**
       * Throws a sucess embed
       * @param {Message} message The message
       * @param {String} text The text
       * @returns
       */

    this.throwSuccess = async function (message, text) {
      let successEmbed = {
        color: 0x11f009,
        description: text,
        
      };
      message.channel.createMessage({ embeds: [successEmbed] });
    }
  
      /**
       * Throws an error embed
       * @param {Message} message The message
       * @param {String} error The error
       * @returns
       */

    this.throwError = async function(message, error) {
      let errorEmbed = {
        color: 0xff0000,
        description: error,
      };
      message.channel.createMessage({ embeds: [errorEmbed] });
    }

    /**
       * Goofy enchères
       * @param {Message} message The message 
       * @returns
       */
  
    this.endEncheres = async function(message, database) {
      let data = await database.get(`${message.id}_enchère`)
      message = await message.channel.getMessage(message.id);
      let mention = message.embeds[0].description.match(/<@(\d+)>/)?.[1];
  
      if(parseInt(mention) > 0) {
        message.edit({
          embeds: [{
            color: this.config.color,
            description: `<@${mention}> a gagné les enchères et repart donc avec **${data.gain}** pour le prix de **${data.prix}** :coin: !`,
          }],
          components: []
        })
  
        message.guild.id = message.guild.id || "undefined";
        let userData = await database.get(`${message.guild.id}_${mention}_userdata`) || { user: mention};
        userData.bank = (parseInt(userData.bank) || 0) - (parseInt(data.prix) || 0);
        await database.set(`${message.guild.id}_${mention}_userdata`, userData)
  
      } else {
        message.edit({
          embeds: [{
            color: client.color,
            description: `Personne n'a enchéri pour **${data.gain}** !`,
          }],
          components: []
        })
      }
      await database.delete(`${message.id}_enchère`)
    }
  
      /**
       * Wait a message from a member
       * @param {Message} message The message 
       * @param {String} question The question to ask
       * @param {Number} limit number of ms
       * @returns
       */

      this.awaitReply = async (message, question, limit = 60000) => {
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
    }
  }

module.exports = { Bot }