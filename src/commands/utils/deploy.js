const botLogger = require("../../utils/bot-logger");

module.exports = async function(rest, Routes, commands) {
	try {
        const commandsJsoned = [];
        commands.forEach(command => {
			commandsJsoned.push(command.data.toJSON());
		});

		botLogger("",
			`Started refreshing ${commandsJsoned.length} application (/) commands.`
		);
        
        // The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
			{ body : commandsJsoned }
		);

		botLogger("green",
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};