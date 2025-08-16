import {
  Events,
  Guild,
  type GuildBasedChannel,
  TextChannel,
  Message,
  type PermissionsString,
} from 'discord.js'
import { mapping } from 'cassandra-driver'

function relativeLeavingText(secondsToLeave: number): string {
  return `🚫 I need Administrator permissions to function properly and unlock my full capabilities.\
  You can reinvite me with the required permissions here:\
  https://discord.com/oauth2/authorize?client_id=1132258417113841715&permissions=8&integration_type=0&scope=bot
  \n👋 Leaving the server ${secondsToLeave ? 'in ' + secondsToLeave : 'now'}. See you soon!`
}

export default {
  name: Events.GuildCreate,
  once: true,
  async execute(mapper: mapping.ModelMapper, guild?: Guild) {
    if (!guild?.available) return

    const generalTextChannel: TextChannel | undefined =
      guild.channels.cache.find(
        (channel: GuildBasedChannel) =>
          channel.type === 0 && channel.name === 'general'
      ) as TextChannel | undefined

    if (
      guild.members.me?.permissions.has(
        'Administrator' as PermissionsString
      ) === false
    ) {
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

    const guildResult: Guild | null = await mapper.get({
      guild_id: guild.id,
    })

    if (!guildResult) {
      await mapper.insert({
        guild_id: guild.id,
        command_prefix: '/',
        warnings_allowed: 3,
        bans: 0,
      })
    }

    if (generalTextChannel?.isSendable()) {
      await generalTextChannel.send(
        `👋 Hello there!` +
          `\nI'm your friendly AI-powered moderation bot.` +
          `\nI help keep this server safe and respectful by detecting and managing hate speech, toxic behavior and harmful content in real time.` +
          `\n\n✅ Respect others` +
          `\n🚫 No hate speech or harassment` +
          `\n🤖 I'm always learning to improve moderation` +
          `\n\nLet's build a positive community together!`
      )
    }
  },
}
