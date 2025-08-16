import { Collection, REST, Routes, Events } from 'discord.js'
import { collecter, handler, deployer } from '../commands/utils'
import { logger } from '../utils'
import type { Command } from '../types'
import type { CommandCapableClient } from '../interfaces'

export async function commandSetter(
  client: CommandCapableClient
): Promise<void> {
  client.commands = new Collection<string, Command>()
  const commands: Command[] | undefined = await collecter()

  if (!commands || !commands.length) {
    throw new Error(
      'No commands found. Please ensure commands are properly defined.'
    )
  }

  if (process.argv[2] === 'deploy' && process.env.OAUTH2_TOKEN) {
    const rest = new REST().setToken(process.env.OAUTH2_TOKEN)
    deployer(rest, Routes, commands)
  }

  commands.forEach((command: Command) =>
    client.commands.set(command.data.name, command)
  )

  client.on(Events.InteractionCreate, handler)

  logger(
    `Succesfully added ${client.commands.size} command(s)${
      process.argv[2] === 'deploy' ? ' and deployed' : ''
    } to client`.trim(),
    'green'
  )
}
