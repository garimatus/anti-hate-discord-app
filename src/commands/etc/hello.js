import { SlashCommandBuilder } from "discord.js";

export const command = {
	data : new SlashCommandBuilder()
		.setName("hola")
		.setDescription("Saluda a usuari@/server."),
	async execute(interaction) {
		await interaction.reply(`
			Hola ${interaction.user.username}, en ${interaction.guild.name}!
		`);
	}
};