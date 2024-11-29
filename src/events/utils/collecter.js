import fs from 'node:fs'
import botLogger from '../../utils/logger.js'
const { pathname: path } = new URL('../', import.meta.url)

export default async function () {
  const events = []
  const eventsFoldersPath = path

  try {
    const eventsFolders = fs.readdirSync(eventsFoldersPath)

    for (const folder of eventsFolders) {
      const eventsPath = eventsFoldersPath + folder

      if (fs.lstatSync(eventsPath).isDirectory() && folder !== 'utils') {
        const eventFiles = fs
          .readdirSync(eventsPath)
          .filter((file) => file.endsWith('.js'))

        for (const file of eventFiles) {
          const filePath = eventsPath + '/' + file

          // Set a new item in the Collection with the key as the event name and the value as the exported module
          const { event } = await import(filePath)

          if ('name' in event && 'execute' in event) {
            events.push(event)
          } else {
            botLogger(
              'yellow',
              `[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`
            )
          }
        }
      }
    }

    return events
  } catch (error) {
    botLogger(
      'red',
      `[ERROR] An error has ocurred while trying to collect all event files: ${error}`
    )
  }
}
