import {
  Ollama,
  type ChatRequest,
  type ChatResponse,
  type Message,
} from 'ollama'

export class OllamaClient extends Ollama {
  private static instance: OllamaClient
  private _model: string = process.env.OLLAMA_API_MODEL ?? 'gemma3:1b'
  private _sessions: Record<string, Message[]> = { 'default-session': [] }
  private constructor() {
    super({
      host: `${process.env.OLLAMA_API_HOST ?? 'localhost'}:${process.env.OLLAMA_API_PORT ?? '11434'}`,
    })
  }

  public static getInstance(): OllamaClient {
    if (!OllamaClient.instance) {
      OllamaClient.instance = new OllamaClient()
    }
    return OllamaClient.instance
  }

  public set session(session: Record<string, Message[]>) {
    const sessionId: string = Object.keys(session)[0]
    if (!this.getSession(sessionId)) {
      this._sessions[sessionId] = [...session[sessionId].values()]
      return
    }
    this._sessions[sessionId].push(
      ...(Object.entries(session).at(0)?.[1] ?? [])
    )
  }

  public getSession(sessionId: string): Message[] | undefined {
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
      model: this._model,
      messages: [
        ...(this._sessions['tests-session'] ??
          (sessionId ? this._sessions[sessionId] : undefined) ??
          this._sessions['default-session'] ??
          []),
        ...chatRequest.messages!!,
      ],
    })
  }
}

export default OllamaClient.getInstance()
