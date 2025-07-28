import { mapping } from 'cassandra-driver'
import Event from '../../types/event.type.js'
import HateSpeechResponse from '../../types/hate-speech-response.type.js'

export default function (
  event: Event,
  mapper?: mapping.ModelMapper,
  hateSpeechDetector?: (message: string) => Promise<HateSpeechResponse>
) {
  return (...args: any[]) => event.execute(...args, mapper, hateSpeechDetector)
}
