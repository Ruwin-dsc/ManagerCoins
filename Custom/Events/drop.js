let database = require("../../index");

module.exports = {
    name: "interactionCreate",
    async execute(client, interaction) {
        if (interaction.data.customID !== "drop") return;
        interaction.deferUpdate();

        let data = await database.get(`drop_${interaction.message.id}`);
        
        let userData = await database.get(`${interaction.guild.id}_${interaction.user.id}_userdata`) || { user: interaction.user.id };
        
        if (data && data.amount) {
            userData.bank = (parseInt(userData.bank) || 0) + parseInt(data.amount);
            await database.set(`${interaction.guild.id}_${interaction.user.id}_userdata`, userData);
        } 

        await database.delete(`drop_${interaction.message.id}`)

        interaction.message.edit({
            embeds: [{
                title: "・Nouveau Drop",
                color: client.color,
                description: interaction.message.embeds[0].description.replace("❌", `<@${interaction.user.id}>` ),
                footer: {
                    text: client.footer,
                },
                timestamp: new Date().toISOString()
            }],
            components: []
        });
    }
};
