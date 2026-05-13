import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client.
 * Safe to use in client components — uses the anon (publishable) key
 * which is protected by Row Level Security policies.
 *
 * Note: NEXT_PUBLIC_ vars are baked into the client bundle at build time
 * by Next.js, so we trim() here directly (lib/env.ts is server-only).
 */
export function createClient() {
  return createBrowserClient(
    (process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '').trim(),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim()
  );
}
