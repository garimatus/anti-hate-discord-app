# Anti Hate Speech Discord App with AI detection using Ollama

Discord user monitoring and management bot project that integrates Ollama for LLM-agnostic use to detect hate speech in text channel messages.

## Installation and environment

1. Run the [Ollama](https://github.com/ollama/ollama) client on the Docker hosting machine. (WIP: Dockerize an Ollama instance into the project)
2. Assign the environment variable 'NODE_ENV' as following `export NODE_ENV="development or production or local"` with the following format:

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

    2.1 ENV_FILE values:

    | NODE_ENV | ENV_FILE |
    |----------|----------|
    | production | .env |
    | development  | .env.dev  |
    | any other | .env.local  |

3. Run `docker compose up` at root directory.
