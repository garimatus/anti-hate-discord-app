import { Events } from "discord.js";
import { mapper } from "../../database/index.js";

export const event = {
	name : Events.GuildCreate,
	once : true,
	async execute(guild) {
		if (guild) {
			const antiHateBotMapper = mapper.forModel("Anti_Hate_Discord_Bot");
			
			const guildResult = await antiHateBotMapper.get({
				guild_id : guild.id
			});
			
			if (!guildResult) {
				await antiHateBotMapper.insert({
					guild_id : guild.id,
					command_prefix : "/",
					warnings_allowed : 3,
					bans : 0
				});
			}
			
			const generalTextChannel = guild.channels.cache
				.filter(channel => {
					if (channel.type == 0 && channel.name == "general") {
						return channel;
					}
			}).first();

			if (generalTextChannel) {
				generalTextChannel.send("*sent welcomingMessage*");
			}
		}
	}
};