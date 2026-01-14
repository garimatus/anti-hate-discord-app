import { Events, Client } from 'discord.js'
import { log } from '../../utils'

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (client.user?.tag) {
      log(`Ready! Logged in as ${client.user.tag}`, 'success')
    }
  },
}
