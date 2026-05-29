/**
 * ⚠️  SERVER-SIDE ONLY — Import ONLY from /app/api/* routes
 *
 * SECURITY: NVIDIA_API_KEY has NO "NEXT_PUBLIC_" prefix.
 * Next.js guarantees it is NEVER bundled into client-side JavaScript.
 * Any attempt to use process.env.NVIDIA_API_KEY in a client component
 * returns undefined — the key never reaches the browser.
 */
import OpenAI from 'openai';
import { env } from '@/lib/env';
import type { NIMModel } from '@/types';

/**
 * OpenAI-compatible client pointed at NVIDIA NIM.
 * All models on build.nvidia.com are accessible through this endpoint.
 * Key is validated at runtime (first API call), not at build time,
 * so Next.js static analysis does not throw during `next build`.
 * API key is read via env() which always .trim()s the value, guarding
 * against trailing newlines from shell-piped `vercel env add` commands.
 */
export const nim = new OpenAI({
  apiKey:  env.NVIDIA_API_KEY(),
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

// ─── Available NIM Models (live-probed) ──────────────────────────────────────
//
// Architecture:
//  • Primary text    → Qwen 3.5 397B-A17B  (400B MoE, best quality on NIM)
//  • Vision          → Llama 4 Maverick    (only live multimodal model on NIM)
//  • Heavy fallback  → Llama 3.1 70B       (solid dense fallback)
//  • Fast router     → Llama 3.1 8B        (lightweight classifier / guardrails)
//
// Models probed & confirmed NOT on NIM as of this build:
//   kimi-k2-instruct, kimi-k2.6, nemotron-nano-vl, qwen3-small, deepseek-r1, etc.

export const NIM_MODELS: NIMModel[] = [
  {
    id: 'meta/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B (Meta)',
    description: 'Meta • 70B • Best general text quality on NIM • Chat, writing, review',
    bestFor: ['chat', 'profile_writer', 'profile_review'],
    contextWindow: 131072,
    supportsVision: false,
  },
  {
    id: 'nvidia/nemotron-nano-12b-v2-vl',
    name: 'Nemotron Nano 12B VL (NVIDIA)',
    description: 'NVIDIA • 12B • Purpose-built multi-image & video understanding, visual Q&A',
    bestFor: ['ai_photos', 'profile_review'],
    contextWindow: 131072,
    supportsVision: true,
  },
  {
    id: 'meta/llama-4-maverick-17b-128e-instruct',
    name: 'Llama 4 Maverick (Meta)',
    description: 'Meta • 17B active / 400B+ total • Native vision + deep reasoning',
    bestFor: ['profile_review'],
    contextWindow: 1048576,
    supportsVision: true,
  },
  {
    id: 'nvidia/llama-3.3-nemotron-super-49b-v1',
    name: 'Nemotron Super 49B (NVIDIA)',
    description: 'NVIDIA fine-tuned • 49B • Top instruction following',
    bestFor: ['chat', 'profile_writer'],
    contextWindow: 131072,
    supportsVision: false,
  },
  {
    id: 'meta/llama-3.1-70b-instruct',
    name: 'Llama 3.1 70B — Fallback (Meta)',
    description: 'Meta • 70B • Reliable heavy-reasoning fallback',
    bestFor: ['chat', 'profile_writer'],
    contextWindow: 131072,
    supportsVision: false,
  },
  {
    id: 'meta/llama-3.1-8b-instruct',
    name: 'Llama 3.1 8B — Router (Meta)',
    description: 'Meta • 8B • Lightweight fast router / task classifier',
    bestFor: ['chat'],
    contextWindow: 131072,
    supportsVision: false,
  },
];

// ─── Default models per feature ───────────────────────────────────────────────
export const DEFAULT_MODELS = {
  chat:           'meta/llama-3.3-70b-instruct',         // best general text quality
  profile_writer: 'meta/llama-3.3-70b-instruct',         // creative writing
  profile_review: 'meta/llama-4-maverick-17b-128e-instruct', // vision + reasoning
  ai_photos:      'nvidia/nemotron-nano-12b-v2-vl',      // purpose-built photo analysis
} as const;

// ─── Fallback chain ───────────────────────────────────────────────────────────
export const FALLBACK_MODELS: Record<string, string> = {
  'meta/llama-3.3-70b-instruct':             'meta/llama-3.1-70b-instruct',
  'nvidia/nemotron-nano-12b-v2-vl':          'meta/llama-4-maverick-17b-128e-instruct',
  'meta/llama-4-maverick-17b-128e-instruct': 'nvidia/llama-3.3-nemotron-super-49b-v1',
  'nvidia/llama-3.3-nemotron-super-49b-v1':  'meta/llama-3.1-70b-instruct',
  'meta/llama-3.1-70b-instruct':             'meta/llama-3.1-8b-instruct',
};

// ─── Router model ─────────────────────────────────────────────────────────────
export const ROUTER_MODEL = 'meta/llama-3.1-8b-instruct';

export type ModelFeature = keyof typeof DEFAULT_MODELS;
