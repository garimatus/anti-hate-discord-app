import fs from 'node:fs'
import type { ChatRequest, ChatResponse } from 'ollama'
import OllamaClientInstance, {
  type OllamaClient,
} from '../api/OllamaClient.class.js'

export const ollamaClient: OllamaClient = OllamaClientInstance

export async function initializeOllamaSession(): Promise<void> {
  const contextRequest: ChatRequest = {
    model: process.env.OLLAMA_API_MODEL || 'llama3.2',
    messages: [
      {
        role: 'user',
        content: fs
          .readFileSync(new URL('./prompts/context', import.meta.url))
          .toString(),
      },
    ],
  }

  const response: ChatResponse =
    await ollamaClient.generateChatResponse(contextRequest)

  if (!response || response.message.content !== 'OK') {
    throw new Error(
      'Failed to initialize the Ollama API Client with given context'
    )
  }

  ollamaClient.session = {
    [process.env.OLLAMA_API_MODEL_SESSION_ID || 'hate-speech-detection']: [
      // @ts-ignore
      ...contextRequest.messages,
      { role: response.message.role, content: response.message.content },
    ],
  }
}
