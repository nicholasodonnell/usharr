FROM node:22-bookworm-slim AS base

# default environment variables
ENV \
  DEBIAN_FRONTEND=noninteractive \
  TZ=UTC

RUN \
  # add dependencies
  apt-get update \
  && apt-get install -y \
    openssl \
    procps \
    tzdata \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/* \
  # create our own user and remove the node user
  && groupadd --gid 1001 app \
  && useradd --create-home --home /app --shell /bin/bash --gid 1001 --uid 1001 app \
  && userdel -r node \
  # create the config directory
  && mkdir /config && chown app:app /config \
  # install the latest version of npm
  && npm install -g npm@latest \
  # create the node_modules directory, make it owned by app user
  && mkdir -p /app/node_modules && chown app:app /app/node_modules

USER app

WORKDIR /app

COPY --chown=app:app ./scripts/entrypoint.sh .

ENTRYPOINT [ "/app/entrypoint.sh" ]

##############################

FROM base AS development

ENV NODE_ENV=development

COPY --chown=app:app package*.json ./
COPY --chown=app:app apps/api/package*.json ./apps/api/
COPY --chown=app:app apps/client/package*.json ./apps/client/
COPY --chown=app:app packages/eslint-config-custom/package*.json ./packages/eslint-config-custom/
COPY --chown=app:app packages/types/package*.json ./packages/types/

RUN npm ci && npm cache clean --force

COPY --chown=app:app apps/api/prisma ./apps/api/prisma

RUN npm run db:generate

EXPOSE 3000
EXPOSE 3001

CMD [ "npm", "run", "dev" ]

##############################

FROM development AS build

ENV NODE_ENV=production

COPY --chown=app:app . ./

RUN npm run build

##############################

FROM base AS production

ENV NODE_ENV=production

COPY --from=build --chown=app:app /app/node_modules ./node_modules
COPY --from=build --chown=app:app /app/apps/api/dist ./dist
COPY --from=build --chown=app:app /app/apps/client/dist ./public
COPY --from=build --chown=app:app /app/apps/api/prisma ./prisma

EXPOSE 5588

CMD [ "node", "/app/dist/main.js" ]
