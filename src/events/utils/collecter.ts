import fs from 'node:fs'
import * as Path from 'path'
import { Collection } from 'discord.js'
import { logger } from '../../utils'
import type { Event } from '../../types'

const { pathname: path }: { pathname: string } = new URL('../', import.meta.url)

export async function collecter(): Promise<Collection<string, Event>> {
  const events: Collection<string, Event> = new Collection<string, Event>()
  const eventsFoldersPath: string = path

  try {
    const eventsFolders: string[] = fs.readdirSync(eventsFoldersPath)

    for (const folder of eventsFolders) {
      const eventsPath: string = eventsFoldersPath + folder

      if (fs.lstatSync(eventsPath).isDirectory() && folder !== 'utils') {
        const eventFiles: string[] = fs
          .readdirSync(eventsPath)
          .filter((file) => file.endsWith('.ts'))

        for (const file of eventFiles) {
          const filePath: string = eventsPath + '/' + file
          const event: Event = (await import(filePath)).default

          if ('name' in event!! && 'execute' in event!!) {
            events.set(Path.basename(file, Path.extname(file)), event)
          } else {
            logger(
              `[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`,
              'yellow'
            )
          }
        }
      }
    }
  } catch (error: any) {
    logger(`[ERROR] Failed to collect events: ${error.message}`, 'red')
  }

  return events
}
