let database = require("../../index");

module.exports = {
    name: "messageCreate",
    async execute(client, message) {
        if(!message.guild) return;
        let data = await database.get(`${message.guild.id}_config`) || {};
        if (!data || !data.messages || !data.messages.reward > 0) return;

        let userData = await database.get(`${message.guild.id}_${message.author.id}_userdata`) || { user: message.author.id };

        if (userData && userData.message && userData.message.count) {
            userData.message.count++;
        } else {
            userData.message = {
                count: 1
            };
        }

        if (userData.message.count >= data.messages.count) {
            userData.balance = parseInt(data.messages.reward) + parseInt(userData.balance || 0);
            userData.message.count = 0
        }

        await database.set(`${message.guild.id}_${message.author.id}_userdata`, userData)
        await database.set(`${message.guild.id}_config`, data);
    }
};
