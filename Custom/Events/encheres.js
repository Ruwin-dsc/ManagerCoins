const database = require('../../index');

module.exports = {
  name: 'ready',
  async execute(client) {
    const enchères = (await database.all()).filter((x) => x.id.startsWith('_enchère'));

    enchères.forEach(async (enchère) => {
      const { guildID, salon, time, id } = enchère.value;
      const guild = client.guilds.get(guildID);
      const channel = guild.channels.get(salon);

      if (time <= Date.now()) {
        client.endEncheres(await channel.messages.getMessage(id), database);
      } else {
        setTimeout(async () => {
          client.endEncheres(await channel.messages.getMessage(id), database);
        }, time - Date.now());
      }
    });
  },
};
