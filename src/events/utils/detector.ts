import type { ChatResponse } from 'ollama'
import { ollamaClient } from '../../ollama'
import type { HateSpeechResponse } from '../../types'

export async function detector(message: string): Promise<HateSpeechResponse> {
  try {
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
  } catch (error: any) {
    console.error('Error in hate speech detection:', error)
    return { result: false } as HateSpeechResponse
  }
}
