/**
 * GET /api/usage
 * Returns the current user's daily usage summary (for the UI badge).
 */
import { NextResponse }  from 'next/server';
import { createClient }  from '@/lib/supabase/server';
import { getUsageSummary } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const usage = await getUsageSummary(user.id);
    return NextResponse.json(usage);

  } catch (err) {
    console.error('[/api/usage]', err);
    return NextResponse.json({ error: 'Failed to fetch usage' }, { status: 500 });
  }
}
