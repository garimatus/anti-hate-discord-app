import type { Interaction } from 'discord.js'
import type { CommandCapableClient } from '../../interfaces'
import type { Command } from '../../types'
import { configurableI18n } from '../../configuration'
import { modelMapper } from '../../database'

export async function handleInteraction(
  interaction: Interaction
): Promise<void> {
  if (!interaction.isChatInputCommand()) return
  const command: Command | undefined = (
    interaction.client as CommandCapableClient
  ).commands.get(interaction.commandName)

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`)
    return
  }

  try {
    configurableI18n.setLocale(
      (
        await modelMapper.get({
          guild_id: interaction.guild?.id,
        })
      ).locale ?? 'en'
    )
    await command.execute(interaction)
  } catch (error: any) {
    console.error(error)
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      })
    }
  }
}
