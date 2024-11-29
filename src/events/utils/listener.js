import { Events } from 'discord.js'

export default function (event, mapper) {
  if (event.name === Events.MessageCreate) {
    return (...args) => event.execute(...args, mapper)
  } else {
    return (...args) => event.execute(...args, mapper)
  }
}
