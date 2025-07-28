import { Collection, REST, Routes, Events } from 'discord.js'
import commandCollecter from './utils/collecter.js'
import commandHandler from './utils/handler.js'
import commandDeployer from './utils/deployer.js'
import logger from '../utils/logger.js'
import { type Command } from '../types/command.type.js'
import { CommandCapableClient } from '../intefaces/command-capable-client.interface.js'

export async function setClientCommands(
  client: CommandCapableClient
): Promise<void> {
  client.commands = new Collection<string, Command>()
  const commands: Command[] | undefined = await commandCollecter()

  if (!commands || !commands.length) {
    throw new Error(
      'No commands found. Please ensure commands are properly defined.'
    )
  }

  if (process.argv[2] === 'deploy' && process.env.OAUTH2_TOKEN) {
    const rest = new REST().setToken(process.env.OAUTH2_TOKEN)
    commandDeployer(rest, Routes, commands)
  }

  commands.forEach((command: Command) =>
    client.commands.set(command.data.name, command)
  )

  client.on(Events.InteractionCreate, commandHandler)

  logger(
    `Succesfully added ${client.commands.size} command(s)${
      process.argv[2] === 'deploy' ? ' and deployed' : ''
    } to client`.trim(),
    'green'
  )
}
