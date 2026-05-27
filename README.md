# RizzGPT

**AI-powered dating app assistant** — smarter replies, better bios, profile scores, and photo coaching. Built with Next.js 15, Supabase, and NVIDIA NIM.

## What it does

| Feature | Description |
|---|---|
| **Chat Assistant** | Paste a conversation or screenshot → get 3 on-tone replies in under 5 seconds |
| **Profile Writer** | Answer 6 questions → generate 6 bio variations tailored to Tinder, Hinge, Bumble, etc. |
| **Profile Review** | Upload a profile screenshot → receive an AI score (0–100) across photos, bio, and prompts |
| **AI Photo Coach** | Upload a photo → get expert feedback on what to fix, how to pose, and which to lead with |

**Live:** [rizzgpt-beta.vercel.app](https://rizzgpt-beta.vercel.app) · 300K+ users · 100% free, no credit card

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript |
| Auth & Database | Supabase (Auth, Postgres, Row Level Security) |
| AI | NVIDIA NIM — Kimi K2, Qwen 2.5 72B, Llama 3.3 70B, Llama 3.2 90B Vision |
| Styling | Tailwind CSS |
| Deployment | Vercel |

---

## Architecture

```
Browser
  │
  ├── Next.js App Router (React Server Components + Client Components)
  │     ├── /chat          — text or vision input → 3 reply options
  │     ├── /profile-writer — guided form → bio generation
  │     ├── /profile-review — image upload → scored feedback
  │     └── /ai-photos      — photo upload → coaching feedback
  │
  └── Next.js API Routes (Node.js runtime, server-side only)
        ├── POST /api/chat
        ├── POST /api/profile-writer
        ├── POST /api/profile-review
        ├── POST /api/ai-photos
        └── GET  /api/usage
              │
              ├── Supabase Auth   — session validation on every request
              ├── Supabase Postgres — usage_log, chat history, bio sessions, reviews
              └── NVIDIA NIM API  — multi-model calls with automatic fallback
```

**Key decisions:**

- **API key never reaches the browser.** All NIM calls happen in server-side route handlers behind Supabase auth.
- **Multi-model fallback.** If the primary model is unavailable, `nimCall` retries with the next ranked model automatically.
- **Rate limiting via Postgres.** A `usage_log` table with an indexed `(user_id, created_at)` compound key counts daily requests. Fails open — if the DB is unhealthy, the request goes through rather than blocking the user.
- **Row Level Security on every table.** Supabase RLS policies ensure users can only read and write their own data, enforced at the database layer.
- **Multimodal support.** The chat and photo routes accept base64-encoded images and route them to vision-capable models.

---

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
# Fill in NVIDIA_API_KEY, Supabase keys, and NEXT_PUBLIC_APP_URL

# 3. Set up the database
# Paste supabase/schema.sql into your Supabase SQL editor and run it

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NVIDIA_API_KEY` | Yes | NVIDIA NIM API key — server-side only |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase public anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key — server-side only |
| `NEXT_PUBLIC_APP_URL` | Yes | App base URL (e.g. `http://localhost:3000`) |
| `DAILY_REQUEST_LIMIT` | No | Max AI requests per user per day (default: 50) |

---

## Database schema

Five tables, all with RLS enabled:

- **`profiles`** — synced from `auth.users` via trigger on signup
- **`usage_log`** — per-user daily request counter across all features
- **`chat_sessions`** — saved reply history
- **`profile_writer_sessions`** — saved bio generation sessions
- **`profile_reviews`** — scored profile review results with JSONB feedback

Full schema: [`supabase/schema.sql`](supabase/schema.sql)

---

## Deployment

Deployed on Vercel. Set the same environment variables from the table above in your Vercel project settings, then push to `main`.
