import fs from 'node:fs'
import type { ChatRequest, ChatResponse } from 'ollama'
import { OllamaClientInstance } from '../api'

export async function initializeOllamaSession(
  sessionId?: string
): Promise<void> {
  const contextChatRequest: ChatRequest = {
    model: process.env.OLLAMA_API_MODEL ?? 'gemma3:1b',
    messages: [
      {
        role: 'user',
        content: fs
          .readFileSync(new URL('./prompts/context', import.meta.url), 'utf-8')
          .toString(),
      },
    ],
  }

  OllamaClientInstance.session = {
    ...OllamaClientInstance.session,
    [sessionId ?? 'default-session']: [...contextChatRequest.messages!!],
  }

  const response: ChatResponse =
    await OllamaClientInstance.generateChatResponse(
      contextChatRequest,
      sessionId
    )
  if (!response || response.message.content.trim() !== 'OK') {
    throw new Error(
      'Failed to initialize the Ollama API Client with given context'
    )
  }

  OllamaClientInstance.session = {
    ...OllamaClientInstance.session,
    [sessionId ?? 'default-session']: [
      response.message,
      { role: response.message.role, content: response.message.content },
    ],
  }
}
