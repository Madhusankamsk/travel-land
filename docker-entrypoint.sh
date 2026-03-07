#!/bin/sh
set -e
# Wait for Postgres and run migrations
if [ -n "$DATABASE_URL" ]; then
  npx prisma migrate deploy
fi
exec "$@"
