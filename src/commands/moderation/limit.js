import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { mapper } from "../../database/index.js";
const { pathname : path } = new URL(import.meta.url);

export const command = {
	data : new SlashCommandBuilder()
        .setName((await import("path")).parse(path.split("/").pop()).name)
        .setDescription("Sets the limit value of allowed warnings per user at current guild.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => {
			return option.setName("limit")
				.setDescription("The new value of max warnings allowed.")
				.setRequired(true)
		}),
	async execute(interaction) {
		const newWarningsLimit = parseInt(interaction.options._hoistedOptions[0].value);

        if (!Number(newWarningsLimit)) {
            interaction.reply(`The new limit value isn't a number`);

            return;
        }

        if (newWarningsLimit < 0) {
            interaction.reply(`The new limit value cannot be less than zero`);

            return;
        }
        
        const antiHateDiscordBotMapper = mapper.forModel("anti-hate-discord-bot");
		
        const { warnings_allowed } = await antiHateDiscordBotMapper.get({
            guild_id : interaction.member.guild.id
        });
        
        if (newWarningsLimit == warnings_allowed) {
            interaction.reply(`Error: the new limit value of warnings allowed in Guild cannot be the old one`);

            return;
        }

		await antiHateDiscordBotMapper.update({
			guild_id : interaction.member.guild.id,
            warnings_allowed : newWarningsLimit
		});

		await interaction.reply(`
			Guild's limit value of warnings per user setted from ${ warnings_allowed } to ${ newWarningsLimit }
		`);
	}
}