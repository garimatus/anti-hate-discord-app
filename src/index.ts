import { validateEnv } from './configuration/index.js'
import { Client, GatewayIntentBits } from 'discord.js'
import { setClientEvents } from './events/index.js'
import { setClientCommands } from './commands/index.js'
import { initializeOllamaSession } from './ollama/index.js'
import { CommandCapableClient } from './intefaces/command-capable-client.interface.js'

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

setClientEvents(client as CommandCapableClient)
setClientCommands(client as CommandCapableClient)

client.login(config.DISCORD_OAUTH2_TOKEN as string)
