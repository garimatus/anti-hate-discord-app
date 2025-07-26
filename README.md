### ENTORNO

1. Correr el cliente de [Ollama](https://github.com/ollama/ollama).
2. Asignar variable de entorno `export ENV_FILE="nombre archivo .env en el directorio raíz"` con el sgte. formato:

   ```
   DISCORD_OAUTH2_TOKEN=
   DISCORD_CLIENT_ID=
   CASSIE_HOST=
   CASSIE_PORT=
   CASSIE_KEYSPACE=
   OLLAMA_API_HOST=
   OLLAMA_API_PORT=
   OLLAMA_API_MODEL=
   OLLAMA_API_MODEL_SESSION_ID=
   COMPOSE_PROJECT_NAME=# opcional
   ```

3. Correr `docker compose up` en el directorio raíz.
