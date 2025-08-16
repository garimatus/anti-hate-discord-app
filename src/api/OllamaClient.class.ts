import {
  Ollama,
  type ChatRequest,
  type ChatResponse,
  type Message,
} from 'ollama'

export class OllamaClient extends Ollama {
  private static instance: OllamaClient
  private _sessions: Record<string, Message[]> = { 'default-session': [] }

  private constructor() {
    super({
      host:
        `${process.env.OLLAMA_API_HOST}:${process.env.OLLAMA_API_PORT}` ||
        'http://localhost:11434',
    })
  }

  public static getInstance(): OllamaClient {
    if (!OllamaClient.instance) {
      OllamaClient.instance = new OllamaClient()
    }
    return OllamaClient.instance
  }

  public set session(session: Record<string, Message[]>) {
    this._sessions = session
  }
  public getSessionById(sessionId: string): Message[] | undefined {
    return this._sessions[sessionId]
  }

  public get sessions(): Record<string, Message[]> {
    return this._sessions
  }

  public async generateChatResponse(
    chatRequest: ChatRequest,
    sessionId?: string
  ): Promise<ChatResponse> {
    return await this.chat({
      model: process.env.OLLAMA_API_MODEL || chatRequest.model,
      messages: [
        ...this._sessions[sessionId || 'default-session'],
        ...chatRequest.messages!!,
      ],
    })
  }
}

export default OllamaClient.getInstance()
