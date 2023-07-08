#!/bin/bash

rm -rf /config/usharr.db
rm -rf ./apps/api/prisma/migrations
npm run db:migrate
npm run db:generate
