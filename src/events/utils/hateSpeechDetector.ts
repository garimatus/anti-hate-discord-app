import { ChatResponse } from 'ollama'
import { ollamaClient } from '../../ollama/index.js'
import type HateSpeechResponse from '../../types/hate-speech-response.type.js'

export default async function (message: string): Promise<HateSpeechResponse> {
  const response: ChatResponse = await ollamaClient.generateChatResponse(
    {
      model: process.env.OLLAMA_API_MODEL || 'llama3.2',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    },
    'hate-speech-detection'
  )

  if (!response || !response.message || !response.message.content) {
    throw new Error('Failed to get a valid response from the Ollama API')
  }

  return JSON.parse(response.message.content) as HateSpeechResponse
}
