#!/bin/sh
set -e

echo "⏳  Waiting for database…"
until npx prisma db push --skip-generate 2>&1 | grep -q "Your database is now in sync"; do
  sleep 2
done

echo "🌱  Seeding fixtures…"
node -e "
const { execSync } = require('child_process');
execSync('npx tsx src/scripts/seed.ts', { stdio: 'inherit' });
" 2>&1 || node src/scripts/seed.js 2>&1 || true

echo "🚀  Starting Next.js…"
exec node server.js
