import { Client, Collection } from 'discord.js'
import { Command } from '../types/command.type.js'

export interface CommandCapableClient extends Client {
  commands: Collection<string, Command>
}
