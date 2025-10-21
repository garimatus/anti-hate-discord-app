import type { ChatResponse } from 'ollama'
import { OllamaClientInstance } from '../../api'
import type { MessageAnalysisResponse } from '../../types'

export async function analyzeMessage(
  message: string
): Promise<MessageAnalysisResponse> {
  try {
    const response: ChatResponse =
      await OllamaClientInstance.generateChatResponse(
        {
          model: process.env.OLLAMA_API_MODEL ?? 'gemma3:1b',
          messages: [
            {
              role: 'user',
              content: message,
            },
          ],
        },
        'messages-analysis'
      )
    if (!response || !response.message || !response.message.content)
      throw new Error('Failed to get a valid response from the Ollama API')
    return JSON.parse(response.message.content) as MessageAnalysisResponse
  } catch (error: any) {
    console.error('Error analyzing message:', error)
    return {
      result: undefined,
      motive: error.message ?? error ?? 'Unknown error',
    }
  }
}
