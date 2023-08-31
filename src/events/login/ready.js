const { Events } = require("discord.js");
const botLogger = require("../../utils/bot-logger.js");

module.exports = {
	name : Events.ClientReady,
	once : true,
	execute(client) {
		botLogger("green",
			`Ready! Logged in as ${ client.user.tag }`
		);
	}
};