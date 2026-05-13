/**
 * POST /api/profile-review
 * Analyzes dating profile (text + optional images) and returns scores + feedback.
 * ⚠️  Server-side only — NVIDIA key never reaches the browser.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient }                   from '@/lib/supabase/server';
import { DEFAULT_MODELS }                 from '@/lib/nvidia/client';
import { nimCall }                        from '@/lib/nvidia/call';
import { profileReviewSystemPrompt, profileReviewUserPrompt } from '@/lib/nvidia/prompts';
import { checkAndIncrementUsage, RateLimitError } from '@/lib/rate-limit';
import type { ProfileReviewResponse }     from '@/types';

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
    const body = await request.json() as {
      platform:           string;
      profileDescription: string;
      imageBase64s?:      string[]; // optional screenshots
    };

    const { platform, profileDescription, imageBase64s } = body;

    if (!platform || !profileDescription) {
      return NextResponse.json(
        { error: 'platform and profileDescription are required' },
        { status: 400 }
      );
    }

    const model = DEFAULT_MODELS.profile_review;
    const usage = await checkAndIncrementUsage(user.id, 'profile_review', model);

    // ── 3. Build message (with or without images) ─────────────────────────────
    type ContentPart =
      | { type: 'text'; text: string }
      | { type: 'image_url'; image_url: { url: string } };

    let userContent: string | ContentPart[];

    if (imageBase64s && imageBase64s.length > 0) {
      // Multimodal: send up to 4 screenshots + text
      const imageParts: ContentPart[] = imageBase64s.slice(0, 4).map(b64 => ({
        type:      'image_url',
        image_url: { url: `data:image/jpeg;base64,${b64}` },
      }));

      userContent = [
        ...imageParts,
        {
          type: 'text',
          text: profileReviewUserPrompt(platform, profileDescription),
        },
      ];
    } else {
      userContent = profileReviewUserPrompt(platform, profileDescription);
    }

    // ── 4. NIM call with automatic fallback ──────────────────────────────────
    const { completion, modelUsed } = await nimCall({
      model,
      messages: [
        { role: 'system', content: profileReviewSystemPrompt },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { role: 'user',   content: userContent as any        },
      ],
      temperature: 0.3,  // Low temp for consistent scoring
      max_tokens:  1500,
    });
    if (modelUsed !== model) console.info(`[profile-review] fell back: ${model} → ${modelUsed}`);

    const raw = completion.choices[0]?.message?.content ?? '';

    // ── 5. Parse JSON (robust: handle markdown fences + partial JSON) ─────────
    let reviewData: Partial<ProfileReviewResponse> = {};
    try {
      // Strip markdown fences if present
      const cleaned   = raw.replace(/^```(?:json)?\n?/m, '').replace(/\n?```$/m, '').trim();
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('no JSON found');
      reviewData = JSON.parse(jsonMatch[0]);
    } catch {
      // If JSON still fails, return generic scores so the UI doesn't break
      reviewData = {
        scores:   { overall: 50, photos: 50, bio: 50, prompts: 50 },
        feedback: { redFlags: [], strengths: [], recommendations: ['Try describing your profile in the text box for a more detailed review.'], photoTips: [], bioTips: [] },
        summary:  raw.slice(0, 500) || 'Unable to parse structured review. See raw feedback above.',
      };
    }

    // Ensure scores are within bounds
    if (reviewData.scores) {
      const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
      reviewData.scores.overall = clamp(reviewData.scores.overall ?? 50);
      reviewData.scores.photos  = clamp(reviewData.scores.photos  ?? 50);
      reviewData.scores.bio     = clamp(reviewData.scores.bio     ?? 50);
      reviewData.scores.prompts = clamp(reviewData.scores.prompts ?? 50);
    }

    const response: ProfileReviewResponse = {
      scores:   reviewData.scores  ?? { overall: 50, photos: 50, bio: 50, prompts: 50 },
      feedback: reviewData.feedback ?? { redFlags: [], strengths: [], recommendations: [], photoTips: [], bioTips: [] },
      summary:  reviewData.summary  ?? '',
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
    console.error('[/api/profile-review]', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
