import type { Interaction } from 'discord.js'
import type { CommandCapableClient } from '../../interfaces'
import type { Command } from '../../types'
import { configurableI18n } from '../../configuration'
import { modelMapper } from '../../database'
import { log } from '../../utils'

export async function handleInteraction(
  interaction: Interaction
): Promise<void> {
  if (!interaction.isChatInputCommand()) return
  const command: Command | undefined = (
    interaction.client as CommandCapableClient
  ).commands.get(interaction.commandName)
  if (!command) {
    log(
      configurableI18n.__(
        'handle-interaction-error-1',
        interaction.commandName
      ),
      'error'
    )
    return
  }

  try {
    const guildId: string =
      (
        await modelMapper.get({
          guild_id: interaction.guild?.id,
        })
      ).locale ?? 'en'
    configurableI18n.setLocale(guildId)
    await command.execute(interaction)
  } catch (error: any) {
    log(error.message, 'error')
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: configurableI18n.__('handle-interaction-followup-1'),
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: configurableI18n.__('handle-interaction-followup-1'),
        ephemeral: true,
      })
    }
  }
}
