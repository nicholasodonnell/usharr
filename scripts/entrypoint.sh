#!/bin/bash

if [ "$NODE_ENV" = "production" ]; then
  npx prisma migrate deploy
else
  npm run db:push
fi

exec "$@"
