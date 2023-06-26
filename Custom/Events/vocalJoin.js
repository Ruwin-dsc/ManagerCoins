const database = require("../../index")
const ms = require("ms")

module.exports = {
    name: "voiceChannelJoin",
    async execute(client, member, channel) {
        let guild = member.guild
        let data = await database.get(`${guild.id}_config`) || {};
        if((data.vocal && data.vocal.reward) || (data.camera && data.camera.reward) || (data.stream && data.stream.reward)) {
            if(member.voiceState) {
                if(data.vocal && data.vocal.reward && data.vocal.cooldown) client.voice.set(`${member.user.id}_${member.guild.id}_voice`, setInterval(() => checkState(member, "voice"), ms(data.vocal.cooldown)));

                if(data.camera && data.camera.reward && data.camera.cooldown) client.voice.set(`${member.user.id}_${member.guild.id}_camera`, setInterval(() => checkState(member, "camera"), ms(data.camera.cooldown)));
                
                if(data.stream && data.stream.reward && data.stream.cooldown) client.voice.set(`${member.user.id}_${member.guild.id}_stream`, setInterval(() => checkState(member, "stream"), ms(data.stream.cooldown)));        
            }
        }
    }
  };

  async function checkState(member, type) {
    let data = await database.get(`${member.guild.id}_config`) || {};

    switch (type) {
        case "voice":
            if(member.voiceState && data.vocal && data.vocal.reward ) {
                reward(member, (parseInt(data.vocal.reward) || 0))
            }
            break;

        case "camera":
            if(member.voiceState && member.voiceState.selfVideo && data.camera && data.camera.reward) {
                reward(member, (parseInt(data.camera.reward) || 0))
            }
            break;

        case "stream":
            if(member.voiceState && member.voiceState.selfStream  && data.stream && data.stream.reward) {
                reward(member, (data.stream.reward || 0))
            }
            break;
    }  
}

async function reward(member, amount) {
    let userData = await database.get(`${member.guild.id}_${member.user.id}_userdata`) || { user: member.user.id};
    userData.balance = parseInt(userData.balance) || 0 + parseInt(amount);

    await database.set(`${member.guild.id}_${member.user.id}_userdata`, userData)
}