import {
  Events,
  Guild,
  type GuildBasedChannel,
  TextChannel,
  Message,
  type PermissionsString,
} from 'discord.js'
import { mapping } from 'cassandra-driver'
import { relativeLeavingText } from '../utils'
import type { GuildInterface } from '../../interfaces'
import type { ConfigurableI18n } from '../../configuration/i18n/ConfigurableI18n'

export default {
  name: Events.GuildCreate,
  once: false,
  async execute(
    guild: Guild,
    mapper: mapping.ModelMapper,
    configurableI18n: ConfigurableI18n
  ) {
    if (!guild.available || !guild.members.me) {
      await guild.leave()
      return
    }

    const generalTextChannel: TextChannel | undefined =
      guild.channels.cache.find(
        (channel: GuildBasedChannel) =>
          channel.type === 0 && channel.name === 'general'
      ) as TextChannel | undefined

    if (
      !guild.members.me.permissions.has('Administrator' as PermissionsString)
    ) {
      if (!generalTextChannel?.isSendable()) {
        await guild.leave()
        return
      } else if (guild.leave) {
        let secondsToLeave: number = 5
        const leavingMessage: Message<true> | undefined =
          await generalTextChannel?.send(relativeLeavingText(secondsToLeave))
        const messageInterval: NodeJS.Timeout = setInterval(async () => {
          secondsToLeave--
          try {
            await leavingMessage?.edit(relativeLeavingText(secondsToLeave))
          } catch (error: any) {
            console.error(error)
            return
          }

          if (secondsToLeave <= 0) {
            try {
              await guild.leave()
            } catch (error: any) {
              console.error(error)
              return
            }

            clearInterval(messageInterval)
            return
          }
        }, 1000)
        return
      }
    }

    const guildById: GuildInterface | null = await mapper.get({
      guild_id: guild.id,
    })

    if (!guildById) {
      await mapper.insert({
        guild_id: guild.id,
        command_prefix: '/',
        warnings_allowed: 3,
        bans: 0,
        locale: 'en',
      })
    }

    if (generalTextChannel?.isSendable()) {
      await generalTextChannel.send(configurableI18n.__('hello-guild'))
    }
  },
}
