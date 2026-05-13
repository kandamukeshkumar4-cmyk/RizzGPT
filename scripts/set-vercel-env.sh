#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# set-vercel-env.sh  —  Safely set ALL RizzGPT production env vars on Vercel
#
# CRITICAL: Use printf (NOT echo) when piping values to `vercel env add`.
#   echo "value" | vercel env add KEY  →  stores "value\n"  ❌ (trailing newline)
#   printf "value" | vercel env add KEY →  stores "value"   ✅
#
# A trailing \n in NVIDIA_API_KEY causes an invalid Authorization header,
# making every NVIDIA API call fail silently with a 500 error.
#
# Usage:
#   export VERCEL_TOKEN="vcp_xxx"
#   export NVIDIA_API_KEY="nvapi-xxx"
#   export SUPABASE_URL="https://xxx.supabase.co"
#   export SUPABASE_ANON_KEY="sb_publishable_xxx"
#   bash scripts/set-vercel-env.sh
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCOPE="${VERCEL_SCOPE:-kandasubbarao4-5462s-projects}"
TOKEN="${VERCEL_TOKEN:?Set VERCEL_TOKEN first}"
ENV="${VERCEL_ENV:-production}"

add() {
  local key="$1"
  local value="$2"
  # Remove existing (ignore error if not found)
  npx vercel env rm "$key" "$ENV" --yes \
    --token="$TOKEN" --scope="$SCOPE" 2>/dev/null || true
  # Add fresh — printf ensures NO trailing newline
  printf "%s" "$value" | npx vercel env add "$key" "$ENV" \
    --token="$TOKEN" --scope="$SCOPE"
  echo "  ✅  $key set"
}

echo "Setting $ENV env vars for scope: $SCOPE"

add "NVIDIA_API_KEY"              "${NVIDIA_API_KEY:?Set NVIDIA_API_KEY}"
add "NEXT_PUBLIC_SUPABASE_URL"    "${SUPABASE_URL:?Set SUPABASE_URL}"
add "NEXT_PUBLIC_SUPABASE_ANON_KEY" "${SUPABASE_ANON_KEY:?Set SUPABASE_ANON_KEY}"
add "DAILY_REQUEST_LIMIT"         "${DAILY_REQUEST_LIMIT:-50}"

echo ""
echo "All env vars set. Trigger a new deploy to pick them up:"
echo "  npx vercel deploy --prod --token=\$VERCEL_TOKEN --scope=$SCOPE"
