import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  SlashCommandStringOption,
  CommandInteraction,
} from 'discord.js'
import { mapper } from '../../database'

const { pathname: path }: URL = new URL(import.meta.url)

export default {
  data: new SlashCommandBuilder()
    .setName((await import('path')).parse(path.split('/').pop()!!).name)
    .setDescription(
      'Sets the limit value of allowed warnings per user at current guild.'
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option: SlashCommandStringOption) => {
      return option
        .setName('limit')
        .setDescription('The new value of max warnings allowed.')
        .setRequired(true)
    }),
  async execute(interaction: CommandInteraction) {
    const newWarningsLimit: number = parseInt(
      // @ts-ignore
      interaction.options._hoistedOptions[0].value
    )

    if (!Number(newWarningsLimit)) {
      interaction.reply(`The new limit value isn't a number`)
      return
    }

    if (newWarningsLimit < 0) {
      interaction.reply(`The new limit value cannot be less than zero`)
      return
    }

    const { warnings_allowed }: { warnings_allowed: number } = await mapper.get(
      {
        // @ts-ignore
        guild_id: interaction.member?.guild.id,
      }
    )

    if (newWarningsLimit == warnings_allowed) {
      interaction.reply(
        `Error: the new limit value of warnings allowed in Guild cannot be the old one`
      )
      return
    }

    await mapper.update({
      // @ts-ignore
      guild_id: interaction.member?.guild.id,
      warnings_allowed: newWarningsLimit,
    })

    await interaction.reply(`
			Guild's limit value of warnings per user setted from ${warnings_allowed} to ${newWarningsLimit}
		`)
  },
}
