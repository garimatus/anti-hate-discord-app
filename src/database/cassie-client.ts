import { Client } from 'cassandra-driver'

export const cassieClient: Client = new Client({
  contactPoints: [`${process.env.CASSIE_HOST}:${process.env.CASSIE_PORT}`],
  localDataCenter: 'datacenter1',
})
