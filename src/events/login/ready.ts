import { Events, Client } from 'discord.js'
import { logger } from '../../utils'

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (client.user?.tag) {
      logger(`Ready! Logged in as ${client.user.tag}`, 'green')
    }
  },
}
