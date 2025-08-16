import { validateEnv } from './configuration/index.js'
import { Client, GatewayIntentBits } from 'discord.js'
import { eventSetter, commandSetter } from './utils'
import { initializeOllamaSession } from './ollama'
import type { CommandCapableClient } from './interfaces'

const config: Record<string, unknown> = validateEnv()

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

eventSetter(client as CommandCapableClient)
commandSetter(client as CommandCapableClient)

client.login(config.DISCORD_OAUTH2_TOKEN as string)
