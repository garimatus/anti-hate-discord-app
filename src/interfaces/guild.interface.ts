import type { Guild, Locale } from 'discord.js'

export interface GuildInterface
  extends Omit<
    Guild,
    'guild_id' | 'command_prefix' | 'warnings_allowed' | 'bans'
  > {
  guild_id: bigint
  command_prefix: string[1]
  warnings_allowed: number
  bans: bigint
  locale: Locale
}
