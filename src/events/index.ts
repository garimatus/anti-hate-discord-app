import { Client, Events } from 'discord.js'
import eventCollecter from './utils/collecter.js'
import listener from './utils/listener.js'
import { mapper } from '../database/index.js'
import logger from '../utils/logger.js'
import hateSpeechDetector from './utils/hateSpeechDetector.js'
import Event from '../types/event.type.js'

export async function setClientEvents(client: Client): Promise<void> {
  const events: Event[] = await eventCollecter()

  if (!events?.length) {
    throw new Error('There was not any valid event file found.')
  }

  events.forEach((event: Event) => {
    if (event.once) {
      client.once(event.name, listener(event, mapper))
    }

    if (!event.once) {
      if (event.name === Events.MessageCreate) {
        client.on(event.name, listener(event, mapper, hateSpeechDetector))
      } else {
        client.on(event.name, listener(event, mapper))
      }
    }
  })

  logger(
    `Succesfully added ${client.eventNames().length} event(s) to client`,
    'green'
  )

  client.eventNames().forEach((eventName: string | symbol) => {
    console.log('\x1b[35m    — %s\x1b[0m', eventName)
  })
}
