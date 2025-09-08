FROM ollama/ollama:latest

RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y jq

COPY ./scripts/entrypoint.sh /root/.ollama/entrypoint.sh
RUN chmod +x /root/.ollama/entrypoint.sh

COPY ./scripts/healthcheck.sh /root/.ollama/healthcheck.sh
RUN chmod +x /root/.ollama/healthcheck.sh

ENTRYPOINT ["/root/.ollama/entrypoint.sh"]