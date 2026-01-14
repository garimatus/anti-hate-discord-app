import { REST, Collection } from 'discord.js'
import { log } from '../../utils'
import { modelMapper } from '../../database'
import type { Command } from '../../types'
import type { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10'

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

    const guildsCounter: number = (
      await modelMapper.mapWithQuery(
        `SELECT
        COUNT(guild_id) AS guilds_counter
      FROM
        anti_hate_discord_bot.guild`,
        (guild_id: any[]) => guild_id
      )([])
    ).first().guilds_counter as number | 0

    if (guildsCounter > 0) {
      log(
        `Started refreshing ${commandsJsoned.length} application (/) commands.`,
        'success'
      )

      const deploymentResponseData: unknown[] = (await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commandsJsoned }
      )) as unknown[]

      log(
        `Successfully reloaded ${deploymentResponseData.length} application (/) commands into ${guildsCounter} guild(s).`,
        'success'
      )
    }
  } catch (error: any) {
    console.error(error)
  }
}
