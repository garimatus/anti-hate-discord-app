import { Client, Events } from 'discord.js'
import { collecter, listener, detector } from '../events/utils'
import { mapper } from '../database'
import { logger } from '../utils'
import type { Event } from '../types'

export async function eventSetter(client: Client): Promise<void> {
  const events: Event[] = await collecter()

  if (!events?.length) {
    throw new Error('There was not any valid event file found.')
  }

  events.forEach((event: Event) => {
    if (event.once) {
      client.once(event.name, listener(event, mapper))
    }

    if (!event.once) {
      if (event.name === Events.MessageCreate) {
        client.on(event.name, listener(event, mapper, detector))
      } else {
        client.on(event.name, listener(event, mapper))
      }
    }
  })

  logger(
    `Succesfully added ${client.eventNames().length} event(s) to client`,
    'green'
  )
}
