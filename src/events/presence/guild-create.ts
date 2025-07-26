import { Events, Guild, GuildBasedChannel } from 'discord.js'
import { mapping } from 'cassandra-driver'

export default {
  name: Events.GuildCreate,
  once: true,
  async execute(guild: Guild, mapper: mapping.ModelMapper) {
    if (guild) {
      const guildResult: Guild = await mapper.get({
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

      const generalTextChannel: GuildBasedChannel | undefined =
        guild.channels.cache
          .filter((channel: GuildBasedChannel) => {
            if (channel.type == 0 && channel.name == 'general') {
              return channel
            }
          })
          .first()

      if (generalTextChannel?.isSendable()) {
        await generalTextChannel.send(`"Some welcoming message."`)
      }
    }
  },
}
