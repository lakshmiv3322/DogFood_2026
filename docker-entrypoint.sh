#!/bin/sh
set -e

echo "⏳  Waiting for database connection..."
until npx prisma db push --skip-generate --accept-data-loss; do
  echo "Database is starting up, retrying in 2s..."
  sleep 2
done

echo "🌱  Seeding fixtures..."
npx tsx src/scripts/seed.ts || true

echo "🚀  Starting Next.js..."
exec node server.js
