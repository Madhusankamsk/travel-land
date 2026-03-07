#!/bin/sh
set -e
# Wait for Postgres and run migrations
if [ -n "$DATABASE_URL" ]; then
  npx prisma migrate deploy
fi
# Ensure uploads dir exists and is writable by nextjs (for volume mount)
if [ -d /app/public/uploads ]; then
  mkdir -p /app/public/uploads/tours
  chown -R nextjs:nodejs /app/public/uploads
fi
exec su-exec nextjs "$@"
