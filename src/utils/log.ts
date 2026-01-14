import type { LogType } from '../types'
import { logger } from './logger'

export function log(message: string, logType?: LogType): void {
  if (typeof message === 'string' && message.length) {
    const logMessage: string = message.trimStart().trimEnd()
    let logColor: string | undefined = undefined

    if (logType === 'error') logColor = '\x1b[31m%s\x1b[0m'
    if (logType === 'success') logColor = '\x1b[32m%s\x1b[0m'
    if (logType === 'warning') logColor = '\x1b[33m%s\x1b[0m'
    if (logType === 'suggestion') logColor = '\x1b[34m%s\x1b[0m'
    if (logType === 'advice') logColor = '\x1b[35m%s\x1b[0m'

    logger.info(logColor, logMessage)
  } else {
    logger.error('\x1b[31m%s\x1b[0m', `Invalid message provided to logger.`)
  }
}
