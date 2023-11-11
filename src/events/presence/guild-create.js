import { Events } from "discord.js";

export const event = {
	name : Events.GuildCreate,
	once : true,
	async execute(guild, mapper) {
		if (guild) {
			const guildResult = await mapper.get({
				guild_id : guild.id
			});
			
			if (!guildResult) {
				await mapper.insert({
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
}