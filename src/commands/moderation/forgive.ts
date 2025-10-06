import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  CommandInteraction,
} from 'discord.js'
import { modelMapper } from '../../database'
import { configurableI18n } from '../../configuration'
import type { User } from '../../types'

const { pathname: path }: URL = new URL(import.meta.url)

export default {
  data: new SlashCommandBuilder()
    .setName((await import('path')).parse(path.split('/').pop()!!).name)
    .setDescription(
      'Resets warning counter and unbans user (if necessary) by their id at current Guild.'
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) => {
      return option
        .setName('id')
        .setDescription("The user's id to forgive.")
        .setRequired(true)
    }),
  async execute(interaction: CommandInteraction): Promise<void> {
    const interactionUserId: string =
      // @ts-ignore
      interaction.options._hoistedOptions[0].value.trim()

    if (!interactionUserId.length || isNaN(Number(interactionUserId))) {
      await interaction.reply(configurableI18n.__('forgive-error-1'))
      return
    }

    const user: User = await modelMapper.get({
      user_id: interactionUserId,
    })

    if (!user) {
      await interaction.reply(configurableI18n.__('forgive-error-2'))
      return
    }

    const {
      user_warnings,
      user_ban,
    }: { user_warnings: number; user_ban: boolean } = await modelMapper.get({
      // @ts-ignore
      guild_id: interaction.member?.guild.id,
      user_id: user.user_id,
    })

    if (!user_warnings && !user_ban) {
      await interaction.reply(configurableI18n.__('forgive-error-3'))
      return
    }

    if (user_ban) {
      try {
        // @ts-ignore
        await interaction.member?.guild.members.unban(user.user_id.toString())
      } catch (error: any) {
        console.log(error)
      }
    }

    await modelMapper.update({
      // @ts-ignore
      guild_id: interaction.member?.guild.id,
      user_id: user.user_id,
      user_warnings: 0,
      user_ban: false,
    })

    await interaction.reply(
      configurableI18n.__('forgive-success', user.username)
    )
  },
}
