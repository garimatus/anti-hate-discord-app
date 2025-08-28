import { SlashCommandBuilder, CommandInteraction } from 'discord.js'
import { configurableI18n } from '../../configuration'

const { pathname: path } = new URL(import.meta.url)

export default {
  data: new SlashCommandBuilder()
    .setName((await import('path')).parse(path.split('/').pop()!!).name)
    .setDescription('Greets at user in guild.'),
  async execute(interaction: CommandInteraction) {
    if (interaction.guild?.name) {
      await interaction.reply(
        configurableI18n.__(
          'hello-user',
          interaction.user.tag,
          interaction.guild.name
        )
      )
    }
  },
}
