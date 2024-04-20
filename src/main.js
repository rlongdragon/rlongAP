require("dotenv").config();
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');


/**
	* @param {Client} client
	*/

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath, { withFileTypes: true })
	.filter(file => file.isDirectory());

for (const folder of commandFolders) {
	const folderPath = path.join(commandsPath, folder.name);
	const indexFilePath = path.join(folderPath, 'index.js');

	if (fs.existsSync(indexFilePath)) { // 確認 index.js 存在
		const command = require(indexFilePath); // 載入 index.js
		if ('data' in command && 'execute' in command) { // 確認 data 與 execute 屬性存在
			client.commands.set(command.data.name, command); // 將指令加入 client.commands
		} else {
			console.log(`[WARNING] The command at ${indexFilePath} is missing a required "data" or "execute" property.`); // 載入失敗
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {
		const command = interaction.client.commands.get(interaction.commandName); // 取得指令

		if (!command) { // 指令不存在
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction); // 執行指令
		} catch (error) { // 發生錯誤
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				console.log(error)
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	} else if (interaction.isAutocomplete()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.autocomplete(interaction);
		} catch (error) {
			console.error(error);
		}
	} else if (interaction.isUserContextMenuCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	} else if (interaction.isMessageContextMenuCommand()) {
		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			if (interaction.replied || interaction.deferred) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			} else {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	} else {
		return;
	}
});



const eventsPath = path.join(__dirname, 'events');
// const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
const eventFolders = fs.readdirSync(eventsPath, { withFileTypes: true })
	.filter(file => file.isDirectory());

for (const folder of eventFolders) {
	const folderPath = path.join(eventsPath, folder.name);
	const indexFilePath = path.join(folderPath, 'index.js');

	if (fs.existsSync(indexFilePath)) {
		const event = require(indexFilePath);
		if ('name' in event && 'execute' in event) {
			if (event.once) {
				client.once(event.name, (...args) => event.execute(...args));
			} else {
				client.on(event.name, (...args) => event.execute(...args));
			}
		} else {
			console.log(`[WARNING] The event at ${indexFilePath} is missing a required "name" or "execute" property.`);
		}
	}
}

// other tasks
const otherPath = path.join(__dirname, 'other');
const otherFolders = fs.readdirSync(otherPath, { withFileTypes: true })
	.filter(file => file.isDirectory());

for (const folder of otherFolders) {
	const folderPath = path.join(otherPath, folder.name);
	const indexFilePath = path.join(folderPath, 'index.js');

	// require all index.js files in the other folders
	if (fs.existsSync(indexFilePath)) {
		require(indexFilePath)(client)
	} else {
		console.log(`[WARNING] The other at ${indexFilePath} is missing a required "index.js" file.`);
	}
}

client.login(process.env.BOT_TOKEN);