import fs from 'node:fs'
import { log } from '../../utils'

const { pathname: path }: { pathname: string } = new URL(
  '../queries',
  import.meta.url
)

export async function collectQueries(): Promise<Record<string, string>> {
  const queries: Record<string, string> = {}

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
          log(
            `The query at ${path + '/' + file} could not be added.`,
            'warning'
          )
        }
      }
    } else {
      throw new Error(
        `No query (.cql) files were found in the ${path} directory.`
      )
    }
  } catch (error: any) {
    log(
      `[ERROR] An error has ocurred while trying to collect all query (.cql) files: ${error}`,
      'error'
    )
  }

  return queries
}
