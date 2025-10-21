# Discord Bot for Real-Time Hate Speech Detection using Ollama

Discord bot for user monitoring and management with Ollama-based, LLM-agnostic hate speech detection.

## Installation and environment

0. **[OPTIONAL]** Run the [Ollama](https://github.com/ollama/ollama) client on the Docker hosting machine.
1. Assign the "NODE_ENV" environment variable as following `export NODE_ENV="development/production/local"` with the following format:

   ```env
   NODE_ENV=
   DISCORD_OAUTH2_TOKEN=
   DISCORD_CLIENT_ID=
   CASSIE_HOST=
   CASSIE_PORT=
   CASSIE_KEYSPACE=
   OLLAMA_API_HOST=
   OLLAMA_API_PORT=
   OLLAMA_API_MODEL=
   OLLAMA_API_MODEL_SESSION_ID=
   COMPOSE_PROJECT_NAME=# optional
   ```

    1.1 ENV_FILE values respectively by NODE_ENV value given:

    | NODE_ENV    | ENV_FILE   |
    |-------------|------------|
    | production  | .env       |
    | development | .env.dev   |
    | test        | .env.dev   |
    | "any"       | .env.local |

    1.2 Assign `ANALYSIS_MODEL` environment variable to be pulled with the Ollama API service container initialization. If not it will be set as default that's "gemma3:1b".
2. Run `docker compose up` at root directory.

    3.1 Optionally assign the `ANALYZE_MESSAGE_SUCCESS_RATIO` environment variable with a decimal number between 0 and 1 to adjust the analysis success ratio (default is `0.95` = 95%). IMPORTANT: this will determinate the application build outcome and depends entirely and directly on the ratio and model used.
