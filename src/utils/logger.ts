import type { Color } from '../types'

export function logger(message: string, color?: Color): void {
  if (message && message.length > 0) {
    const logMessage: string = message.trimStart().trimEnd()
    let logColor: string | undefined = undefined

    if (color === 'black') logColor = '\x1b[30m%s\x1b[0m'
    if (color === 'red') logColor = '\x1b[31m%s\x1b[0m'
    if (color === 'green') logColor = '\x1b[32m%s\x1b[0m'
    if (color === 'yellow') logColor = '\x1b[33m%s\x1b[0m'
    if (color === 'blue') logColor = '\x1b[34m%s\x1b[0m'
    if (color === 'magenta') logColor = '\x1b[35m%s\x1b[0m'
    if (color === 'cyan') logColor = '\x1b[36m%s\x1b[0m'
    if (color === 'white') logColor = '\x1b[37m%s\x1b[0m'
    if (color === 'gray') logColor = '\x1b[90m%s\x1b[0m'

    const logLocale: string = new Date(Date.now()).toLocaleString()
    console.log(`[${logLocale}] ${logColor ?? ''}`.trim(), logMessage)
  } else {
    console.error(
      `\x1b[31m[${new Date(Date.now()).toLocaleString()}] Invalid message provided to logger.\x1b[0m`
    )
  }
}
