import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  SlashCommandStringOption,
  CommandInteraction,
} from 'discord.js'
import { modelMapper } from '../../database'
import { configurableI18n } from '../../configuration'

const { pathname: path }: URL = new URL(import.meta.url)

export default {
  data: new SlashCommandBuilder()
    .setName((await import('path')).parse(path.split('/').pop()!!).name)
    .setDescription(
      'Sets the limit value of allowed warnings per user at current Guild.'
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option: SlashCommandStringOption) => {
      return option
        .setName('limit')
        .setDescription('The new value of maximum warnings allowed')
        .setRequired(true)
    }),
  async execute(interaction: CommandInteraction) {
    const newWarningsLimit: number = parseInt(
      // @ts-ignore
      interaction.options._hoistedOptions[0].value
    )

    if (!Number(newWarningsLimit)) {
      interaction.reply(configurableI18n.__mf('limit-change-error-1'))
      return
    }

    if (newWarningsLimit < 0) {
      interaction.reply(configurableI18n.__mf('limit-change-error-2'))
      return
    }

    const { warnings_allowed }: { warnings_allowed: number } =
      await modelMapper.get({
        // @ts-ignore
        guild_id: interaction.member?.guild.id,
      })

    if (newWarningsLimit === warnings_allowed) {
      interaction.reply(
        configurableI18n.__('limit-change-error-3', newWarningsLimit.toString())
      )
      return
    }

    await modelMapper.update({
      // @ts-ignore
      guild_id: interaction.member?.guild.id,
      warnings_allowed: newWarningsLimit,
    })

    await interaction.reply(
      configurableI18n.__(
        'limit-change-success',
        warnings_allowed.toString(),
        newWarningsLimit.toString()
      )
    )
  },
}
