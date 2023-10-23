import { Events } from "discord.js";

export const event = {
	name : Events.MessageCreate,
	once : false,
	async execute(message, antiHateLangModel, antiHateBotMapper) {
		if (message.author.bot || message.content.length < 5) return;
		
		const messageContent = message.content.replace(/[^a-z0-9¡!¿? ]/gi, '');
		
		if (antiHateLangModel.hateSpeechPredicter(messageContent)) {
			var guildUserWarnings = 1;
			var userTotalBans = 0;

			const { bans, warnings_allowed } = await antiHateBotMapper.get({
				guild_id : message.guildId
			});

			const user = await antiHateBotMapper.get({
				user_id : message.author.id
			});

			if (!user) {
				antiHateBotMapper.insert({
					user_id : message.author.id,
					username : message.author.username,
					global_username : message.author.globalName,
					avatar : message.author.avatar,
					total_warnings : 1,
					total_bans : 0
				});
			} else {
				await antiHateBotMapper.update({
					user_id : message.author.id,
					global_username : message.author.globalName,
					avatar : message.author.avatar,
					total_warnings : parseInt(user.total_warnings) + 1
				});

				userTotalBans = parseInt(user.total_bans);
			}

			const guildUser = await antiHateBotMapper.get({
				user_id : message.author.id,
				guild_id : message.guildId
			});
			
			if (!guildUser) {
				await antiHateBotMapper.insert({
					guild_id : message.guildId,
					user_id : message.author.id,
					global_username : message.author.globalName,
					avatar : message.author.avatar,
					user_warnings : 1,
					user_ban : false
				});
			} else {
				guildUserWarnings = parseInt(guildUser.user_warnings) + 1;

				await antiHateBotMapper.update({
					guild_id : message.guildId,
					user_id : message.author.id,
					user_warnings : guildUserWarnings
				});
			}
			
			if (guildUserWarnings > warnings_allowed) {
				await message.guild.members.ban(message.author.id);
				
				message.reply(`Guild user "${ message.author.globalName }" has been banned due to exceed the limit number of guild's anti hate speech warnings`);

				await antiHateBotMapper.update({
					guild_id : message.guildId,
					user_id : message.author.id,
					user_ban : true,
					bans : parseInt(bans) + 1
				});

				await antiHateBotMapper.update({
					user_id : message.author.id,
					total_bans : userTotalBans + 1
				});
			} else {
				message.reply(`🚩:	Guild user "${ message.author.globalName }" has just gotten their (${ guildUserWarnings }/${ warnings_allowed }) hate speech warning`);
			}

			await antiHateBotMapper.insert({
				message_id : message.id,
				content : message.content,
				date : Date(message.createdTimeStamp),
				guild_id : message.guildId,
				user_id : message.author.id
			});
		}
	}
}