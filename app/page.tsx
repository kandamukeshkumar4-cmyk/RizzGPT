import Link from 'next/link';
import {
  MessageCircle, FileText, Star, Camera, Zap, Shield, Users,
  ChevronRight, Sparkles, CheckCircle2, Quote, Heart, TrendingUp,
} from 'lucide-react';
import Reveal from '@/components/landing/Reveal';
import FAQ from '@/components/landing/FAQ';
import HowItWorks from '@/components/landing/HowItWorks';
import TryItOut from '@/components/landing/TryItOut';
import FeatureMockup from '@/components/landing/FeatureMockup';

const APPS = ['Tinder', 'Bumble', 'Hinge', 'OkCupid', 'Coffee Meets Bagel'];

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Chat Assistant',
    tagline: '3 perfect replies in seconds',
    description:
      'Paste a conversation or upload a screenshot and instantly get three reply options written in the exact tone you want.',
    points: [
      '4 tones: Flirty, Funny, Friendly & Formal',
      'Reads screenshots with vision AI',
      'One-tap copy for each reply',
    ],
    href: '/chat',
    gradient: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-600/20',
  },
  {
    icon: FileText,
    title: 'Profile Writer',
    tagline: '6 bios that get more matches',
    description:
      'Answer a few quick questions about yourself and get six tailored bio variations built for your chosen app.',
    points: [
      'Tuned per platform (Tinder, Bumble, Hinge…)',
      'Pick your humor style & dating goals',
      '6 ready-to-paste variations every run',
    ],
    href: '/profile-writer',
    gradient: 'from-fuchsia-500 to-pink-600',
    glow: 'shadow-fuchsia-600/20',
  },
  {
    icon: Star,
    title: 'Profile Review',
    tagline: 'Score & fix your profile',
    description:
      'Upload up to 6 profile screenshots and get an AI score plus concrete, prioritized improvements.',
    points: [
      'Overall score with a visual breakdown',
      'Strengths, red flags & quick wins',
      'Specific, actionable rewrite tips',
    ],
    href: '/profile-review',
    gradient: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-600/20',
  },
  {
    icon: Camera,
    title: 'AI Photo Coach',
    tagline: 'Pick your best shots',
    description:
      'Upload up to 10 photos and get expert per-photo feedback on what works, what to fix, and the ideal order.',
    points: [
      'Per-photo: what works & what to improve',
      '4 styles: Professional, Casual, Adventurous, Artistic',
      'Recommended photo order for your lineup',
    ],
    href: '/ai-photos',
    gradient: 'from-rose-500 to-orange-600',
    glow: 'shadow-rose-600/20',
  },
];

const STATS = [
  { value: '300K+', label: 'Users helped' },
  { value: '3.5x',  label: 'More matches' },
  { value: '<5s',   label: 'Reply time' },
  { value: '100%',  label: 'Free, forever' },
];

const MODELS = [
  { name: 'Kimi K2',             org: 'Moonshot AI', rank: '#11 BridgeBench' },
  { name: 'Qwen 2.5 72B',        org: 'Alibaba',     rank: 'Top 10' },
  { name: 'Llama 3.3 70B',       org: 'Meta',        rank: 'Top 15' },
  { name: 'Llama 3.2 90B Vision', org: 'NVIDIA',     rank: 'Vision Leader' },
];

const TESTIMONIALS = [
  {
    quote:
      'Game changer for introverts. RizzGPT gives me the confidence to keep conversations going. I matched and got a date within a week.',
    name: 'Jordan, 27',
  },
  {
    quote:
      'No more dead-end openers. I used to overthink every message — now I get three great options in 20 seconds and just pick one.',
    name: 'Alex, 31',
  },
  {
    quote:
      'The profile review was brutal in the best way. Fixed my photos and bio, doubled my matches the next weekend. Worth every penny — and it\'s free.',
    name: 'Sam, 24',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">RizzGPT</span>
          </div>
          <div className="hidden md:flex items-center gap-7 text-sm text-zinc-400">
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-4 py-2 rounded-lg transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[130px] animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-[420px] h-[420px] bg-fuchsia-600/15 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '-6s' }} />
          <div className="absolute bottom-0 left-1/4 w-[380px] h-[380px] bg-rose-600/10 rounded-full blur-[110px] animate-blob" style={{ animationDelay: '-12s' }} />
        </div>

        <div className="max-w-6xl mx-auto relative grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-300 mb-6 animate-pulse-glow">
              <Zap className="w-3.5 h-3.5 text-yellow-400" />
              Powered by NVIDIA NIM — top-ranked AI
            </div>

            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black mb-6 leading-[1.05]">
              Land <span className="gradient-text-animated">3.5x more dates</span> with AI that actually works
            </h1>

            <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              AI-crafted replies, bios, profile reviews & photo coaching for every dating app.{' '}
              <span className="text-white font-medium">100% free</span> — no credit card, no catch.
            </p>

            <div className="flex flex-col sm:flex-row items-center lg:items-start lg:justify-start justify-center gap-4">
              <Link
                href="/signup"
                className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-violet-600/25 hover:scale-[1.03]"
              >
                Start for free
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="text-zinc-400 hover:text-white transition-colors text-lg py-4">
                Already have an account?
              </Link>
            </div>

            {/* App marquee */}
            <div className="mt-10 overflow-hidden relative max-w-md mx-auto lg:mx-0 [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
              <div className="flex gap-8 w-max animate-marquee">
                {[...APPS, ...APPS].map((app, i) => (
                  <span key={i} className="text-zinc-600 font-semibold whitespace-nowrap">{app}</span>
                ))}
              </div>
              <p className="text-xs text-zinc-600 mt-3">Works with all major dating apps</p>
            </div>
          </div>

          {/* Real app demo video, framed in a phone */}
          <div className="relative hidden lg:flex justify-center items-center">
            <div className="relative w-[290px] animate-float">
              {/* glow behind phone */}
              <div className="absolute -inset-6 bg-gradient-to-br from-violet-600/30 to-fuchsia-600/30 blur-3xl rounded-full" />
              <div className="relative rounded-[2.6rem] border-[5px] border-zinc-800 bg-zinc-900 p-1.5 shadow-2xl shadow-violet-900/40">
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-zinc-900 rounded-full z-20" />
                <video
                  src="/rizz-hero.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-[2.1rem] w-full block"
                />
              </div>
              {/* floating accent cards */}
              <div className="absolute -left-10 top-20 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 shadow-xl animate-float-slow z-30">
                <div className="flex items-center gap-2 text-xs text-white">
                  <Heart className="w-4 h-4 text-rose-400" /> New match!
                </div>
              </div>
              <div className="absolute -right-8 bottom-24 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 shadow-xl animate-float z-30" style={{ animationDelay: '-3s' }}>
                <div className="flex items-center gap-2 text-xs text-white">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> +60% replies
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-zinc-800/60">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 80}>
              <div className="text-3xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────── */}
      <section id="how" className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="text-sm font-semibold text-violet-400 uppercase tracking-wider">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Three steps to better matches
            </h2>
            <p className="text-zinc-500 mt-3">It&apos;s simple. Upload, generate, send.</p>
          </Reveal>

          <HowItWorks />

          {/* Try it out */}
          <Reveal className="mt-24 text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Try it out!</h2>
            <p className="text-zinc-500 mt-3">See the kind of openers RizzGPT generates from a real profile.</p>
          </Reveal>
          <Reveal>
            <TryItOut />
          </Reveal>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-4 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <span className="text-sm font-semibold text-fuchsia-400 uppercase tracking-wider">Everything included</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Four powerful tools. One free account.
            </h2>
            <p className="text-zinc-500 mt-3">Everything you need to win at dating apps.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={(i % 2) * 120}>
                <div className={`group relative h-full bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${f.glow}`}>
                  <FeatureMockup kind={f.title} />
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center flex-shrink-0`}>
                      <f.icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-xl">{f.title}</h3>
                      <p className="text-sm text-violet-400">{f.tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-5">{f.description}</p>
                  <ul className="space-y-2 mb-6">
                    {f.points.map(p => (
                      <li key={p} className="flex items-start gap-2 text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/signup?next=${f.href}`}
                    className="inline-flex items-center text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors"
                  >
                    Try it free
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-zinc-800/60">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-14">
            <span className="text-sm font-semibold text-rose-400 uppercase tracking-wider">Real results</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              We&apos;ve helped countless users get dates
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={t.name} delay={i * 120}>
                <div className="h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-zinc-600 transition-colors">
                  <Quote className="w-8 h-8 text-violet-500/40 mb-3" />
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed mb-4">{t.quote}</p>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Models ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4 border-t border-zinc-800/60">
        <div className="max-w-4xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-6">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Enterprise-grade AI, completely free
            </div>
            <h2 className="text-3xl font-bold text-white mb-3">
              Powered by the world&apos;s best AI models
            </h2>
            <p className="text-zinc-500 mb-10 max-w-2xl mx-auto">
              We use top-ranked models from NVIDIA NIM — the same infrastructure used by Fortune 500 companies.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MODELS.map((m, i) => (
              <Reveal key={m.name} delay={i * 90}>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left h-full hover:border-violet-700/60 transition-colors">
                  <div className="text-xs text-zinc-500 mb-1">{m.org}</div>
                  <div className="font-semibold text-white text-sm mb-1">{m.name}</div>
                  <div className="text-xs text-violet-400">{m.rank}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-4 border-t border-zinc-800/60">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="text-sm font-semibold text-violet-400 uppercase tracking-wider">FAQ</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2">
              Got questions? We&apos;ve got answers.
            </h2>
          </Reveal>
          <Reveal>
            <FAQ />
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────────── */}
      <section className="py-24 px-4">
        <Reveal className="max-w-2xl mx-auto">
          <div className="relative text-center bg-gradient-to-br from-violet-950/60 to-fuchsia-950/60 border border-violet-800/40 rounded-3xl p-10 overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-72 bg-violet-600/20 rounded-full blur-[90px] animate-blob" />
            <div className="relative">
              <Users className="w-10 h-10 text-violet-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">
                Join 300,000+ users getting more dates
              </h2>
              <p className="text-zinc-400 mb-8">
                Create your free account in 30 seconds. No credit card required.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-violet-600/25 hover:scale-[1.03]"
              >
                Get started free
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800/60 py-8 px-4 text-center text-zinc-600 text-sm">
        © {new Date().getFullYear()} RizzGPT — AI models provided by{' '}
        <a
          href="https://build.nvidia.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-zinc-500 hover:text-zinc-400 transition-colors"
        >
          NVIDIA NIM
        </a>
      </footer>
    </div>
  );
}
