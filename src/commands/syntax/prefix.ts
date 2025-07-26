import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  SlashCommandStringOption,
  CommandInteraction,
} from 'discord.js'
import { mapper } from '../../database/index.js'

export default {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription("Sets the guild's own commands prefix.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option: SlashCommandStringOption) => {
      return option
        .setName('char')
        .setDescription('The character prefix to add.')
        .setRequired(true)
    }),
  async execute(interaction: CommandInteraction) {
    // @ts-ignore
    if (interaction.options._hoistedOptions[0].value.length > 1) {
      await interaction.reply(`
				ERROR: the input prefix can't be more than 1 character long.
			`)

      return
    }
    // @ts-ignore
    if (/^[a-zA-Z0-9]+$/.test(interaction.options._hoistedOptions[0].value)) {
      await interaction.reply(`
				ERROR: the input prefix can't be an alphanumeric character
			`)

      return
    }

    await mapper.update({
      // @ts-ignore
      guild_id: interaction.member?.guild.id,
      // @ts-ignore
      command_prefix: interaction.options._hoistedOptions[0].value,
    })

    await interaction.reply(`
			Commands prefix updated to "${
        // @ts-ignore
        interaction.options._hoistedOptions[0].value
      }"
		`)
  },
}
