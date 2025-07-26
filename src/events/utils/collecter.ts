import fs from 'node:fs'
import logger from '../../utils/logger.js'
import type Event from '../../types/event.type.js'

const { pathname: path } = new URL('../', import.meta.url)

export default async function (): Promise<Event[]> {
  const events: Event[] = []
  const eventsFoldersPath: string = path

  try {
    const eventsFolders: string[] = fs.readdirSync(eventsFoldersPath)

    for (const folder of eventsFolders) {
      const eventsPath: string = eventsFoldersPath + folder

      if (fs.lstatSync(eventsPath).isDirectory() && folder !== 'utils') {
        const eventFiles: string[] = fs
          .readdirSync(eventsPath)
          .filter((file) => file.endsWith('.js'))

        for (const file of eventFiles) {
          const filePath: string = eventsPath + '/' + file
          const event: Event = (await import(filePath)).default

          if ('name' in event!! && 'execute' in event!!) {
            events.push(event)
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
