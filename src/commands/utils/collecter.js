import fs from "node:fs";
import antiHateBotLogger from "../../utils/logger.js";
const { pathname : path } = new URL("../", import.meta.url);

export default async function() {
	const commands = [];
	const commandsFoldersPath = path;
	
	try {
		const commandsFolders = fs.readdirSync(commandsFoldersPath);
		
		for (const folder of commandsFolders) {
			const commandsPath = commandsFoldersPath + folder;

			if (fs.lstatSync(commandsPath).isDirectory() && folder !== "utils") {
				const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
				
				for (const file of commandFiles) {
					const filePath = commandsPath + "/" + file;
					// Set a new item in the Collection with the key as the command name and the value as the exported module
					const { command } = await import(filePath);
					
					if ("data" in command && "execute" in command) {
						commands.push(command);
					} else {
						antiHateBotLogger("yellow",
							`[WARNING] The command at ${ filePath } is missing a required "data" or "execute" property.`
						);
					}
				}
			}
		}
		
		return commands;
	} catch (error) {
		antiHateBotLogger("red",
			`[ERROR] An error has ocurred while trying to collect all command files: ${error}`
		);
	}
}