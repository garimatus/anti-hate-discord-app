import { Client, Guild, Message } from 'discord.js'
import { mapping } from 'cassandra-driver'
import type { Event } from '../../types'
import type { HateSpeechResponse } from '../../types'
import type { ConfigurableI18n } from '../../configuration/i18n/ConfigurableI18n'

export function listener(
  event: Event,
  mapper: mapping.ModelMapper,
  configurableI18n: ConfigurableI18n,
  detector?: (message: string) => Promise<HateSpeechResponse>
) {
  return async (entity: Client | Guild | Message) => {
    const guildId: string | null | undefined =
      entity instanceof Guild
        ? entity.id
        : entity instanceof Message
          ? entity.guildId
          : undefined
    if (guildId) {
      configurableI18n?.setLocale(
        (await mapper?.get({ guild_id: guildId }))?.locale ?? 'en'
      )
    }
    event.execute(entity, mapper, configurableI18n, detector)
  }
}
