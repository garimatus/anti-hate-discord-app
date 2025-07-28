import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  Interaction,
} from 'discord.js'

export type Command = {
  data: SlashCommandOptionsOnlyBuilder | SlashCommandBuilder
  execute: (interaction: Interaction) => Promise<void>
}
