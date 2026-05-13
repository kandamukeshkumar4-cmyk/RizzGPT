/**
 * POST /api/chat
 * ⚠️  All NVIDIA NIM calls happen here — server-side only.
 * The API key never reaches the browser.
 */
import { NextResponse, type NextRequest } from 'next/server';
import { createClient }                   from '@/lib/supabase/server';
import { DEFAULT_MODELS }                 from '@/lib/nvidia/client';
import { nimCall }                        from '@/lib/nvidia/call';
import { chatSystemPrompt, chatUserPrompt } from '@/lib/nvidia/prompts';
import { checkAndIncrementUsage, RateLimitError } from '@/lib/rate-limit';
import type { ChatRequest, ChatResponse }  from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 45;

export async function POST(request: NextRequest) {
  try {
    // ── 1. Authenticate ──────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── 2. Parse & validate body ─────────────────────────────────────────────
    const body: ChatRequest = await request.json();
    const { inputText, inputImageBase64, tone } = body;

    if (!inputText && !inputImageBase64) {
      return NextResponse.json(
        { error: 'Provide either inputText or inputImageBase64' },
        { status: 400 }
      );
    }

    const model = DEFAULT_MODELS.chat;

    // ── 3. Rate limit check ──────────────────────────────────────────────────
    const usage = await checkAndIncrementUsage(user.id, 'chat', model);

    // ── 4. Build message content (text only or multimodal) ───────────────────
    let userContent: string | { type: string; text?: string; image_url?: { url: string } }[];

    if (inputImageBase64) {
      // Vision model call — pass the screenshot as base64
      userContent = [
        {
          type:      'image_url',
          image_url: { url: `data:image/jpeg;base64,${inputImageBase64}` },
        },
        {
          type: 'text',
          text: chatUserPrompt(inputText ?? 'Reply to this dating app conversation.'),
        },
      ];
    } else {
      userContent = chatUserPrompt(inputText!);
    }

    // ── 5. Call NIM with automatic fallback ──────────────────────────────────
    const { completion, modelUsed } = await nimCall({
      model,
      messages: [
        { role: 'system', content: chatSystemPrompt(tone) },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { role: 'user',   content: userContent as any },
      ],
      temperature: 0.85,
      max_tokens:  600,
    });
    if (modelUsed !== model) console.info(`[chat] fell back: ${model} → ${modelUsed}`);

    const raw = completion.choices[0]?.message?.content ?? '';

    // ── 6. Parse numbered-list response ─────────────────────────────────────
    // Format: "1. reply\n2. reply\n3. reply"
    // This format is immune to JSON-breaking characters like quotes in text.
    let replies: string[] = [];

    // Primary: extract numbered items (handles "1.", "1)", "1 -" etc.)
    const lines = raw.split('\n').map(l => l.trim()).filter(Boolean);
    replies = lines
      .filter(l => /^\d+[\.\)]\s+.{5,}/.test(l))
      .map(l => l.replace(/^\d+[\.\)]\s+/, '').trim())
      .filter(l => l.length > 5)
      .slice(0, 3);

    // Fallback: any non-empty line long enough to be a reply
    if (replies.length === 0) {
      replies = lines.filter(l => l.length > 15 && !/^(here|sure|of course|reply|option)/i.test(l)).slice(0, 3);
    }

    if (replies.length === 0) {
      return NextResponse.json({ error: 'AI returned no replies. Try again.' }, { status: 500 });
    }

    const response: ChatResponse = { replies, model, usage };
    return NextResponse.json(response);

  } catch (err) {
    if (err instanceof RateLimitError) {
      return NextResponse.json(
        { error: err.message, code: 'RATE_LIMIT' },
        { status: 429 }
      );
    }
    console.error('[/api/chat]', err);
    const detail = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: 'Something went wrong', detail }, { status: 500 });
  }
}
