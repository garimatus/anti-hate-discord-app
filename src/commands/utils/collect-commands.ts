import fs from 'node:fs'
import * as Path from 'path'
import { Collection } from 'discord.js'
import { log } from '../../utils'
import type { Command } from '../../types'
import { configurableI18n } from '../../configuration'

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
            log(
              configurableI18n.__(
                'collect-commands-2',
                filePath,
                'data',
                'execute'
              ),
              'warning'
            )
          }
        }
      }
    }
  } catch (error: any) {
    log(configurableI18n.__('collect-commands-1', error.message), 'error')
  }

  return commands
}
