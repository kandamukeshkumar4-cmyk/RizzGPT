'use client';

import { Copy, Star, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

// ── Chat Assistant: incoming bubble + 3 reply options ─────────────────────────
function ChatMock() {
  return (
    <div className="p-4 text-[10px] space-y-2">
      <div className="max-w-[70%] bg-zinc-800 text-zinc-200 rounded-2xl rounded-bl-sm px-3 py-1.5">
        Hey! Your hiking pics are unreal 😍
      </div>
      <div className="space-y-1.5 pt-1">
        {['Right? Last one was in Lisbon — guess the rest 😏', 'You hike too or just here for the views?'].map((r, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 bg-zinc-800/70 border border-zinc-700 rounded-lg px-2 py-1.5 animate-reply-in"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <span className="w-3.5 h-3.5 rounded-full bg-violet-600/30 text-violet-300 text-[7px] flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
            <span className="text-zinc-200 leading-snug flex-1">{r}</span>
            <Copy className="w-2.5 h-2.5 text-zinc-500 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Profile Writer: bio variations ────────────────────────────────────────────
function WriterMock() {
  return (
    <div className="p-4 text-[10px] space-y-2">
      <div className="flex items-center gap-1.5 text-fuchsia-300 font-semibold mb-1">
        <Sparkles className="w-3 h-3" /> 6 bios generated
      </div>
      {[
        'Adventure-seeker, taco enthusiast, terrible at mini-golf. 🌮',
        'I’ll out-hike you then lose at trivia. Fair trade?',
        'Dog person, hopeless romantic, decent playlist curator.',
      ].map((b, i) => (
        <div
          key={i}
          className="bg-zinc-800/70 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-zinc-200 leading-snug animate-reply-in"
          style={{ animationDelay: `${i * 0.5}s` }}
        >
          {b}
        </div>
      ))}
    </div>
  );
}

// ── Profile Review: score gauge + checklist ───────────────────────────────────
function ReviewMock() {
  return (
    <div className="p-4 flex items-center gap-4 text-[10px]">
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg viewBox="0 0 36 36" className="w-16 h-16 -rotate-90">
          <circle cx="18" cy="18" r="15.5" fill="none" stroke="#27272a" strokeWidth="3" />
          <circle
            cx="18" cy="18" r="15.5" fill="none" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round"
            strokeDasharray="97.4" strokeDashoffset="22" className="animate-score-ring"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-black text-white leading-none">82</span>
          <span className="text-[7px] text-zinc-500">/100</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {['Strong lead photo', 'Bio shows personality', 'Add a group shot'].map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-1.5 text-zinc-300 animate-reply-in"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            <CheckCircle2 className={`w-3 h-3 flex-shrink-0 ${i === 2 ? 'text-amber-400' : 'text-emerald-400'}`} />
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── AI Photo Coach: a person photo being scanned & analyzed by AI ─────────────
function PhotoMock() {
  return (
    <div className="p-4 flex gap-3">
      {/* the photo being analyzed */}
      <div className="relative w-[88px] flex-shrink-0 aspect-[3/4] rounded-lg bg-gradient-to-b from-sky-300 via-indigo-300 to-violet-400 overflow-hidden">
        {/* person silhouette */}
        <div className="absolute inset-0 flex items-end justify-center text-4xl">🧑</div>
        {/* face-detection bracket */}
        <div className="absolute left-1/2 top-3 -translate-x-1/2 w-9 h-9 animate-detect">
          <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-violet-300" />
          <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-violet-300" />
          <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-violet-300" />
          <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-violet-300" />
        </div>
        {/* sweeping scan line */}
        <div className="absolute left-0 right-0 h-8 bg-gradient-to-b from-violet-400/0 via-violet-300/60 to-violet-400/0 animate-scan" />
        {/* analyzing badge */}
        <span className="absolute top-1 left-1 bg-zinc-900/80 text-white text-[7px] px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
          <Sparkles className="w-2 h-2 text-violet-300 animate-pulse" /> Analyzing
        </span>
      </div>

      {/* per-photo AI scores streaming in */}
      <div className="flex-1 text-[10px] space-y-1.5">
        <div className="flex items-center gap-1 text-emerald-300 font-semibold">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /> Best shot · 9.1
        </div>
        {[
          ['Lighting', 'Great', 'text-emerald-300'],
          ['Sharpness', 'Crisp', 'text-emerald-300'],
          ['Expression', 'Warm smile', 'text-emerald-300'],
          ['Background', 'A little busy', 'text-amber-300'],
        ].map(([label, val, color], i) => (
          <div
            key={label}
            className="flex items-center justify-between bg-zinc-800/70 border border-zinc-700 rounded px-2 py-1 animate-reply-in"
            style={{ animationDelay: `${i * 0.45}s` }}
          >
            <span className="text-zinc-400">{label}</span>
            <span className={color as string}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const MOCKS: Record<string, () => React.ReactElement> = {
  'Chat Assistant': ChatMock,
  'Profile Writer': WriterMock,
  'Profile Review': ReviewMock,
  'AI Photo Coach': PhotoMock,
};

export default function FeatureMockup({ kind }: { kind: string }) {
  const Mock = MOCKS[kind];
  if (!Mock) return null;
  return (
    <div className="relative rounded-xl bg-zinc-950/80 border border-zinc-800 overflow-hidden mb-5 min-h-[120px]">
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-zinc-800 text-[9px] text-zinc-500">
        <RefreshCw className="w-2.5 h-2.5 text-violet-400" /> Live preview
      </div>
      <Mock />
    </div>
  );
}
