import { validateEnv } from './configuration'
import { Client, GatewayIntentBits } from 'discord.js'
import { setUpEvents, setUpCommands } from './utils'
import { initializeOllamaSession } from './ollama'
import type { CommandCapableClient } from './interfaces'

const config: Record<string, unknown> = validateEnv()

await initializeOllamaSession('messages-analysis')

const client: Client<boolean> = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildPresences,
  ],
})

setUpEvents(client as CommandCapableClient)
setUpCommands(client as CommandCapableClient)

client.login(config.DISCORD_OAUTH2_TOKEN as string)
