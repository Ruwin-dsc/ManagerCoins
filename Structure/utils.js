const { Constants } = require("oceanic.js")

const Utils = { 
    Intents: {
        ALL: [  
            Constants.Intents.GUILDS,
            Constants.Intents.GUILD_MEMBERS,
            Constants.Intents.GUILD_MODERATION,
            Constants.Intents.GUILD_EMOJIS_AND_STICKERS,
            Constants.Intents.GUILD_INTEGRATIONS,
            Constants.Intents.GUILD_WEBHOOKS,
            Constants.Intents.GUILD_INVITES,
            Constants.Intents.GUILD_VOICE_STATES,
            Constants.Intents.GUILD_PRESENCES,
            Constants.Intents.GUILD_MESSAGES,
            Constants.Intents.GUILD_MESSAGE_REACTIONS,
            Constants.Intents.GUILD_MESSAGE_TYPING,
            Constants.Intents.DIRECT_MESSAGES,
            Constants.Intents.DIRECT_MESSAGE_REACTIONS,
            Constants.Intents.DIRECT_MESSAGE_TYPING,
            Constants.Intents.MESSAGE_CONTENT,
            Constants.Intents.GUILD_SCHEDULED_EVENTS,
            Constants.Intents.AUTO_MODERATION_CONFIGURATION,
            Constants.Intents.AUTO_MODERATION_EXECUTION,
        ]
    }
}

module.exports = Utils