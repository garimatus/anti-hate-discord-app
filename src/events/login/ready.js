import { Events } from 'discord.js'
import antiHateBotLogger from '../../utils/logger.js'

export const event = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    antiHateBotLogger('green', `Ready! Logged in as ${client.user.tag}`)
  },
}
