import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js'

export type Command = {
  data: SlashCommandOptionsOnlyBuilder | SlashCommandBuilder
  execute: Promise<void>
}
