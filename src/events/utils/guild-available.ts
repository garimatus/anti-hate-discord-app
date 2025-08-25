import { Events, Guild, type GuildBasedChannel, TextChannel } from 'discord.js'

export default {
  name: Events.GuildAvailable,
  once: false,
  async execute(guild: Guild) {
    const availableMessage: string =
      `This is a test message to check if the guild is available.` +
      `\nGuild Available: ${guild?.name} (${guild?.id})`

    const generalTextChannel: TextChannel | undefined =
      guild.channels.cache.find(
        (channel: GuildBasedChannel) =>
          channel.type === 0 && channel.name === 'general'
      ) as TextChannel | undefined

    await generalTextChannel?.send(`${availableMessage}.`)
  },
}
