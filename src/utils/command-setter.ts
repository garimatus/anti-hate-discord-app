import { REST, Routes, Events } from 'discord.js'
import { collecter, handler, deployer } from '../commands/utils'
import { logger } from '../utils'
import type { Command } from '../types'
import type { CommandCapableClient } from '../interfaces'

export async function commandSetter(
  client: CommandCapableClient
): Promise<void> {
  client.commands = await collecter()
  const isDeployment: boolean = process.argv[2] === 'deploy'

  if (!client.commands || !client.commands.size) {
    throw new Error(
      'No commands found. Please ensure commands are properly defined.'
    )
  }

  client.commands.forEach((command: Command) =>
    client.commands.set(command.data.name, command)
  )

  client.on(Events.InteractionCreate, handler)

  if (isDeployment && process.env.DISCORD_OAUTH2_TOKEN) {
    const rest: REST = new REST().setToken(process.env.DISCORD_OAUTH2_TOKEN)
    deployer(rest, Routes, client.commands)
  } else {
    logger(
      `Succesfully added ${client.commands.size} command(s) to client`,
      'green'
    )
  }
}
