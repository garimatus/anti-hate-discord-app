# Anti Hate Speech Discord Bot App with real time AI detection using Ollama

Discord user monitoring and management bot project that integrates Ollama for LLM-agnostic use to detect hate speech in text channel messages.

## Installation and environment

1. Run the [Ollama](https://github.com/ollama/ollama) client on the Docker hosting machine.
2. Assign the "NODE_ENV" environment variable as following `export NODE_ENV="development or production or local"` with the following format:

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

    2.1 ENV_FILE values respectively by NODE_ENV value given:

    | NODE_ENV    | ENV_FILE   |
    |-------------|------------|
    | production  | .env       |
    | development | .env.dev   |
    | any other   | .env.local |

    2.2 Assign "DETECTION_MODEL" environment variable to be pulled with the Ollama API service container initialization. If not it will be set as default that's "gemma3:1b".
3. Run `docker compose up` at root directory.
