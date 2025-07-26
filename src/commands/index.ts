import { Collection, REST, Routes, Events } from 'discord.js'
import handler from './utils/handler.js'
import collecter from './utils/collecter.js'
import deployer from './utils/deployer.js'
import logger from '../utils/logger.js'
import Command from '../types/command.type.js'

export async function setClientCommands(client: any) {
  client.commands = new Collection()
  const commands: Command[] | undefined = await collecter()

  if (!commands || !commands.length) {
    throw new Error('There was not any valid command file found.')
  }

  if (process.argv[2] === 'deploy' && process.env.OAUTH2_TOKEN) {
    const rest = new REST().setToken(process.env.OAUTH2_TOKEN)
    deployer(rest, Routes, commands)
  }
  // @ts-ignore
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

  client.commands.forEach((command: Command) => {
    console.log(
      '\x1b[35m    — %s\x1b[0m',
      `"${'/'}${command.data.name}": ${command.data.description}`
    )
  })
}
