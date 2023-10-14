import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { mapper } from "../../database/index.js";

export const command = {
	data : new SlashCommandBuilder()
        .setName("forgive")
        .setDescription("Resets warnings counter and unbans user if necessary by their id at current Guild.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => {
			return option.setName("id")
				.setDescription("The user's id to forgive.")
				.setRequired(true)
		}),
	async execute(interaction) {
		const userId = interaction.options._hoistedOptions[0].value.trim()

        const antiHateBotMapper = mapper.forModel("Anti_Hate_Discord_Bot");
        
        const user = await antiHateBotMapper.get({
            user_id : userId,
        });

        if (!user) {
			await interaction.reply(`
				Error: user isn't at bot's database
			`);

			return;
		}

		const { user_warnings, user_ban } = await antiHateBotMapper.get({
			guild_id : interaction.member.guild.id,
			user_id : user.user_id
		});

		if (!user_warnings && !user_ban) {
			await interaction.reply(`
				Error: user isn't banned or hasn't any warnings at current Guild
			`);

			return;
		}

		if (user_ban) {
			try {
				await interaction.member.guild.members.unban(user.user_id.toString())
			} catch(error) {
				// console.log(error)
			}
		}
		
		await antiHateBotMapper.update({
			guild_id : interaction.member.guild.id,
			user_id : user.user_id,
			user_warnings : 0,
			user_ban : false
		});

		await interaction.reply(`
			User "${ user.username }" has been forgiven in this Guild
		`);
	}
};