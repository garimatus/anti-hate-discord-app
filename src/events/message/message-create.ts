import { Events, Message, type GuildChannelResolvable } from 'discord.js'
import { mapping } from 'cassandra-driver'
import type { User, GuildUser, AnalysisResponse } from '../../types'
import type { GuildInterface } from '../../interfaces'
import type { ConfigurableI18n } from '../../configuration/i18n/ConfigurableI18n'

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(
    message: Message,
    modelMapper: mapping.ModelMapper,
    configurableI18n: ConfigurableI18n,
    detector: (message: string) => Promise<AnalysisResponse>
  ): Promise<void> {
    if (
      message.member
        ?.permissionsIn(message.channel as GuildChannelResolvable)
        .has('Administrator') ||
      message.author.bot ||
      !/^\s*\S+(?:\s+\S+)+\s*$/.test(message.content)
    )
      return

    const guild: GuildInterface | null = await modelMapper.get({
      guild_id: message.guildId,
    })

    if (!guild) return

    const messageContent: string = message.content.trimStart().trimEnd()

    if ((await detector(messageContent)).result === true) {
      const user: User = await modelMapper.get({
        user_id: message.author.id,
      })

      if (!user) {
        modelMapper.insert({
          user_id: message.author.id,
          username: message.author.username,
          global_username: message.author.globalName,
          avatar: message.author.avatar,
          total_warnings: 1,
          total_bans: 0,
        })
      } else {
        await modelMapper.update({
          user_id: message.author.id,
          global_username: message.author.globalName,
          avatar: message.author.avatar,
          total_warnings: user.total_warnings + 1,
        })
      }

      let guildUser: GuildUser = await modelMapper.get({
        user_id: message.author.id,
        guild_id: message.guildId,
      })

      if (!guildUser) {
        await modelMapper.insert({
          guild_id: message.guildId,
          user_id: message.author.id,
          user_warnings: 1,
          user_is_banned: false,
        })
      } else {
        await modelMapper.update({
          guild_id: message.guildId,
          user_id: message.author.id,
          user_warnings: guildUser.user_warnings + 1,
        })
      }

      guildUser = await modelMapper.get({
        user_id: message.author.id,
        guild_id: message.guildId,
      })

      if (guildUser.user_warnings > guild.warnings_allowed) {
        await message.guild?.members.ban(message.author.id)

        message.reply(
          configurableI18n.__(
            'ban',
            message.author.globalName ?? 'Unknown User'
          )
        )

        await modelMapper.update({
          guild_id: message.guildId,
          user_id: message.author.id,
          user_is_banned: true,
          bans: guild.bans++,
        })

        await modelMapper.update({
          user_id: message.author.id,
          total_bans: user.total_bans + 1,
        })
      } else {
        message.reply(
          configurableI18n.__(
            'warning',
            message.author.globalName ?? 'Unknown User',
            guildUser.user_warnings.toString(),
            guild.warnings_allowed.toString()
          )
        )
      }

      await modelMapper.insert({
        message_id: message.id,
        content: message.content,
        date: new Date(Date.now()).toISOString(),
        guild_id: message.guildId,
        user_id: message.author.id,
      })
    }
  },
}
