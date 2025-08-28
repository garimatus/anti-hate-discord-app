import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  SlashCommandStringOption,
  CommandInteraction,
  Locale,
} from 'discord.js'
import { mapper } from '../../database'
import { configurableI18n } from '../../configuration'

export default {
  data: new SlashCommandBuilder()
    .setName('locale')
    .setDescription('Change the Guild locale.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option: SlashCommandStringOption) => {
      return option
        .setName('string')
        .setDescription(
          'The locale to change (e.g., en-GB, es-ES, es-419, de, fr), etc.'
        )
        .setRequired(true)
    }),
  async execute(interaction: CommandInteraction) {
    const interactionLocale: string =
      // @ts-ignore
      interaction.options._hoistedOptions[0].value.trim()
    if (!Object.values(Locale).includes(interactionLocale as Locale)) {
      await interaction.reply(
        configurableI18n.__('locale-change-error-1', interactionLocale)
      )
      return
    } else {
      const locale: string = interactionLocale.substring(0, 2)
      await mapper.update({
        // @ts-ignore
        guild_id: interaction.member?.guild.id,
        locale,
      })
      configurableI18n.setLocale(locale)
      await interaction.reply(
        configurableI18n.__('locale-change-success', interactionLocale)
      )
    }
  },
}
