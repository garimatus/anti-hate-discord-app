import { Events } from "discord.js";
import botLogger from "../../utils/bot-logger.js";

export const event = {
	name : Events.ClientReady,
	once : true,
	execute(client) {
		botLogger("green",
			`Ready! Logged in as ${ client.user.tag }`
		);
	}
};