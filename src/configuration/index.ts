import { env } from 'process'
import { z, ZodObject, type ZodSafeParseResult } from 'zod'

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
})

export function validateEnv(): Record<string, unknown> {
  const parsedSchema: ZodSafeParseResult<Record<string, unknown>> =
    schema.safeParse(
      env.NODE_ENV === 'production' ? env : { ...env, NODE_ENV: 'development' }
    )

  if (!parsedSchema.success) {
    console.error(
      'Error at environment variables configuration:',
      parsedSchema.error.message
    )
    process.exit(1)
  }

  return parsedSchema.data
}

export { default as configurableI18n } from './i18n/ConfigurableI18n'
