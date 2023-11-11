FROM node:latest

RUN mkdir -p /home/anti-hate-discord-bot

WORKDIR /home/anti-hate-discord-bot

COPY . /home/anti-hate-discord-bot

CMD ["npm install"]