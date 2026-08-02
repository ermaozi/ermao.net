#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd "$(dirname "$0")" && pwd)
TOKEN_FILE="$ROOT_DIR/.cloudflare.env"
DATABASE_NAME="ermao_net"

SERVICE=${1:-}
if [[ $# -ne 1 || ! "$SERVICE" =~ ^(stats|ad-board|claude-env-check|all)$ ]]; then
  echo "Usage: $0 {stats|ad-board|claude-env-check|all}" >&2
  exit 1
fi

if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required." >&2
  exit 1
fi

if [[ ! -f "$TOKEN_FILE" ]]; then
  echo "Missing $TOKEN_FILE. Copy .cloudflare.env.example and add your token." >&2
  exit 1
fi

CLOUDFLARE_API_TOKEN=""
while IFS= read -r line; do
  case "$line" in
    CLOUDFLARE_API_TOKEN=*)
      CLOUDFLARE_API_TOKEN=${line#*=}
      CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN%$'\r'}
      break
      ;;
  esac
done < "$TOKEN_FILE"

if [[ -z "$CLOUDFLARE_API_TOKEN" ]]; then
  echo "CLOUDFLARE_API_TOKEN is empty in $TOKEN_FILE." >&2
  exit 1
fi
export CLOUDFLARE_API_TOKEN

cd "$ROOT_DIR"
WRANGLER=(pnpm exec wrangler)

deploy_service() {
  local service=$1
  local config="$service/wrangler.toml"

  echo "Validating $service..."
  "${WRANGLER[@]}" deploy --config "$config" --dry-run --strict

  case "$service" in
    stats)
      "${WRANGLER[@]}" d1 execute "$DATABASE_NAME" --config "$config" --remote --yes --file stats/schema.sql
      local backfill_status
      backfill_status=$("${WRANGLER[@]}" d1 execute "$DATABASE_NAME" --config "$config" --remote --command \
        "SELECT CASE WHEN COUNT(*) < 366 THEN 1 ELSE 0 END AS needed FROM daily_stats WHERE date >= date('now', '-366 days') AND date < date('now') AND type = 'total' AND name = 'total'" --json)
      if grep -Eq '"needed":[[:space:]]*1' <<< "$backfill_status"; then
        "${WRANGLER[@]}" d1 execute "$DATABASE_NAME" --config "$config" --remote --yes --file stats/backfill_daily_stats.sql
      elif grep -Eq '"needed":[[:space:]]*0' <<< "$backfill_status"; then
        echo "Daily stats already cover the last 366 completed days; skipping backfill."
      else
        echo "Could not determine whether daily stats need backfilling." >&2
        exit 1
      fi
      ;;
    ad-board)
      "${WRANGLER[@]}" d1 execute "$DATABASE_NAME" --config "$config" --remote --yes --file ad-board/schema.sql
      ;;
  esac

  echo "Deploying $service..."
  "${WRANGLER[@]}" deploy --config "$config" --strict --keep-vars
}

"${WRANGLER[@]}" --version
"${WRANGLER[@]}" whoami

if [[ "$SERVICE" == "all" ]]; then
  for service in stats ad-board claude-env-check; do
    deploy_service "$service"
  done
else
  deploy_service "$SERVICE"
fi
