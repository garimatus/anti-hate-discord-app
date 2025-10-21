import { Client, Guild, Message } from 'discord.js'
import { mapping } from 'cassandra-driver'
import type { Event } from '../../types'
import type { MessageAnalysisResponse } from '../../types'
import type { ConfigurableI18n } from '../../configuration/i18n/ConfigurableI18n'

export function eventListener(
  event: Event,
  modelMapper: mapping.ModelMapper,
  configurableI18n: ConfigurableI18n,
  detector?: (message: string) => Promise<MessageAnalysisResponse>
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
        (await modelMapper?.get({ guild_id: guildId }))?.locale ?? 'en'
      )
    }
    event.execute(entity, modelMapper, configurableI18n, detector)
  }
}
