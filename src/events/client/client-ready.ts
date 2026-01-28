import { Events, Client } from 'discord.js'
import { log } from '../../utils'
import { configurableI18n } from '../../configuration'

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    if (client.user?.tag) {
      log(
        configurableI18n.__('client-ready-success', client.user.tag),
        'success'
      )
    }
  },
}
