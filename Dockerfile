FROM node:21.1.0 AS base

ENV APP_HOME="/home/anti-hate-discord-app"
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN mkdir -p ${APP_HOME}
WORKDIR ${APP_HOME}
COPY . ${APP_HOME}

RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base AS build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile
RUN pnpm build

FROM base

COPY --from=build ${APP_HOME}/node_modules ${APP_HOME}/node_modules
COPY --from=build ${APP_HOME}/dist ${APP_HOME}/dist

CMD ["sh", "-c", "pnpm run deploy"]
