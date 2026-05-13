-- ═══════════════════════════════════════════════════════════════════════
--  RizzGPT — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ═══════════════════════════════════════════════════════════════════════

-- ── 1. Profiles (synced from auth.users on signup) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id             UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email          TEXT NOT NULL,
  display_name   TEXT,
  avatar_url     TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── 2. Usage log (rate limiting — 50 req/day per user) ───────────────────────
CREATE TABLE IF NOT EXISTS public.usage_log (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  feature     TEXT        NOT NULL CHECK (feature IN ('chat', 'profile_writer', 'profile_review', 'ai_photos')),
  model_used  TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS usage_log_user_date_idx
  ON public.usage_log (user_id, created_at DESC);

ALTER TABLE public.usage_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own usage"
  ON public.usage_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage"
  ON public.usage_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── 3. Chat sessions (history) ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  input_text  TEXT,
  tone        TEXT        NOT NULL DEFAULT 'flirty',
  replies     TEXT[]      NOT NULL DEFAULT '{}',
  model_used  TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS chat_sessions_user_idx
  ON public.chat_sessions (user_id, created_at DESC);

ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own chat sessions"
  ON public.chat_sessions FOR ALL
  USING (auth.uid() = user_id);

-- ── 4. Profile writer sessions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profile_writer_sessions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform    TEXT        NOT NULL,
  answers     JSONB       NOT NULL DEFAULT '{}',
  bios        TEXT[]      NOT NULL DEFAULT '{}',
  model_used  TEXT        NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS profile_writer_user_idx
  ON public.profile_writer_sessions (user_id, created_at DESC);

ALTER TABLE public.profile_writer_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own bio sessions"
  ON public.profile_writer_sessions FOR ALL
  USING (auth.uid() = user_id);

-- ── 5. Profile reviews ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profile_reviews (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  platform        TEXT        NOT NULL,
  overall_score   INT         CHECK (overall_score BETWEEN 0 AND 100),
  photo_score     INT         CHECK (photo_score   BETWEEN 0 AND 100),
  bio_score       INT         CHECK (bio_score     BETWEEN 0 AND 100),
  prompt_score    INT         CHECK (prompt_score  BETWEEN 0 AND 100),
  feedback        JSONB       NOT NULL DEFAULT '{}',
  summary         TEXT,
  model_used      TEXT        NOT NULL DEFAULT '',
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS profile_reviews_user_idx
  ON public.profile_reviews (user_id, created_at DESC);

ALTER TABLE public.profile_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access own reviews"
  ON public.profile_reviews FOR ALL
  USING (auth.uid() = user_id);

-- ── 6. Auto-create profile on signup (trigger) ───────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ── 7. Verify everything created ─────────────────────────────────────────────
SELECT table_name
FROM   information_schema.tables
WHERE  table_schema = 'public'
ORDER  BY table_name;
