import { REST, Collection } from 'discord.js'
import { log } from '../../utils'
import { modelMapper } from '../../database'
import type { Command } from '../../types'
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10'
import { configurableI18n } from '../../configuration'

export async function deployCommands(
  rest: REST,
  Routes: any,
  commands: Collection<string, Command>
): Promise<void> {
  try {
    const commandsJsoned: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
    commands.forEach((command: Command) => {
      commandsJsoned.push(command.data.toJSON())
    })

    const guildsCount: number = (
      await modelMapper.mapWithQuery(
        `SELECT
        COUNT(guild_id) AS guilds_counter
      FROM
        anti_hate_discord_bot.guild`,
        (guild_id: any[]) => guild_id
      )([])
    ).first().guilds_counter as number | 0

    if (guildsCount > 0) {
      const deploymentResponseData: unknown[] = (await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commandsJsoned }
      )) as unknown[]
      log(
        configurableI18n.__(
          'deploy-commands-success-1',
          String(deploymentResponseData.length)
        ),
        'success'
      )

      log(
        configurableI18n.__(
          'deploy-commands-success-2',
          String(deploymentResponseData.length),
          String(guildsCount)
        ),
        'success'
      )
    }
  } catch (error: any) {
    log(error.message, 'error')
  }
}
