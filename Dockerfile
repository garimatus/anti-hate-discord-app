FROM node:21.1.0 AS base

ENV APP_HOME="/home/anti-hate-discord-bot"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV ENV_FILE=".env.dev"
RUN corepack enable

RUN mkdir -p ${APP_HOME}
WORKDIR ${APP_HOME}
COPY . ${APP_HOME}

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY --from=build ${APP_HOME}/dist ${APP_HOME}/dist