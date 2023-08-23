const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
require("dotenv").config();
const commandsHandler = require("./utils/commands-handler.js");
const commandsCollecter = require("./utils/commands-collecter.js");
const eventsCollecter = require("./utils/events-collecter.js");

const token = process.env.OAUTH2_TOKEN;

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();

const commands = commandsCollecter();

if (process.argv[2] === "deploy") {	
	if (commands.length == 0) {
		throw new Error("There was not any valid command file to deploy.");
	}

	const rest =  new REST().setToken(token);
	require("./utils/deploy.js")(rest, Routes, commands);
}

if (commands.length >= 1) {
	commands.forEach(command =>
		client.commands.set(command.data.name, command)
	);

	if (client.commands.get("hola")) {
		client.on(Events.InteractionCreate, commandsHandler);
	}
}

// Events collection and handling with client instance
const events = eventsCollecter();

if (events) {
	events.forEach(event => {
		const listener = (...args) => event.execute(...args);

		if (event.once) {
			client.once(event.name, listener);
		}
		
		if (!event.once) {
			client.on(event.name, listener);
		}
	});
}

// Log in to Discord with your client's token
client.login(token);