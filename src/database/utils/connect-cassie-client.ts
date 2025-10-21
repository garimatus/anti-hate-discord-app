import { Client } from 'cassandra-driver'

export async function connectCassieClient(client: Client): Promise<void> {
  try {
    await client.connect()
  } catch (error: any) {
    console.error('Failed to connect to Cassandra database:', error)
    throw error
  }
}
