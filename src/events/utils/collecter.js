const fs = require("node:fs");
const path = require("node:path");
const botLogger = require("../../utils/bot-logger");

module.exports = function() {
	const events = [];
	const eventsFoldersPath = path.join(__dirname, "../");

	try {
		const eventsFolders = fs.readdirSync(eventsFoldersPath);
		
		for (const folder of eventsFolders) {
			if (fs.lstatSync(path.join(eventsFoldersPath, folder)).isDirectory() && folder !== "utils") {
				const eventsPath = path.join(eventsFoldersPath, folder);
				const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
				
				for (const file of eventFiles) {
					const filePath = path.join(eventsPath, file);
					const event = require(filePath);
					
					// Set a new item in the Collection with the key as the event name and the value as the exported module
					if ("name" in event && "execute" in event) {
						events.push(event);
					} else {
						botLogger("yellow",
							`[WARNING] The event at ${ filePath } is missing a required "name" or "execute" property.`
						);
					}
				}			
			}
		}
		
		return events;
	} catch (error) {
		botLogger("red",
			`[ERROR] An error has ocurred while trying to collect all event files: ${ error }`
		);
	}
}