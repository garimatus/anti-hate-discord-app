const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
require("dotenv").config();
const fs = require("node:fs");
const path = require("node:path");
const commandsHandler = require("./commands-handler.js");


const token = process.env.OAUTH2_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

function getCommands() {
	const commandsFoldersPath = path.join(__dirname, "commands");
	const commandsFolders = fs.readdirSync(commandsFoldersPath);
	const commands = []
	for (const folder of commandsFolders) {
		const commandsPath = path.join(commandsFoldersPath, folder);
		const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
		for (const file of commandFiles) {
			const filePath = path.join(commandsPath, file);
			const command = require(filePath);
			// Set a new item in the Collection with the key as the command name and the value as the exported module
			if ("data" in command && "execute" in command) {
				commands.push(command);
			} else {
				console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
			}
		}
	}
	return commands;
}
module.exports = getCommands;

if (process.argv[2] === "deploy") {
	const rest =  new REST().setToken(token);
	const { deployCommands } = require("./deploy.js")(rest, Routes, getCommands());
	return deployCommands;
}

getCommands().forEach(command => client.commands.set(command.data.name, command));

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, commandsHandler);

// Log in to Discord with your client's token
client.login(token);