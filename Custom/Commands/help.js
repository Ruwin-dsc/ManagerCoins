const {
	InteractionCollector
} = require("oceanic-collectors");

module.exports = {
	name: "help",
	async execute(client, message) {
		const commands = client.commands;
		const commandNames = [...new Set(commands.map((x) => x.name))];
		const pageSize = 5;
		const totalPages = Math.ceil(commandNames.length / pageSize);

		const getPageCommands = (page) => {
			const startIndex = (page - 1) * pageSize;
			const endIndex = page * pageSize;
			return commandNames.slice(startIndex, endIndex);
		};

		const generateMenu = (commands) => {
			let options = commands.map((x) => ({
				label: x,
				value: x,
				description: client.commands.get(x) && client.commands.get(x).description ?
					client.commands.get(x).description :
					"",
			}));
			return options;
		};

		const formatCommands = (pageCommands) => {
			return pageCommands
				.map(
					(x) =>
					`[**\`&${x}\`**](https://discord.gg/automod)\n ${
              commands.get(x) && commands.get(x).description
                ? commands.get(x).description
                : "Aucune description fournie"
            }`
				)
				.join("\n");
		};

		let currentPage = 1;
		let pageCommands = getPageCommands(currentPage);

		let embed = {
			title: "・Panel d'aide",
			color: client.color,
			footer: {
				text: client.footer,
			},
			timestamp: new Date().toISOString(),
			description: "Ce bot est un coins bot personnalisé offert gratuitement à tout nos membres dans notre [serveur](https://discord.gg/automod).",
			fields: [{
				name: "Commandes",
				value: formatCommands(pageCommands),
				inline: true
			}, ],
			thumbnail: {
				url: message.guild.iconURL()
			}
		};

		let butts = [{
				customID: "leftLeft",
				emoji: {
					id: "1112745996900900906"
				},
				type: 2,
				style: 1,
				disabled: true,
			},
			{
				customID: "left",
				emoji: {
					id: "1112745994304622642"
				},
				type: 2,
				style: 1,
				disabled: true,
			},
			{
				customID: "right",
				emoji: {
					id: "1112745992836624465"
				},
				type: 2,
				style: 1,
			},
			{
				customID: "rightRight",
				emoji: {
					id: "1112745990076764230"
				},
				type: 2,
				style: 1,
			},
		];

		let msg = await message.channel.createMessage({
			embeds: [embed],
			content: "📡 Pour plus d'aide, rendez vous dans discord.gg/automod",
			components: [{
					type: 1,
					components: butts
				},
				{
					type: 1,
					components: [{
						type: 3,
						customID: "menu",
						options: generateMenu(pageCommands),
					}, ],
				},
			],
		});

		const collector = new InteractionCollector(client, {
			filter: (interaction) => interaction.user.id === message.author.id,
			message: msg,
			time: 300000,
		});

		collector.on("collect", async (interaction) => {
			interaction.deferUpdate();

			if (interaction.data.values && interaction.data.values.raw.length > 0) {
				let x = client.commands.get(interaction.data.values.raw[0]);
				return msg.edit({
					embeds: [{
						color: client.color,
						fields: [{
								name: "Nom de la commande",
								value: x?.name || ":x:",
								inline: true
							},
							{
								name: "Description",
								value: x?.description || ":x:",
								inline: true
							},
							{
								name: "Aliases",
								value: x?.aliases ? x.aliases.join(", ") : ":x:",
								inline: true
							},
							{
								name: "Permission",
								value: x?.permission || ":x:",
								inline: true
							},
							{
								name: "Utilisation",
								value: x.utilisation ? ("&" + x.utilisation) : ":x:",
								inline: true
							}
						],
					}, ],
					components: [{
						type: 1,
						components: [{
							style: 2,
							type: 2,
							emoji: {
								name: "🏠"
							},
							customID: "house",
						}, ],
					}, ],
				});
			}

			if (interaction.data.customID === "leftLeft") {
				currentPage = 1;
			} else if (interaction.data.customID === "left") {
				currentPage = Math.max(1, currentPage - 1);
			} else if (interaction.data.customID === "rightRight") {
				currentPage = totalPages;
			} else if (interaction.data.customID === "right") {
				currentPage = Math.min(totalPages, currentPage + 1);
			} else if (interaction.data.customID === "house") {
				pageCommands = getPageCommands(currentPage);
				embed.description = formatCommands(pageCommands);

				return msg.edit({
					embeds: [embed],
					components: [{
							type: 1,
							components: butts
						},
						{
							type: 1,
							components: [{
								type: 3,
								customID: "menu",
								options: generateMenu(pageCommands),
							}, ],
						},
					],
				});
			}

			pageCommands = getPageCommands(currentPage);

			embed.fields = [{
				name: "Commands",
				value: formatCommands(pageCommands)
			}]

			if (currentPage === totalPages) {
				butts.find((button) => button.customID === "right").disabled = true;
				butts.find((button) => button.customID === "rightRight").disabled = true;
			} else {
				butts.find((button) => button.customID === "right").disabled = false;
				butts.find((button) => button.customID === "rightRight").disabled = false;
			}

			if (currentPage === 1) {
				butts.find((button) => button.customID === "leftLeft").disabled = true;
				butts.find((button) => button.customID === "left").disabled = true;
			} else {
				butts.find((button) => button.customID === "leftLeft").disabled = false;
				butts.find((button) => button.customID === "left").disabled = false;
			}

			await msg.edit({
				embeds: [embed],
				components: [{
						type: 1,
						components: butts
					},
					{
						type: 1,
						components: [{
							type: 3,
							customID: "menu",
							options: generateMenu(pageCommands),
						}, ],
					},
				],
			});
		});
	},
};