import { Events, Message, GuildChannelResolvable } from 'discord.js'
import { mapping } from 'cassandra-driver'
import { type User } from '../../types/user.type.js'
import { type Guild } from '../../types/guild.type.js'
import { type GuildUser } from '../../types/guild-user.type.js'
import { type HateSpeechResponse } from '../../types/hate-speech-response.type.js'

export default {
  name: Events.MessageCreate,
  once: false,
  async execute(
    message: Message,
    mapper: mapping.ModelMapper,
    hateSpeechDetector: (message: string) => Promise<HateSpeechResponse>
  ): Promise<void> {
    if (
      message.member
        ?.permissionsIn(message.channel as GuildChannelResolvable)
        .has('Administrator') ||
      message.author.bot ||
      message.content.length < 5
    )
      return

    const guild: Guild | null = await mapper.get({
      guild_id: message.guildId,
    })

    if (!guild) return

    const messageContent: string = message.content.replace(
      /[^a-z0-9¡!¿? ]/gi,
      ''
    )

    if ((await hateSpeechDetector(messageContent)).result === true) {
      const user: User = await mapper.get({
        user_id: message.author.id,
      })

      if (!user) {
        mapper.insert({
          user_id: message.author.id,
          username: message.author.username,
          global_username: message.author.globalName,
          avatar: message.author.avatar,
          total_warnings: 1,
          total_bans: 0,
        })
      } else {
        await mapper.update({
          user_id: message.author.id,
          global_username: message.author.globalName,
          avatar: message.author.avatar,
          total_warnings: user.total_warnings + 1,
        })
      }

      let guildUser: GuildUser = await mapper.get({
        user_id: message.author.id,
        guild_id: message.guildId,
      })

      if (!guildUser) {
        await mapper.insert({
          guild_id: message.guildId,
          user_id: message.author.id,
          user_warnings: 1,
          user_is_banned: false,
        })
      } else {
        await mapper.update({
          guild_id: message.guildId,
          user_id: message.author.id,
          user_warnings: guildUser.user_warnings + 1,
        })
      }

      guildUser = await mapper.get({
        user_id: message.author.id,
        guild_id: message.guildId,
      })

      if (guildUser.user_warnings > guild.warnings_allowed) {
        await message.guild?.members.ban(message.author.id)

        message.reply(
          `Guild user "${message.author.globalName}" has been banned due to exceed the limit number of guild's anti hate speech warnings`
        )

        await mapper.update({
          guild_id: message.guildId,
          user_id: message.author.id,
          user_is_banned: true,
          bans: guild.bans++,
        })

        await mapper.update({
          user_id: message.author.id,
          total_bans: user.total_bans + 1,
        })
      } else {
        message.reply(
          `🚩:	Guild user "${message.author.globalName}" has just gotten their (${guildUser.user_warnings}/${guild.warnings_allowed}) hate speech warning`
        )
      }

      await mapper.insert({
        message_id: message.id,
        content: message.content,
        date: new Date(Date.now()).toISOString(),
        guild_id: message.guildId,
        user_id: message.author.id,
      })
    }
  },
}
