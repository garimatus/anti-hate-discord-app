import { Client, mapping } from 'cassandra-driver'
import collecter from './utils/collecter.js'

const client: Client = new Client({
  contactPoints: [`${process.env.CASSIE_HOST}:${process.env.CASSIE_PORT}`],
  localDataCenter: 'datacenter1',
})

client.connect().then(async () => {
  const queries: Object | undefined = await collecter()
  if (queries) {
    // @ts-ignore
    await client.execute(queries.createKeyspace)
    // @ts-ignore
    await client.execute(queries.createMessage)
    // @ts-ignore
    await client.execute(queries.createGuild)
    // @ts-ignore
    await client.execute(queries.createUser)
    // @ts-ignore
    await client.execute(queries.createGuildUser)
  }
})

export const mapper: mapping.ModelMapper = new mapping.Mapper(client, {
  models: {
    'anti-hate-discord-bot': {
      keyspace: 'anti_hate_discord_bot',
      tables: ['message', 'guild', 'user', 'guild_user'],
    },
  },
}).forModel('anti-hate-discord-bot')
