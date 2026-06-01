#!/usr/bin/env bash
#
# Dev runner for TasteMatch — starts the Go API and the Next.js UI together.
#
# Usage:
#   ./run.sh                 # API on :8787, UI on :3000
#   UI_PORT=3001 ./run.sh    # custom UI port
#   PORT=9000 ./run.sh       # custom API port
#
# Ctrl+C stops both.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_PORT="${PORT:-8787}"
UI_PORT="${UI_PORT:-3000}"

cleanup() {
  echo ""
  echo "🛑 Stopping TasteMatch..."
  # Kill every process in this script's process group.
  kill 0 2>/dev/null || true
}
trap cleanup EXIT INT TERM

command -v go >/dev/null 2>&1 || { echo "❌ Go is not installed (needed for the API)."; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is not installed (needed for the UI)."; exit 1; }

# ── API (Go WebSocket server) ─────────────────────────────────────────
echo "🍜 Starting Go API on :$API_PORT"
(
  cd "$ROOT/api"
  [ -f go.sum ] || go mod tidy          # go.sum is gitignored; create it on first run
  PORT="$API_PORT" go run main.go
) &

# ── UI (Next.js) ──────────────────────────────────────────────────────
echo "🎨 Starting UI on http://localhost:$UI_PORT"
(
  cd "$ROOT/ui"
  [ -d node_modules ] || npm install     # install deps on first run
  npm run dev -- -p "$UI_PORT"
) &

echo ""
echo "✅ TasteMatch is starting — open http://localhost:$UI_PORT (Ctrl+C to stop)"
echo ""

wait
