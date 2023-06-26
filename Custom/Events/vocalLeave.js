const database = require("../../index")

module.exports = {
    name: "voiceChannelLeave",
    async execute(client, member, channel) {
        client.voice.delete(`${member.user.id}_${member.guild.id}_stream`);
        client.voice.delete(`${member.user.id}_${member.guild.id}_camera`);
        client.voice.delete(`${member.user.id}_${member.guild.id}_voice`);
    }
}