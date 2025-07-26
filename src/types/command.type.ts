import { SlashCommandBuilder, SlashCommandOptionsOnlyBuilder } from 'discord.js'

type Command = {
  data: SlashCommandOptionsOnlyBuilder | SlashCommandBuilder
  execute: Promise<void>
}

export default Command
