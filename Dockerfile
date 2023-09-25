FROM node:latest

RUN mkdir -p /home/anti-hate-discord-bot

WORKDIR /home/anti-hate-discord-bot

COPY . /home/anti-hate-discord-bot

RUN (apt-get update | apt-get upgrade) && npm install