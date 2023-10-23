import antiHateBotLogger from "../../utils/bot-logger.js";
import { mapper } from "../../database/index.js"

export default async function(rest, Routes, commands) {
	try {
        const commandsJsoned = [];
        commands.forEach(command => {
			commandsJsoned.push(command.data.toJSON());
		});
		
		antiHateBotLogger("",
			`Started refreshing ${ commandsJsoned.length } application (/) commands.`
		);
		
		const antiHateMapper = mapper.forModel("Anti_Hate_Discord_Bot");

        antiHateMapper.getGuildsCount = antiHateMapper.mapWithQuery("SELECT count(guild_id) AS Guilds_Count FROM Guilds",
			guild_id => guild_id
		);
		
		const guildsCount = (await antiHateMapper.getGuildsCount()).first().guilds_count;
		
		if (guildsCount) {
			// The put method is used to fully refresh all commands in the guild with the current set
			const data = await rest.put(
				Routes.applicationCommands(process.env.CLIENT_ID),
				{ body : commandsJsoned }
			);
			
			antiHateBotLogger("green",
				`Successfully reloaded ${ data.length } application (/) commands into ${ guildsCount } guild(s).`
			);
		}
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
}