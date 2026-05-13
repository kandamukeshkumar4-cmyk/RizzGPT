/**
 * POST /api/ai-photos
 * Analyzes uploaded photos and provides dating profile coaching.
 * ⚠️  Server-side only — NVIDIA key never reaches the browser.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient }                   from '@/lib/supabase/server';
import { DEFAULT_MODELS }                 from '@/lib/nvidia/client';
import { nimCall }                        from '@/lib/nvidia/call';
import { aiPhotosSystemPrompt, aiPhotosUserPrompt } from '@/lib/nvidia/prompts';
import { checkAndIncrementUsage, RateLimitError }   from '@/lib/rate-limit';
import type { AIPhotosRequest, AIPhotosResponse, PhotoStyle } from '@/types';

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
    const body: AIPhotosRequest = await request.json();
    const { style, photos }     = body;

    if (!photos || photos.length === 0) {
      return NextResponse.json({ error: 'At least one photo is required' }, { status: 400 });
    }

    if (photos.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 photos per session' }, { status: 400 });
    }

    const validStyles: PhotoStyle[] = ['professional', 'casual', 'adventurous', 'artistic'];
    const photoStyle: PhotoStyle = validStyles.includes(style) ? style : 'casual';

    const model = DEFAULT_MODELS.ai_photos; // meta/llama-4-maverick — supports vision
    const usage = await checkAndIncrementUsage(user.id, 'ai_photos', model);

    // ── 3. Build multimodal message ───────────────────────────────────────────
    type ContentPart =
      | { type: 'text'; text: string }
      | { type: 'image_url'; image_url: { url: string } };

    const imageParts: ContentPart[] = photos.slice(0, 6).map(b64 => ({
      type:      'image_url' as const,
      image_url: { url: `data:image/jpeg;base64,${b64}` },
    }));

    const userContent: ContentPart[] = [
      ...imageParts,
      {
        type: 'text' as const,
        text: aiPhotosUserPrompt(photoStyle, photos.length),
      },
    ];

    // ── 4. NIM call with automatic fallback ──────────────────────────────────
    const { completion, modelUsed } = await nimCall({
      model,
      messages: [
        { role: 'system', content: aiPhotosSystemPrompt },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { role: 'user',   content: userContent as any   },
      ],
      temperature: 0.4,
      max_tokens:  1500,
    });
    if (modelUsed !== model) console.info(`[ai-photos] fell back: ${model} → ${modelUsed}`);

    const raw = completion.choices[0]?.message?.content ?? '';

    // Parse response — try JSON first, fallback to raw text
    let analysisData: Record<string, unknown> = {};
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      analysisData    = JSON.parse(jsonMatch?.[0] ?? '{}');
    } catch {
      analysisData = { rawFeedback: raw };
    }

    const response = {
      analysis: analysisData,
      model,
      usage,
    };

    return NextResponse.json(response);

  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: err.message, code: 'RATE_LIMIT' },
        { status: 429 }
      );
    }
    console.error('[/api/ai-photos]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
