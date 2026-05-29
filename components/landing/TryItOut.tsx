'use client';

import { useState } from 'react';
import { Copy, Check, MapPin, BadgeCheck, ChevronDown, Sparkles, RefreshCw } from 'lucide-react';

const OPTIONS = [
  "Squat rack and dog dates? You've got an interesting idea of romance, don't you?",
  "So, you snowboard but you're stuck in Florida? You really thought this through…",
  "New to Florida and already hunting for the best taco… your priorities are spot on.",
];

const BASICS = ['Sagittarius', 'In College', 'Dog', 'Often', 'Vegetarian'];
const INTERESTS = ['Gym', 'Tattoos', 'Working out', 'Fishing', 'Snowboarding'];

export default function TryItOut() {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const generate = () => {
    if (loading) return;
    setLoading(true);
    setGenerated(false);
    setTimeout(() => {
      setLoading(false);
      setGenerated(true);
    }, 1100);
  };

  const copy = (i: number) => {
    navigator.clipboard?.writeText(OPTIONS[i]).catch(() => {});
    setCopied(i);
    setTimeout(() => setCopied(c => (c === i ? null : c)), 1500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 items-stretch">
      {/* ── Left: profile card + generate button ─────────────────────────── */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/10 border border-violet-500/20 p-6 sm:p-8 flex flex-col items-center">
        <div className="w-[260px] rounded-2xl bg-white text-zinc-800 text-[11px] shadow-2xl overflow-hidden">
          {/* status bar */}
          <div className="flex items-center justify-between px-3 py-1 text-[9px] text-zinc-500">
            <span>1:00</span>
            <span className="flex items-center gap-1">SOS <span className="tracking-tight">📶 🔋</span></span>
          </div>
          {/* photo */}
          <div className="relative h-28 bg-gradient-to-br from-amber-200 via-orange-300 to-rose-300">
            <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-80">🏔️</div>
            <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
          {/* identity */}
          <div className="px-3 pt-2">
            <div className="flex items-center gap-1 font-bold text-base text-zinc-900">
              Leah <span className="text-zinc-500 font-normal">27</span>
              <BadgeCheck className="w-3.5 h-3.5 text-sky-500" />
              <span>👋</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-zinc-400 mt-0.5">
              <MapPin className="w-3 h-3" /> 33 miles away
            </div>
          </div>
          {/* about */}
          <div className="px-3 pt-3">
            <div className="font-semibold text-zinc-700 mb-1">About Me</div>
            <p className="text-[10px] leading-snug text-zinc-500">
              5&apos;6<br />
              Newish to florida :)<br />
              On the hunt for the best taco place<br />
              Let&apos;s go on dog dates<br />
              Hockey fan #goavs<br />
              Find me at the squat rack 🙂
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {BASICS.map(b => (
                <span key={b} className="border border-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded-full text-[9px]">{b}</span>
              ))}
            </div>
          </div>
          {/* interests */}
          <div className="px-3 py-3">
            <div className="font-semibold text-zinc-700 mb-1">My Interests</div>
            <div className="flex flex-wrap gap-1">
              {INTERESTS.map(t => (
                <span key={t} className="border border-zinc-200 text-zinc-500 px-1.5 py-0.5 rounded-full text-[9px]">{t}</span>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="mt-6 inline-flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-70 text-white font-semibold px-7 py-3 rounded-full transition-all shadow-lg shadow-violet-900/30 hover:scale-[1.03]"
        >
          {loading ? (
            <><RefreshCw className="w-4 h-4 animate-spin" /> Generating…</>
          ) : (
            <><Sparkles className="w-4 h-4 text-violet-400" /> Generate Messages</>
          )}
        </button>
      </div>

      {/* ── Right: generated messages ────────────────────────────────────── */}
      <div className="rounded-3xl bg-gradient-to-br from-fuchsia-500/10 to-rose-500/5 border border-fuchsia-500/20 p-6 sm:p-8">
        <div className="font-bold text-white mb-4">Generated messages</div>

        {!generated && !loading && (
          <div className="h-[280px] flex items-center justify-center text-center text-zinc-500 text-sm border border-dashed border-zinc-700 rounded-2xl px-6">
            Hit <span className="text-violet-300 font-medium mx-1">Generate Messages</span> to see three openers crafted from Leah&apos;s profile.
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {[0, 1, 2].map(i => (
              <div key={i} className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-4">
                <div className="h-2.5 w-20 rounded bg-zinc-800 mb-3 animate-pulse" />
                <div className="h-2.5 w-full rounded bg-zinc-800 mb-2 animate-pulse" style={{ animationDelay: '0.15s' }} />
                <div className="h-2.5 w-4/5 rounded bg-zinc-800 animate-pulse" style={{ animationDelay: '0.3s' }} />
              </div>
            ))}
          </div>
        )}

        {generated && (
          <div className="space-y-3">
            {OPTIONS.map((o, i) => (
              <div
                key={i}
                className="relative bg-zinc-900 border border-zinc-800 rounded-2xl p-4 animate-pop-in"
                style={{ animationDelay: `${i * 0.12}s` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-5 h-5 rounded-full bg-violet-600/30 text-violet-300 text-[10px] flex items-center justify-center font-bold">{i + 1}</span>
                  <span className="text-xs text-zinc-400 font-medium">Option {i + 1}</span>
                  <button
                    onClick={() => copy(i)}
                    className="ml-auto text-zinc-500 hover:text-white transition-colors"
                    aria-label="Copy message"
                  >
                    {copied === i ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-sm text-zinc-200 leading-relaxed">{o}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
