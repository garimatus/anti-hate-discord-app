import { mapping } from 'cassandra-driver'
import { cassieClient } from '../index'
import { connectCassieClient, collectQueries } from '.'

export async function createModelMapper(): Promise<mapping.ModelMapper> {
  await connectCassieClient(cassieClient)
  const queries: Record<string, string> = await collectQueries()
  if (queries) {
    // @ts-ignore
    await cassieClient.execute(queries.createKeyspace)
    // @ts-ignore
    await cassieClient.execute(queries.createMessage)
    // @ts-ignore
    await cassieClient.execute(queries.createGuild)
    // @ts-ignore
    await cassieClient.execute(queries.createUser)
    // @ts-ignore
    await cassieClient.execute(queries.createGuildUser)
  }
  return new mapping.Mapper(cassieClient, {
    models: {
      'anti-hate-discord-bot': {
        keyspace: 'anti_hate_discord_bot',
        tables: ['message', 'guild', 'user', 'guild_user'],
      },
    },
  }).forModel('anti-hate-discord-bot')
}
