/**
 * POST /api/profile-writer
 * Generates 6 dating bio variations from questionnaire answers.
 * ⚠️  Server-side only — NVIDIA key never reaches the browser.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient }                   from '@/lib/supabase/server';
import { DEFAULT_MODELS }                 from '@/lib/nvidia/client';
import { nimCall }                        from '@/lib/nvidia/call';
import { profileWriterSystemPrompt, profileWriterUserPrompt } from '@/lib/nvidia/prompts';
import { checkAndIncrementUsage, RateLimitError } from '@/lib/rate-limit';
import type { ProfileWriterRequest, ProfileWriterResponse } from '@/types';

export const runtime    = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // ── 1. Auth ──────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Body ──────────────────────────────────────────────────────────────
    const body: ProfileWriterRequest = await request.json();
    const { platform, answers }      = body;

    if (!platform || !answers) {
      return NextResponse.json({ error: 'platform and answers are required' }, { status: 400 });
    }

    const model = DEFAULT_MODELS.profile_writer;

    // ── 3. Rate limit ────────────────────────────────────────────────────────
    const usage = await checkAndIncrementUsage(user.id, 'profile_writer', model);

    // ── 4. NIM call with automatic fallback ──────────────────────────────────
    const { completion, modelUsed } = await nimCall({
      model,
      messages: [
        { role: 'system', content: profileWriterSystemPrompt(platform) },
        { role: 'user',   content: profileWriterUserPrompt(answers)    },
      ],
      temperature: 0.9,   // Higher temp for creative variety
      max_tokens:  1200,  // 6 short bios fit easily; keeps latency well under the function limit
    });
    if (modelUsed !== model) console.info(`[profile-writer] fell back: ${model} → ${modelUsed}`);

    const raw = completion.choices[0]?.message?.content ?? '';

    // ── 5. Parse numbered-list response ──────────────────────────────────────
    // Format: "1. bio\n2. bio\n...\n6. bio"
    // Immune to JSON-breaking characters (quotes, apostrophes, heights like 5'9").
    let bios: string[] = [];

    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);

    // Primary: numbered items
    bios = lines
      .filter(l => /^\d+[\.\)]\s+.{10,}/.test(l))
      .map(l => l.replace(/^\d+[\.\)]\s+/, '').trim())
      .filter(l => l.length > 10)
      .slice(0, 6);

    // Fallback: double-newline-separated paragraphs
    if (bios.length < 3) {
      bios = raw.split(/\n\n+/)
        .map(b => b.replace(/^\d+[\.\)]\s+/, '').trim())
        .filter(b => b.length > 20)
        .slice(0, 6);
    }

    if (bios.length === 0) {
      return NextResponse.json({ error: 'AI returned no bios. Try again.' }, { status: 500 });
    }

    const response: ProfileWriterResponse = { bios, model, usage };
    return NextResponse.json(response);

  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: err.message, code: 'RATE_LIMIT' },
        { status: 429 }
      );
    }
    console.error('[/api/profile-writer]', err);
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Something went wrong', detail }, { status: 500 });
  }
}
