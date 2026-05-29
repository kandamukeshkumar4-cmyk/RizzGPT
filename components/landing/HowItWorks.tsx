'use client';

import { Sparkles, Copy, Check, RefreshCw, Star } from 'lucide-react';
import Reveal from './Reveal';

// ── Phone shell ───────────────────────────────────────────────────────────────
function Phone({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-[230px] animate-float">
      <div className="rounded-[2.2rem] border-[4px] border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-zinc-900 rounded-full z-30" />
        <div className="relative rounded-[1.8rem] overflow-hidden h-[440px]">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Step 1: screenshotting a match's Bumble profile ──────────────────────────
function CaptureMockup() {
  const basics = ['5’2″', 'Active', 'Socially', 'Woman', 'Relationship', 'Gemini'];
  const interests = ['Gym', 'Swimming', 'Cycling', 'Beaches'];
  return (
    <div className="relative h-full bg-white text-zinc-800 text-[10px] pt-7 overflow-hidden">
      {/* screenshot flash */}
      <div className="absolute inset-0 bg-white z-20 pointer-events-none animate-shot-flash" />

      {/* bumble top bar */}
      <div className="flex items-center justify-between px-3 pb-2 border-b border-zinc-100">
        <span className="text-zinc-400 text-sm">&#9776;</span>
        <span className="font-extrabold text-amber-500 tracking-tight">bumble</span>
        <span className="text-amber-500">&#9670;</span>
      </div>

      <div className="px-3 py-2.5">
        {/* About me */}
        <div className="text-zinc-400 mb-1">About me</div>
        <p className="font-bold text-zinc-800 leading-snug mb-3">
          I&apos;m petite in size but have a big personality. I love a day adventure on my day off and I won&apos;t complain if it ends with a cold beer.
        </p>

        {/* My basics */}
        <div className="text-zinc-400 mb-1.5">My basics</div>
        <div className="flex flex-wrap gap-1 mb-3">
          {basics.map(b => (
            <span key={b} className="flex items-center gap-0.5 border border-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full">
              <span className="text-amber-500">&#9670;</span>{b}
            </span>
          ))}
        </div>

        {/* My interests */}
        <div className="text-zinc-400 mb-1.5">My interests</div>
        <div className="flex flex-wrap gap-1">
          {interests.map(t => (
            <span key={t} className="border border-zinc-200 text-zinc-600 px-1.5 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      {/* bumble premium star */}
      <div className="absolute bottom-16 right-3 w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
        <Star className="w-3.5 h-3.5 fill-white text-white" />
      </div>

      {/* captured-counter chip */}
      <div className="absolute bottom-4 right-3 z-20 animate-thumb-fly">
        <div className="flex items-center gap-1.5 bg-zinc-900 text-white rounded-xl px-2.5 py-1.5 shadow-lg">
          <div className="w-6 h-8 rounded bg-gradient-to-br from-amber-300 to-yellow-200" />
          <span className="text-[10px] font-semibold">Captured 3/5</span>
        </div>
      </div>
    </div>
  );
}

// ── Step 2: RizzGPT "First Move" analysis + message options ───────────────────
function UploadScanMockup() {
  const options = [
    'I’ve been singing for 10 years?! That’s seriously impressive! What’s your favorite song to belt out when you’re alone?',
    'That “guess where this photo was taken” game is intriguing! I’m going to guess somewhere with a great view and delicious food. Am I close?',
  ];
  return (
    <div className="relative h-full bg-zinc-950 text-white text-[10px] pt-7 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3 h-3 text-violet-400" /> RizzGPT
        </div>
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-amber-300 to-rose-400" />
      </div>

      {/* title row */}
      <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-2">
        <span className="font-bold text-white text-[11px] leading-tight flex-1">First Move<br />for Liron</span>
        <span className="bg-violet-600/30 text-violet-200 px-1.5 py-0.5 rounded-full">First Move</span>
        <span className="flex items-center gap-0.5 bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded-full">
          <Check className="w-2 h-2" /> Complete
        </span>
      </div>

      {/* AI analysis box */}
      <div className="px-3">
        <div className="rounded-lg bg-violet-500/10 border border-violet-500/20 p-2">
          <div className="flex items-center gap-1 text-violet-300 font-semibold mb-1">
            <Sparkles className="w-2.5 h-2.5 animate-pulse" /> AI Analysis
          </div>
          <p className="text-violet-100/80 leading-snug">
            Liron’s profile showcases a love for singing and a sense of adventure, with photos from diverse locations. The “guess where this photo was taken” prompt is a great hook to start with.
          </p>
        </div>
      </div>

      {/* first message options */}
      <div className="flex items-center justify-between px-3 mt-2.5 mb-1.5">
        <span className="font-semibold text-zinc-300">First Message Options</span>
        <span className="flex items-center gap-1 text-violet-300 bg-violet-500/15 px-1.5 py-0.5 rounded-full">
          <RefreshCw className="w-2.5 h-2.5" /> Regenerate
        </span>
      </div>

      <div className="px-3 space-y-1.5">
        {options.map((o, i) => (
          <div
            key={i}
            className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-2 animate-reply-in"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-3.5 h-3.5 rounded-full bg-violet-600/30 text-violet-300 text-[7px] flex items-center justify-center font-bold">{i + 1}</span>
              <span className="text-zinc-500">Option {i + 1}</span>
              <Copy className="ml-auto w-2.5 h-2.5 text-zinc-600" />
            </div>
            <p className="text-zinc-200 leading-snug">{o}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Step 3: RizzGPT follow-up "Response Options" from a chat recording ────────
function RepliesMockup() {
  const replies = [
    'Consider it done! I’ll be sure to save your number under “Future Mrs. Awesome” 😄',
    'WhatsApp, here we come! Just promise not to spam me with too many cat videos.',
    'Okay, sending you a quick text so you have mine too. Prepare for some top-tier banter!',
  ];
  return (
    <div className="relative h-full bg-zinc-950 text-white text-[10px] pt-7 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800">
        <div className="flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3 h-3 text-violet-400" /> RizzGPT
        </div>
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-300 to-indigo-400" />
      </div>

      {/* analysis blurb */}
      <div className="px-3 pt-2">
        <p className="text-violet-100/70 leading-snug bg-violet-500/10 border border-violet-500/20 rounded-lg p-2">
          The conversation shifted to exchanging phone numbers. The vibe is friendly and playful — these responses keep the momentum going while injecting a bit of charm.
        </p>
      </div>

      {/* response options */}
      <div className="flex items-center justify-between px-3 mt-2.5 mb-1.5">
        <span className="font-semibold text-zinc-300">Response Options</span>
        <span className="flex items-center gap-1 text-violet-300 bg-violet-500/15 px-1.5 py-0.5 rounded-full">
          <RefreshCw className="w-2.5 h-2.5" /> Regenerate
        </span>
      </div>

      <div className="px-3 space-y-1.5 flex-1">
        {replies.map((r, i) => (
          <div
            key={i}
            className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-2 animate-reply-in"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-3.5 h-3.5 rounded-full bg-violet-600/30 text-violet-300 text-[7px] flex items-center justify-center font-bold">{i + 1}</span>
              <span className="text-zinc-500">Option {i + 1}</span>
              {i === 0 ? (
                <span className="ml-auto relative w-2.5 h-2.5">
                  <Copy className="absolute inset-0 w-2.5 h-2.5 text-zinc-600" />
                  <span className="absolute inset-0 animate-copied"><Check className="w-2.5 h-2.5 text-emerald-400" /></span>
                </span>
              ) : (
                <Copy className="ml-auto w-2.5 h-2.5 text-zinc-600" />
              )}
            </div>
            <p className="text-zinc-200 leading-snug">{r}</p>
          </div>
        ))}
      </div>

      {/* pro tip */}
      <div className="px-3 pb-3 mt-1.5">
        <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-1.5 text-emerald-200/90 leading-snug">
          💡 Pro tip: Click the copy button to copy any response to your clipboard, then paste it into your dating app! ✨
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: '01',
    title: 'Take screenshots of your matches bio',
    desc: 'Take up to 5 screenshots of your matches bio, and add them to the upload box.',
    mockup: <CaptureMockup />,
    panel: 'from-amber-400 to-orange-500',
  },
  {
    n: '02',
    title: 'Get a flirty message',
    desc: 'Within moments, RizzGPT crafts a dating expert approved message based on the provided screenshot. For additional responses, simply press “Regenerate”.',
    mockup: <UploadScanMockup />,
    panel: 'from-fuchsia-500 to-pink-600',
  },
  {
    n: '03',
    title: 'Generate replies!',
    desc: 'If you’re speaking with someone and want help on a follow up message, simply upload a screen recording of your chat conversation, and generate the best response.',
    mockup: <RepliesMockup />,
    panel: 'from-violet-500 to-purple-600',
  },
];

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto relative">
      <div className="hidden md:block absolute left-1/2 top-10 bottom-10 w-px -translate-x-1/2 border-l-2 border-dashed border-zinc-800" />

      <div className="space-y-16 md:space-y-8">
        {STEPS.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <Reveal key={s.n}>
              <div className={`relative grid md:grid-cols-2 gap-8 md:gap-12 items-center ${flip ? 'md:[direction:rtl]' : ''}`}>
                <div className="flex justify-center [direction:ltr]">
                  <div className={`rounded-[2.5rem] bg-gradient-to-br ${s.panel} p-8 sm:p-12`}>
                    <Phone>{s.mockup}</Phone>
                  </div>
                </div>

                <div className="text-center md:text-left [direction:ltr]">
                  <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl font-black text-white flex-shrink-0">
                      {s.n}
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-white">{s.title}</h3>
                  </div>
                  <p className="text-zinc-400 leading-relaxed max-w-md mx-auto md:mx-0">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
