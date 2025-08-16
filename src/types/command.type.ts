import {
  SlashCommandBuilder,
  type SlashCommandOptionsOnlyBuilder,
  type Interaction,
} from 'discord.js'

export type Command = {
  data: SlashCommandOptionsOnlyBuilder | SlashCommandBuilder
  execute: (interaction: Interaction) => Promise<void>
}
