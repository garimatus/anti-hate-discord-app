import { mapping } from 'cassandra-driver'
import type { Event } from '../../types'
import type { HateSpeechResponse } from '../../types'

export function listener(
  event: Event,
  mapper?: mapping.ModelMapper,
  hateSpeechDetector?: (message: string) => Promise<HateSpeechResponse>
) {
  return (...args: any[]) => event.execute(...args, mapper, hateSpeechDetector)
}
