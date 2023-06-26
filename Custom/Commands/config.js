const database = require("../../index");
const {
	MessageCollector,
	InteractionCollector
} = require("oceanic-collectors");
const ms = require("ms")

module.exports = {
	name: "config",
	aliases: ["panel", "configuration", "settings"],
	description: "Vous permet de configurer les paramètres du bot",
	usage: "config",

	async execute(client, message) {
		const {
			guild
		} = message
		let data = await database.get(`${guild.id}_config`) || {};
		console.log("Data is")
		console.log(data) // mm moi att

		const msg = await message.channel.createMessage({
			content: "⚙️  Chargement..."
		});

		async function previous() {

			let panel = {
				color: client.color,
				description: `**🔊 - Nombre de pièces attribués lorsqu'un membre est en vocal**\n・Vous recevez ${data.vocal && data.vocal.reward ? data.vocal.reward : "0"} \🪙 toutes les ${data.vocal && data.vocal.cooldown ? data.vocal.cooldown : "5m"}\n\n**🎥 - Nombre de pièces attribués lorsqu'un membre se met en stream**\n・Vous recevez ${data.camera && data.camera.reward ? data.camera.reward : "0"} \🪙 toutes les ${data.camera && data.camera.cooldown ? data.camera.cooldown : "5m"}\n\n**📹 - Nombre de pièces attribués lorsqu'un membre active sa caméra**\n・Vous recevez ${data.stream && data.stream.reward ? data.stream.reward : "0"} \🪙 toutes les ${data.stream && data.stream.cooldown ? data.stream.cooldown : "5m"}\n\n**💬 - Nombre de pièces attribués lorsqu'un membre envoie un message**\n・Vous recevez ${data.messages && data.messages.reward ? data.messages.reward : "0"} \🪙 tous les ${data.messages && data.messages.count ? data.messages.count : "20"} messages`,
				footer: {
					text: client.footer,
				},
				timestamp: new Date().toISOString(),
			};

			let butts = [{
					emoji: {
						name: "🔊"
					},
					customID: "vocal",
					style: 2,
					type: 2
				},
				{
					emoji: {
						name: "🎥"
					},
					customID: "camera",
					style: 2,
					type: 2
				},
				{
					emoji: {
						name: "📹"
					},
					customID: "stream",
					style: 2,
					type: 2
				},
				{
					emoji: {
						name: "💬"
					},
					customID: "message",
					style: 2,
					type: 2
				},
				{
					label: "▶",
					customID: "next",
					style: 3,
					type: 2
				},
			];

			let row = [{
				type: 1,
				components: butts
			}];
			msg.edit({
				embeds: [panel],
				components: row,
				content: ""
			})

		}

		async function next() {

			let panel2 = {
				footer: {
					text: client.footer,
				},
				timestamp: new Date().toISOString(),
				color: client.color,
				description: `**💰 - Utilisation de la commande \`&rob\`**\n・Elle vous apportera ${data.rob && data.rob.rate ? data.rob.rate * 100 : "0"}% des pièces de la victime avec un cooldown de \`8h\`\n\n**🔨 - Utilisation de la commande \`&work\`**\n・Elle vous apportera entre ${data.work && data.work.min ? data.work.min : "0"} \🪙 et ${data.work && data.work.max ? data.work.max : "0"} \🪙 avec un cooldown de \`6h\`\n\n**⏰ - Utilisation de la commande \`&daily\`**\n・Elle vous apportera entre ${data.daily && data.daily.min ? data.daily.min : "0"} \🪙 et ${data.daily && data.daily.max ? data.daily.max : "0"} \🪙 avec un cooldown de \`24h\`\n\n**📆 - Utilisation de la commande \`&weekly\`**\n・Elle vous apportera entre ${data.daily && data.daily.min ? data.daily.min : "0"} \🪙 et ${data.weekly && data.weekly.max ? data.weekly.max : "0"} \🪙 avec un cooldown de \`7j\``
			}
			let butts2 = [{
					label: "◀",
					customID: "previous",
					style: 3,
					type: 2
				},
				{
					emoji: {
						name: "💰"
					},
					customID: "rob",
					style: 2,
					type: 2
				},
				{
					emoji: {
						name: "🔨"
					},
					customID: "work",
					style: 2,
					type: 2
				},
				{
					emoji: {
						name: "⏰"
					},
					customID: "daily",
					style: 2,
					type: 2
				},
				{
					emoji: {
						name: "📆"
					},
					customID: "weekly",
					style: 2,
					type: 2
				}
			]

			let row2 = [{
				type: 1,
				components: butts2
			}]

			msg.edit({
				embeds: [panel2],
				components: row2,
				content: ""
			})
		}

		const collector = await new InteractionCollector(client, {
			filter: (interaction) => interaction.user.id === message.author.id,
			message: msg,
			time: 300000,
		});


		previous()

		collector.on("collect", async (interaction) => {
			interaction.deferUpdate();

			switch (interaction.data.customID) {
				case "next":
					next()
					break;

				case "previous":
					previous()
					break;

				case "vocal":
					await msg.edit({
						content: "Quel sera le temps de l'intervalle ?",
						embeds: [],
						components: []
					});
					const vocalTime = await client.awaitReply(message);

					if (vocalTime && vocalTime.content && !isNaN(ms(vocalTime.content)) && ms(vocalTime.content) > 0 && isNaN(vocalTime.content.slice(-1)) && ms(vocalTime.content) < 2147483647) {
						await msg.edit({
							content: "Quel sera le nombre de pièces à attrirbuer ?",
							embeds: [],
							components: []
						});
						const vocalCoins = await client.awaitReply(message);

						if (vocalCoins && vocalCoins.content && !isNaN(vocalCoins.content) && parseInt(vocalCoins.content) > 0) {

							if (!('vocal' in data)) data.vocal = {
								reward: 0,
								cooldown: "0s"
							}

							data.vocal.reward = vocalCoins.content;
							data.vocal.cooldown = vocalTime.content;

							await database.set(`${guild.id}_config`, data);
						} else {
							interaction.createFollowup({
								content: "Nombre de pièces invalide !",
								flags: 64
							});
						}
					} else {
						interaction.createFollowup({
							content: "Intervalle invalide !",
							flags: 64
						});
					}

					await previous()
					break;

				case "camera":
					await msg.edit({
						content: "Quel sera le temps de l'intervalle ?",
						embeds: [],
						components: []
					});
					const cameraTime = await client.awaitReply(message);

					if (cameraTime && cameraTime.content && !isNaN(ms(cameraTime.content)) && ms(cameraTime.content) > 0 && isNaN(cameraTime.content.slice(-1)) && ms(cameraTime.content) < 2147483647) {
						await msg.edit({
							content: "Quel sera le nombre de pièces à attribuer  ?",
							embeds: [],
							components: []
						});
						const cameraCoins = await client.awaitReply(message);

						if (cameraCoins && cameraCoins.content && !isNaN(cameraCoins.content) && parseInt(cameraCoins.content) > 0) {

							if (!('camera' in data)) data.camera = {
								reward: 0,
								cooldown: "0s"
							}

							data.camera.reward = cameraCoins.content;
							data.camera.cooldown = cameraTime.content;

							await database.set(`${guild.id}_config`, data);
						} else {
							interaction.createFollowup({
								content: "Nombre de pièces invalide !",
								flags: 64
							});
						}
					} else {
						interaction.createFollowup({
							content: "Intervalle invalide !",
							flags: 64
						});
					}

					await previous();
					break;

				case "stream":
					await msg.edit({
						content: "Quel sera le temps de l'intervalle ?",
						embeds: [],
						components: []
					});
					const streamTime = await client.awaitReply(message);

					if (streamTime && streamTime.content && !isNaN(ms(streamTime.content)) && ms(streamTime.content) > 0 && isNaN(streamTime.content.slice(-1)) && ms(streamTime.content) < 2147483647) {
						await msg.edit({
							content: "Quel sera le nombre de pièces à attribuer  ?",
							embeds: [],
							components: []
						});
						const streamCoins = await client.awaitReply(message);

						if (streamCoins && streamCoins.content && !isNaN(streamCoins.content) && parseInt(streamCoins.content) > 0) {

							if (!('stream' in data)) data.stream = {
								reward: 0,
								cooldown: "0s"
							}

							data.message.reward = streamCoins.content;
							data.message.cooldown = streamTime.content;

							await database.set(`${guild.id}_config`, data);
						} else {
							interaction.createFollowup({
								content: "Nombre de pièces invalide !",
								flags: 64
							});
						}
					} else {
						interaction.createFollowup({
							content: "Intervalle invalide !",
							flags: 64
						});
					}

					await previous();
					break;

				case "message":
					await msg.edit({
						content: "Quel sera le nombre de messages ?",
						embeds: [],
						components: []
					});
					const messageCount = await client.awaitReply(message);

					if (messageCount && messageCount.content && !isNaN(messageCount.content) && parseInt(messageCount.content) > 0) {
						await msg.edit({
							content: "Quel sera le nombre de pièces à attribuer ?",
							embeds: [],
							components: []
						});
						const messageCoins = await client.awaitReply(message);

						if (messageCoins && messageCoins.content && !isNaN(messageCoins.content) && parseInt(messageCoins.content) > 0) {

							if (!('messages' in data)) data.messages = {
								reward: 0,
								count: 0
							}

							data.message.reward = messageCoins.content;
							data.message.count = messageCount.content;

							await database.set(`${guild.id}_config`, data);
						} else {
							interaction.createFollowup({
								content: "Nombre de pièces invalide !",
								flags: 64
							});
						}
					} else {
						interaction.createFollowup({
							content: "Nombre de messages invalide !",
							flags: 64
						});
					}

					await previous();
					break

				case "rob":
					await msg.edit({
						content: "Quel sera le nouveau pourcentage de pièces ?",
						embeds: [],
						components: []
					});
					const robRate = await client.awaitReply(message);
					if (robRate && robRate.content && parseInt(robRate.content) > 0) {

						if (!('rob' in data)) data.rob = {
							rate: 0
						}

						data.rob.rate = robRate.content / 100;


						await database.set(`${guild.id}_config`, data);
					} else {
						interaction.createFollowup({
							content: "Pourcentage invalide !",
							flags: 64
						});
					}

					await next();
					break;

				case "work":
					await msg.edit({
						content: "Quel sera le montant minimum de pièces ?",
						embeds: [],
						components: []
					});
					const workMin = await client.awaitReply(message);
					if (workMin && workMin.content && !isNaN(workMin.content) && parseInt(workMin.content) > 0) {
						await msg.edit({
							content: "Quel sera le montant maximum de pièces ?",
							embeds: [],
							components: []
						});
						const workMax = await client.awaitReply(message);
						if (workMax && workMax.content && !isNaN(workMax.content) && parseInt(workMax.content) > 0 && parseInt(workMax.content) >= parseInt(workMin.content)) {

							if (!('work' in data)) data.work = {
								min: 0,
								max: 0
							}

							data.work.min = workMin.content;
							data.weekly.max = workMax.content;


							await database.set(`${guild.id}_config`, data);
						} else {
							interaction.createFollowup({
								content: "Montant maximum invalide !",
								flags: 64
							});
						}
					} else {
						interaction.createFollowup({
							content: "Montant minimum invalide !",
							flags: 64
						});
					}

					await next();
					break;

				case "daily":
					await msg.edit({
						content: "Quel sera le montant minimum de pièces ?",
						embeds: [],
						components: []
					});
					const dailyMin = await client.awaitReply(message);
					if (dailyMin && dailyMin.content && !isNaN(dailyMin.content) && parseInt(dailyMin.content) > 0) {
						await msg.edit({
							content: "Quel sera le montant maximum de pièces ?",
							embeds: [],
							components: []
						});
						const dailyMax = await client.awaitReply(message);
						if (dailyMax && dailyMax.content && !isNaN(dailyMax.content) && parseInt(dailyMax.content) > 0 && parseInt(dailyMax.content) >= parseInt(dailyMin.content)) {

							if (!('daily' in data)) data.daily = {
								min: 0,
								max: 0
							}

							data.daily.min = dailyMin.content;
							data.daily.max = dailyMin.content;


							await database.set(`${guild.id}_config`, data);
						} else {
							interaction.createFollowup({
								content: "Montant maximum invalide !",
								flags: 64
							});
						}
					} else {
						interaction.createFollowup({
							content: "Montant minimum invalide !",
							flags: 64
						});
					}

					await next();
					break;

				case "weekly":
					await msg.edit({
						content: "Quel sera le montant minimum de pièces ?",
						embeds: [],
						components: []
					});
					const weeklyMin = await client.awaitReply(message);
					if (weeklyMin && weeklyMin.content && !isNaN(weeklyMin.content) && parseInt(weeklyMin.content) > 0) {
						await msg.edit({
							content: "Quel sera le montant maximum de pièces ?",
							embeds: [],
							components: []
						});
						const weeklyMax = await client.awaitReply(message);
						if (weeklyMax && weeklyMax.content && !isNaN(weeklyMax.content) && parseInt(weeklyMax.content) > 0 && parseInt(weeklyMax.content) >= parseInt(weeklyMin.content)) {
							if (!('weekly' in data)) data.weekly = {
								min: 0,
								max: 0
							}

							data.weekly.min = weeklyMin.content;
							data.weekly.max = weeklyMax.content;

							await database.set(`${guild.id}_config`, data);
							console.log(await database.get(`${guild.id}_config`))

						} else {
							interaction.createFollowup({
								content: "Montant maximum invalide !",
								flags: 64
							});
						}

					} else {
						interaction.createFollowup({
							content: "Montant minimum invalide !",
							flags: 64
						});
					}

					await next();
					break;
          
			}
		})
	}
}