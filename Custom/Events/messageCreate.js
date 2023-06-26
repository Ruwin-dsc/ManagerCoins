const config = require("../../index");
const { Permissions, Collection } = require("oceanic.js")
const cooldown = new Collection()

module.exports = {
    name: "messageCreate",
    async execute(client, message) {

        if(!message.content.startsWith(client.prefix)) return;
        if(!message.channel) return;
        const args = message.content.slice(client.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName)
        if(!command) return;
        if(command.permission && !message.member.permissions.has(Permissions[command.permission])) return;
        if(command.ownerOnly && message.author.id != "382936822860218370") return;
        if(cooldown.get(`${message.author.id}_${command.name}`)) return message.channel.createMessage({ embeds: [{ color: client.color, description: `:x: Vous ne pourrez réutiliser cette commande que <t:${Math.floor(cooldown.get(`${message.author.id}_${command.name}`) / 1000)}:R> !`}]})
        .then((x) => {
          setTimeout(() => { cooldown.delete(`${message.author.id}_${command.name}`)
          x.delete()
        }, 3000)
        })

        try {
          command.execute(client, message, args)
          cooldown.set(`${message.author.id}_${command.name}`, Date.now() + (command.cooldown || 5000))
          setTimeout(() => { cooldown.delete(`${message.author.id}_${command.name}`)}, command.cooldown || 5000)
        } catch (error) {
          message.channel.createMessage({ content: "Mdr non"})
          console.error(error)
        }
    }
}