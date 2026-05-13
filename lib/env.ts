/**
 * Central environment variable reader.
 *
 * WHY THIS EXISTS:
 * When env vars are piped into `vercel env add` via shell commands like
 *   echo "value" | vercel env add KEY production
 * the shell appends a newline, so the stored value becomes "value\n".
 * Node.js reads that verbatim, causing Authorization headers to contain
 * newlines — which HTTP clients reject with a cryptic error.
 *
 * Every var is .trim()-ed here so trailing whitespace/newlines never reach
 * any HTTP client, regardless of how the vars were originally set.
 *
 * USAGE: import { env } from '@/lib/env' — never read process.env directly.
 */

function get(key: string, fallback?: string): string {
  const raw = process.env[key];
  if (raw === undefined || raw.trim() === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return raw.trim();
}

export const env = {
  // ── NVIDIA NIM ──────────────────────────────────────────────────────────────
  /** Server-side only — never expose to the browser */
  NVIDIA_API_KEY: () => get('NVIDIA_API_KEY', 'key-not-set'),

  // ── Supabase ─────────────────────────────────────────────────────────────────
  SUPABASE_URL:      () => get('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: () => get('NEXT_PUBLIC_SUPABASE_ANON_KEY'),

  // ── App config ───────────────────────────────────────────────────────────────
  DAILY_REQUEST_LIMIT: () => parseInt(get('DAILY_REQUEST_LIMIT', '50'), 10),
} as const;
