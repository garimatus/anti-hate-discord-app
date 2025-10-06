import fs from 'node:fs'
import * as Path from 'path'
import { Collection } from 'discord.js'
import { logger } from '../../utils'
import type { Command } from '../../types'

const { pathname: path }: { pathname: string } = new URL('../', import.meta.url)

export async function collectCommands(): Promise<Collection<string, Command>> {
  const commands: Collection<string, Command> = new Collection<
    string,
    Command
  >()
  const commandsFoldersPath: string = path

  try {
    const commandsFolders: string[] = fs.readdirSync(commandsFoldersPath)

    for (const folder of commandsFolders) {
      const commandsPath: string = commandsFoldersPath + folder

      if (fs.lstatSync(commandsPath).isDirectory() && folder !== 'utils') {
        const commandFiles: string[] = fs
          .readdirSync(commandsPath)
          .filter((file) => file.endsWith('.ts'))

        for (const file of commandFiles) {
          const filePath: string = commandsPath + '/' + file
          const command: Command = (await import(filePath)).default

          if ('data' in command && 'execute' in command) {
            commands.set(Path.basename(file, Path.extname(file)), command)
          } else {
            logger(
              `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
              'yellow'
            )
          }
        }
      }
    }
  } catch (error: any) {
    logger(
      `[ERROR] An error has ocurred while trying to collect all command files: ${error}`,
      'red'
    )
  }

  return commands
}
