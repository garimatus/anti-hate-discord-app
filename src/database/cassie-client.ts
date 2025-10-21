import { Client } from 'cassandra-driver'

export const cassieClient: Client = new Client({
  contactPoints: [
    `${process.env.CASSIE_HOST ?? 'localhost'}:${process.env.CASSIE_PORT ?? '9042'}`,
  ],
  localDataCenter: 'datacenter1',
})
