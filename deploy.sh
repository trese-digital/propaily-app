#!/bin/bash
# /opt/propaily/deploy.sh — pull, build y restart en un solo paso.
# Uso: ssh deploy@177.7.40.42 → cd /opt/propaily → ./deploy.sh
set -e

APP_DIR="/opt/propaily"
cd "$APP_DIR"

echo "▶ [$(date '+%H:%M:%S')] Trayendo cambios de GitHub…"
PREV_HEAD=$(git rev-parse HEAD)
git pull --ff-only
NEW_HEAD=$(git rev-parse HEAD)

if [ "$PREV_HEAD" = "$NEW_HEAD" ]; then
  echo "  (sin commits nuevos — voy a rebuildar igual por si cambió .env o config)"
else
  echo "  Commits aplicados:"
  git --no-pager log --oneline "$PREV_HEAD..$NEW_HEAD"
fi

# Solo reinstalar deps si cambió package-lock.json
if ! git diff --quiet "$PREV_HEAD" "$NEW_HEAD" -- package-lock.json 2>/dev/null; then
  echo "▶ [$(date '+%H:%M:%S')] package-lock.json cambió, npm ci…"
  npm ci
else
  echo "▶ [$(date '+%H:%M:%S')] package-lock.json sin cambios, salto npm ci"
fi

# Cargar .env para prisma generate / build
set -a
source .env
set +a

echo "▶ [$(date '+%H:%M:%S')] prisma generate…"
npx prisma generate >/dev/null

# Si hay migraciones nuevas, aplicarlas
if ! git diff --quiet "$PREV_HEAD" "$NEW_HEAD" -- prisma/migrations 2>/dev/null; then
  echo "▶ [$(date '+%H:%M:%S')] Hay migraciones nuevas, aplicando…"
  npx prisma migrate deploy
fi

echo "▶ [$(date '+%H:%M:%S')] next build…"
npm run build 2>&1 | tail -5

echo "▶ [$(date '+%H:%M:%S')] Copiando standalone deps…"
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/

echo "▶ [$(date '+%H:%M:%S')] Restart PM2…"
pm2 restart propaily --update-env >/dev/null
sleep 3

echo "▶ [$(date '+%H:%M:%S')] Health check…"
if curl -fsS https://propaily.com/api/health >/dev/null; then
  echo "✅ Deploy OK ($NEW_HEAD)"
else
  echo "❌ Health check falló — revisa logs: pm2 logs propaily --lines 50"
  exit 1
fi
