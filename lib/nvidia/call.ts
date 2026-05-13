/**
 * Fallback-aware NIM call wrapper.
 * ⚠️  Server-side only — import only from /app/api/* routes.
 *
 * Wraps nim.chat.completions.create with automatic failover:
 *   primary model → FALLBACK_MODELS[primary] → throws
 *
 * Also exports routeIntent() which uses the fast 8B router to classify
 * whether a request is "simple" or "complex" before picking a model.
 */
import type OpenAI from 'openai';
import { nim, FALLBACK_MODELS, ROUTER_MODEL } from './client';

type CreateParams = Parameters<typeof nim.chat.completions.create>[0];

function is410(err: unknown): boolean {
  return String(err).includes('410') || String(err).includes('Gone');
}

/**
 * Call NIM with automatic fallback if the primary model is gone (410).
 * Returns { completion, modelUsed } so callers know which model actually ran.
 */
export async function nimCall(
  params: CreateParams
): Promise<{ completion: OpenAI.Chat.ChatCompletion; modelUsed: string }> {
  const primary = params.model as string;

  try {
    const completion = await nim.chat.completions.create({
      ...params, stream: false,
    }) as OpenAI.Chat.ChatCompletion;
    return { completion, modelUsed: primary };
  } catch (err) {
    if (!is410(err)) throw err; // re-throw non-410 errors

    const fallback = FALLBACK_MODELS[primary];
    if (!fallback) throw err;

    console.warn(`[NIM] ${primary} → 410, falling back to ${fallback}`);
    const completion = await nim.chat.completions.create({
      ...params, model: fallback, stream: false,
    }) as OpenAI.Chat.ChatCompletion;
    return { completion, modelUsed: fallback };
  }
}

/**
 * Lightweight intent router — uses the fast 8B model to classify the
 * incoming text as "simple" | "complex" | "vision".
 * Callers use this to pick between Qwen 3.5 (complex) vs Nemotron (simple).
 */
export async function routeIntent(
  text: string,
  hasImages: boolean
): Promise<'simple' | 'complex' | 'vision'> {
  if (hasImages) return 'vision';

  try {
    const { completion } = await nimCall({
      model: ROUTER_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are a routing classifier for a dating AI app. ' +
            'Given the user\'s input, reply with exactly ONE word: ' +
            '"simple" (short/straightforward request) or "complex" (detailed bio, long message, nuanced analysis). ' +
            'No other output.',
        },
        { role: 'user', content: text.slice(0, 500) },
      ],
      max_tokens: 5,
      temperature: 0,
    });

    const verdict = completion.choices[0]?.message?.content?.toLowerCase().trim() ?? '';
    return verdict.includes('complex') ? 'complex' : 'simple';
  } catch {
    return 'complex'; // fail-open: use the better model
  }
}
