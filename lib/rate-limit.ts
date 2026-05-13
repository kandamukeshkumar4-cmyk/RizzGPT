import { createClient } from '@/lib/supabase/server';
import type { Feature, UsageSummary } from '@/types';

const DAILY_LIMIT = parseInt(process.env.DAILY_REQUEST_LIMIT ?? '50', 10);

/**
 * Check if the user has remaining quota for today.
 * Throws a RateLimitError if the daily limit has been reached.
 * Returns the current usage summary on success.
 */
export async function checkAndIncrementUsage(
  userId: string,
  feature: Feature,
  model: string
): Promise<UsageSummary> {
  const supabase = await createClient();

  // Count how many requests the user has made today (UTC day boundary)
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const { count, error: countError } = await supabase
    .from('usage_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfToday.toISOString());

  if (countError) {
    console.error('Usage count error:', countError);
    // Fail open — don't block the user if DB has an issue
    return buildSummary(0);
  }

  const used = count ?? 0;

  if (used >= DAILY_LIMIT) {
    throw new RateLimitError(used, DAILY_LIMIT);
  }

  // Log the usage
  const { error: insertError } = await supabase.from('usage_log').insert({
    user_id: userId,
    feature,
    model_used: model,
  });

  if (insertError) {
    console.error('Usage insert error:', insertError);
  }

  return buildSummary(used + 1);
}

/** Fetch usage summary without incrementing (for the UI badge) */
export async function getUsageSummary(userId: string): Promise<UsageSummary> {
  const supabase = await createClient();

  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const { count } = await supabase
    .from('usage_log')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .gte('created_at', startOfToday.toISOString());

  return buildSummary(count ?? 0);
}

function buildSummary(used: number): UsageSummary {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  return {
    used,
    limit: DAILY_LIMIT,
    remaining: Math.max(0, DAILY_LIMIT - used),
    resetsAt: tomorrow.toISOString(),
  };
}

export class RateLimitError extends Error {
  public readonly used: number;
  public readonly limit: number;

  constructor(used: number, limit: number) {
    super(`Daily limit of ${limit} requests reached. Resets at midnight UTC.`);
    this.name = 'RateLimitError';
    this.used = used;
    this.limit = limit;
  }
}
