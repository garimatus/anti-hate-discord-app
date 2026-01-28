import { REST, Routes, Events } from 'discord.js'
import {
  collectCommands,
  handleInteraction,
  deployCommands,
} from '../commands/utils'
import { log } from '.'
import type { Command } from '../types'
import type { CommandCapableClient } from '../interfaces'
import { configurableI18n } from '../configuration'

export async function setUpCommands(
  client: CommandCapableClient
): Promise<void> {
  client.commands = await collectCommands()
  const isDeployment: boolean = process.argv[2] === 'deploy'

  if (!client.commands || !client.commands.size) {
    throw new Error(configurableI18n.__('set-up-commands-error-1'))
  }

  client.commands.forEach((command: Command) =>
    client.commands.set(command.data.name, command)
  )

  log(
    configurableI18n.__(
      'set-up-commands-success',
      String(client.commands.size)
    ),
    'success'
  )

  client.on(Events.InteractionCreate, handleInteraction)

  if (isDeployment && process.env.DISCORD_OAUTH2_TOKEN) {
    const rest: REST = new REST().setToken(process.env.DISCORD_OAUTH2_TOKEN)
    deployCommands(rest, Routes, client.commands)
  }
}
