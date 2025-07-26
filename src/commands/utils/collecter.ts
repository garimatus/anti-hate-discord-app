import fs from 'node:fs'
import logger from '../../utils/logger.js'
import Command from '../../types/command.type.js'
const { pathname: path } = new URL('../', import.meta.url)

export default async function (): Promise<Command[] | undefined> {
  const commands: Command[] = []
  const commandsFoldersPath: string = path

  try {
    const commandsFolders: string[] = fs.readdirSync(commandsFoldersPath)

    for (const folder of commandsFolders) {
      const commandsPath: string = commandsFoldersPath + folder

      if (fs.lstatSync(commandsPath).isDirectory() && folder !== 'utils') {
        const commandFiles: string[] = fs
          .readdirSync(commandsPath)
          .filter((file) => file.endsWith('.js'))

        for (const file of commandFiles) {
          const filePath: string = commandsPath + '/' + file
          // Set a new item in the Collection with the key as the command name and the value as the exported module
          const command: Command = (await import(filePath)).default

          if ('data' in command && 'execute' in command) {
            commands.push(command)
          } else {
            logger(
              `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
              'yellow'
            )
          }
        }
      }
    }

    return commands
  } catch (error: any) {
    logger(
      `[ERROR] An error has ocurred while trying to collect all command files: ${error}`,
      'red'
    )
  }
}
