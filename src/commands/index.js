import { Collection, REST, Routes, Events } from 'discord.js'
import handler from './utils/handler.js'
import collecter from './utils/collecter.js'
import deployer from './utils/deployer.js'
import antiHateBotLogger from '../utils/logger.js'

export const setClientCommands = async function (client) {
  client.commands = new Collection()
  const commands = await collecter()

  if (!commands.length) {
    throw new Error('There was not any valid command file found.')
  }

  if (process.argv[2] === 'deploy') {
    const rest = new REST().setToken(process.env.OAUTH2_TOKEN)
    deployer(rest, Routes, commands)
  }

  commands.forEach((command) => client.commands.set(command.data.name, command))

  client.on(Events.InteractionCreate, handler)

  antiHateBotLogger(
    'green',
    `The following ${client.commands.size} command(s) was/were added${
      process.argv[2] === 'deploy' ? ' and deployed' : ''
    } to client:`.trim()
  )

  client.commands.forEach((command) => {
    console.log(
      '\x1b[35m    — %s\x1b[0m',
      `"${'/'}${command.data.name}": ${command.data.description}`
    )
  })
}
