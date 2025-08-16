import { SlashCommandBuilder, CommandInteraction } from 'discord.js'

const { pathname: path } = new URL(import.meta.url)

export default {
  data: new SlashCommandBuilder()
    .setName((await import('path')).parse(path.split('/').pop()!!).name)
    .setDescription('Greets at user in guild.'),
  async execute(interaction: CommandInteraction) {
    if (interaction.guild?.name) {
      await interaction.reply(`
			Greetings ${interaction.user.username} at ${interaction.guild.name}!
		`)
    }
  },
}
