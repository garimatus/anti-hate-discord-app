import { Client, mapping } from 'cassandra-driver'
import collecter from './utils/collecter.js'

const client = new Client({
  contactPoints: [`${process.env.CASSIE_HOST}:${process.env.CASSIE_PORT}`],
  localDataCenter: 'datacenter1',
})

client.connect().then(async () => {
  const queries = await collecter()
  await client.execute(queries.createKeyspace)
  client.execute(queries.createMessages)
  client.execute(queries.createGuilds)
  client.execute(queries.createUsers)
  client.execute(queries.createGuildsUsers)
})

export const mapper = new mapping.Mapper(client, {
  models: {
    'anti-hate-discord-bot': {
      keyspace: 'anti_hate_discord_bot',
      tables: ['messages', 'guilds', 'users', 'guilds_users'],
    },
  },
})
