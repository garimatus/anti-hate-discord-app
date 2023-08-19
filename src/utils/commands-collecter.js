const fs = require("node:fs");
const path = require("node:path");

module.exports = function() {
	const commandsFoldersPath = path.join(__dirname, "../commands");
	
	const commands = [];

	try {
		const commandsFolders = fs.readdirSync(commandsFoldersPath);
		
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
	} catch (error) {
		console.log(`[ERROR] An error has ocurred while trying to collect all command files: ${error}`);
	}
}