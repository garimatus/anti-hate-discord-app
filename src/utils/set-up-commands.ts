import { REST, Routes, Events } from 'discord.js'
import {
  collectCommands,
  handleInteraction,
  deployCommands,
} from '../commands/utils'
import { logger } from '.'
import type { Command } from '../types'
import type { CommandCapableClient } from '../interfaces'

export async function setUpCommands(
  client: CommandCapableClient
): Promise<void> {
  client.commands = await collectCommands()
  const isDeployment: boolean = process.argv[2] === 'deploy'

  if (!client.commands || !client.commands.size) {
    throw new Error(
      'No commands found. Please ensure commands are properly defined.'
    )
  }

  client.commands.forEach((command: Command) =>
    client.commands.set(command.data.name, command)
  )

  logger(
    `Succesfully added ${client.commands.size} command(s) to client`,
    'green'
  )

  client.on(Events.InteractionCreate, handleInteraction)

  if (isDeployment && process.env.DISCORD_OAUTH2_TOKEN) {
    const rest: REST = new REST().setToken(process.env.DISCORD_OAUTH2_TOKEN)
    deployCommands(rest, Routes, client.commands)
  }
}
