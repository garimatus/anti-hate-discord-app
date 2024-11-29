import fs from 'node:fs'
import antiHateBotLogger from '../../utils/logger.js'
const { pathname: path } = new URL('../queries', import.meta.url)

export default async function () {
  const queries = {}

  try {
    const queriesFiles = fs
      .readdirSync(path)
      .filter((file) => file.endsWith('.cql'))

    for (const file of queriesFiles) {
      // Set a new item in the Collection with the key as the command name and the value as the exported module
      const query = fs
        .readFileSync((await import('node:path')).join(path, file))
        .toString()

      const queryName = file
        .split('.')[0]
        .toLowerCase()
        .split('-')
        .reduce(
          (prev, curr) => prev + (curr.charAt(0).toUpperCase() + curr.slice(1))
        )

      if (query && queryName.match(/(^[a-z]|[A-Z0-9])[a-z]*/g).length) {
        queries[queryName] = query
      } else {
        antiHateBotLogger(
          'yellow',
          `[WARNING] The query at ${path + '/' + file} could not be added.`
        )
      }
    }

    return queries
  } catch (error) {
    antiHateBotLogger(
      'red',
      `[ERROR] An error has ocurred while trying to collect all command files: ${error}`
    )
  }
}
