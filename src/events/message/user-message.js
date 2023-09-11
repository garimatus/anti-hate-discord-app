const { Events } = require("discord.js");

module.exports = {
	name : Events.MessageCreate,
	once : false,
	async execute(message, antiHateLangModel) {
		if (message.author.bot || message.content === "") return;
		
		const messageContent = message.content.replace(/[^a-z0-9¡!¿? ]/gi, '');
		
		if (messageContent.length >= 5) {
			if (antiHateLangModel.hateSpeechPredicter(messageContent)) {
				/**
				 * bot's hate speech measures
				 */
			}
		}
	}
};