import { SlashCommandBuilder } from "discord.js";
const { pathname : path } = new URL(import.meta.url);

export const command = {
	data : new SlashCommandBuilder()
		.setName((await import("path")).parse(path.split("/").pop()).name)
		.setDescription("Greets at user in guild."),
	async execute(interaction) {
		await interaction.reply(`
			Greetings ${ interaction.user.username } at ${ interaction.guild.name }!
		`);
	}
};