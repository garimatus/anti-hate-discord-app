import { Client, Events } from 'discord.js'
import { collecter, listener, detector } from '../events/utils'
import { mapper } from '../database'
import { configurableI18n } from '../configuration'
import { logger } from '../utils'
import type { Event } from '../types'

export async function eventSetter(client: Client): Promise<void> {
  const events: Event[] = await collecter()

  if (!events?.length) {
    throw new Error('There was not any valid event file found.')
  }

  events.forEach((event: Event) => {
    if (event.once) {
      client.once(
        event.name,
        listener(event, mapper, configurableI18n, undefined)
      )
    }

    if (!event.once) {
      client.on(
        event.name,
        listener(
          event,
          mapper,
          configurableI18n,
          event.name === Events.MessageCreate ? detector : undefined
        )
      )
    }
  })

  logger(
    `Succesfully added ${client.eventNames().length} event(s) to client`,
    'green'
  )
}
