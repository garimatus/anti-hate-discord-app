import { Client, GatewayIntentBits } from 'discord.js'
import { setClientEvents } from './events/index.js'
import { setClientCommands } from './commands/index.js'
import { initializeOllamaSession } from './ollama/index.js'

const DISCORD_OAUTH2_TOKEN: string | undefined =
  process.env.DISCORD_OAUTH2_TOKEN

if (!DISCORD_OAUTH2_TOKEN) {
  throw new Error('DISCORD_OAUTH2_TOKEN is not set')
}

await initializeOllamaSession()

const client: Client<boolean> = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
})

setClientEvents(client)
setClientCommands(client)

client.login(DISCORD_OAUTH2_TOKEN)
