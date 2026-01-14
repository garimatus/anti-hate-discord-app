import { Client, Events, Collection } from 'discord.js'
import { collectEvents, eventListener, analyzeMessage } from '../events/utils'
import { modelMapper } from '../database'
import { configurableI18n } from '../configuration'
import { log } from '.'
import type { Event } from '../types'

export async function setUpEvents(client: Client): Promise<void> {
  const events: Collection<string, Event> = await collectEvents()

  if (!events?.size) {
    throw new Error('There was not any valid event file found.')
  }

  events.forEach((event: Event) => {
    if (event.once) {
      client.once(
        event.name,
        eventListener(event, modelMapper, configurableI18n, undefined)
      )
    }

    if (!event.once) {
      client.on(
        event.name,
        eventListener(
          event,
          modelMapper,
          configurableI18n,
          event.name === Events.MessageCreate ? analyzeMessage : undefined
        )
      )
    }
  })

  log(
    `Succesfully added ${client.eventNames().length} event(s) to client`,
    'success'
  )
}
