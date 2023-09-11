const { Client, Events, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const path = require("node:path");
require("dotenv").config();
const commandsHandler = require("./utils/commands-handler.js");
const commandsCollecter = require("./utils/commands-collecter.js");
const eventsCollecter = require("./utils/events-collecter.js");

const TFLanguageModel = require("./language_model/TFLanguageModel.class.js");
const TFN = require("@tensorflow/tfjs-node");

const token = process.env.OAUTH2_TOKEN;

const TFNfileHandler = TFN.io.fileSystem(path.join(__dirname, process.env.MODEL_PATH));
const antiHateLangModel = new TFLanguageModel(TFNfileHandler);

// Create a new client instance
const client = new Client({ intents : [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.DirectMessages,
	GatewayIntentBits.MessageContent
]});

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
			if (event.name === Events.MessageCreate) {
				client.on(event.name, async(...args) => {
					await event.execute(...args, antiHateLangModel);
				});
			} else {
				client.on(event.name, listener);
			}
		}
	});
}

// Log in to Discord with your client's token
client.login(token);