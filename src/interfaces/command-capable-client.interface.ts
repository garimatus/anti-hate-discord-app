import { Client, Collection } from 'discord.js'
import type { Command } from '../types'

export interface CommandCapableClient extends Client {
  commands: Collection<string, Command>
}
