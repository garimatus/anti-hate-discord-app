import { env } from 'process'
import { z, ZodObject, type ZodSafeParseResult } from 'zod'
import ConfigurableI18n from './i18n/ConfigurableI18n'
import { log } from '../utils'

const configurableI18n = ConfigurableI18n
configurableI18n.setLocale(process.env.CLIENT_LOCALE || 'en')

const schema: ZodObject = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'local'])
    .optional()
    .default('development'),
  DISCORD_OAUTH2_TOKEN: z.string().min(1, 'DISCORD_OAUTH2_TOKEN is required'),
  DISCORD_CLIENT_ID: z.string().min(1, 'DISCORD_CLIENT_ID is required'),
  CASSIE_HOST: z.string().min(1, 'CASSIE_HOST is required'),
  CASSIE_PORT: z.string().min(1, 'CASSIE_PORT is required'),
  CASSIE_KEYSPACE: z.string().min(1, 'CASSIE_KEYSPACE is required'),
  OLLAMA_API_HOST: z.string().min(1, 'OLLAMA_API_HOST is required'),
  OLLAMA_API_PORT: z.string().min(1, 'OLLAMA_API_PORT is required'),
  OLLAMA_API_MODEL: z.string().min(1, 'OLLAMA_API_MODEL is required'),
  OLLAMA_API_MODEL_SESSION_ID: z
    .string()
    .min(1, 'OLLAMA_API_MODEL_SESSION_ID is required'),
  COMPOSE_PROJECT_NAME: z.string().optional(),
  CLIENT_LOCALE: z.string().optional(),
})

export function validateEnv(): Record<string, unknown> {
  const parsedSchema: ZodSafeParseResult<Record<string, unknown>> =
    schema.safeParse(
      env.NODE_ENV === 'production' ? env : { ...env, NODE_ENV: 'development' }
    )

  if (!parsedSchema.success) {
    log(
      configurableI18n.__('validate-env-error-1') +
        '\n' +
        parsedSchema.error.message,
      'error'
    )
    process.exit(1)
  }

  return parsedSchema.data
}

export { configurableI18n }
