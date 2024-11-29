import collecter from './utils/collecter.js'
import listener from './utils/listener.js'
import { mapper } from '../database/index.js'
import antiHateBotLogger from '../utils/logger.js'

export const setClientEvents = async function (client) {
  // Events collection and handling with client instance
  const events = await collecter()

  if (!events.length) {
    throw new Error('There was not any valid event file found.')
  }

  const antiHateDiscordBotMapper = mapper.forModel('anti-hate-discord-bot')

  events.forEach((event) => {
    if (event.once) {
      client.once(event.name, listener(event, antiHateDiscordBotMapper))
    }

    if (!event.once) {
      client.on(event.name, listener(event, antiHateDiscordBotMapper))
    }
  })

  antiHateBotLogger(
    'green',
    `The following ${client.eventNames().length} event(s) was/were added to client:`
  )

  client.eventNames().forEach((eventName) => {
    console.log('\x1b[35m    — %s\x1b[0m', eventName)
  })
}
