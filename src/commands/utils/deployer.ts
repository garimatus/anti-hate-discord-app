import { REST } from 'discord.js'
import logger from '../../utils/logger.js'
import { mapper } from '../../database/index.js'
import { Command } from '../../types/command.type.js'
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord-api-types/v10'

export default async function (
  rest: REST,
  Routes: any,
  commands: Command[]
): Promise<void> {
  try {
    const commandsJsoned: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []
    commands.forEach((command: Command) => {
      commandsJsoned.push(command.data.toJSON())
    })

    logger(
      `Started refreshing ${commandsJsoned.length} application (/) commands.`,
      'green'
    )

    const guildsCount: number = (
      await mapper.mapWithQuery(
        `SELECT
        COUNT(Guild_Id) AS Guilds_Count
      FROM
        Anti_Hate_Discord_Bot.Guild`,
        (guild_id: any[]) => guild_id
      )([])
    ).first().Guilds_Count

    if (guildsCount > 0) {
      const data: any = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
        { body: commandsJsoned }
      )

      logger(
        `Successfully reloaded ${data.length} application (/) commands into ${guildsCount} guild(s).`,
        'green'
      )
    }
  } catch (error: any) {
    console.error(error)
  }
}
