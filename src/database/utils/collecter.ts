import fs from 'node:fs'
import { logger } from '../../utils'

const { pathname: path }: { pathname: string } = new URL(
  '../queries',
  import.meta.url
)

export async function collecter(): Promise<Object> {
  const queries: Object = {}

  try {
    const queriesFiles: string[] = fs
      .readdirSync(path)
      .filter((file) => file.endsWith('.cql'))

    if (queriesFiles.length > 0) {
      for (const file of queriesFiles) {
        const query: string = fs
          .readFileSync((await import('node:path')).join(path, file))
          .toString()

        const queryName: string = file
          .split('.')[0]
          .toLowerCase()
          .split('-')
          .reduce(
            (prev, curr) =>
              prev + (curr.charAt(0).toUpperCase() + curr.slice(1))
          )
        if (queryName.match(/(^[a-z]|[A-Z0-9])[a-z]*/g)?.length) {
          // @ts-ignore
          queries[queryName] = query
        } else {
          logger(
            `[WARNING] The query at ${path + '/' + file} could not be added.`,
            'yellow'
          )
        }
      }
    } else {
      throw new Error(
        `No query (.cql) files were found in the ${path} directory.`
      )
    }
  } catch (error: any) {
    logger(
      `[ERROR] An error has ocurred while trying to collect all query (.cql) files: ${error}`,
      'red'
    )
  }

  return queries
}
