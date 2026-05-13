import Link from 'next/link';
import {
  MessageCircle, FileText, Star, Camera,
  Zap, Shield, Users, ChevronRight, Sparkles
} from 'lucide-react';

const FEATURES = [
  {
    icon: MessageCircle,
    title: 'Chat Assistant',
    description: 'Paste a conversation or screenshot — get 3 perfect replies in seconds.',
    href: '/chat',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: FileText,
    title: 'Profile Writer',
    description: 'Answer 6 quick questions. Get 6 bio variations that actually get matches.',
    href: '/profile-writer',
    gradient: 'from-fuchsia-500 to-pink-600',
  },
  {
    icon: Star,
    title: 'Profile Review',
    description: 'Upload your profile for an AI-powered score and actionable improvement tips.',
    href: '/profile-review',
    gradient: 'from-pink-500 to-rose-600',
  },
  {
    icon: Camera,
    title: 'AI Photo Coach',
    description: 'Get expert feedback on your photos — which to use, how to pose, what to fix.',
    href: '/ai-photos',
    gradient: 'from-rose-500 to-orange-600',
  },
];

const STATS = [
  { value: '300K+', label: 'Users helped' },
  { value: '60%',   label: 'More matches' },
  { value: '<5s',   label: 'Reply time'   },
  { value: '100%',  label: 'Free'         },
];

const MODELS = [
  { name: 'Kimi K2',    org: 'Moonshot AI', rank: '#11 BridgeBench' },
  { name: 'Qwen 2.5 72B', org: 'Alibaba',  rank: 'Top 10'           },
  { name: 'Llama 3.3 70B', org: 'Meta',    rank: 'Top 15'           },
  { name: 'Llama 3.2 90B Vision', org: 'NVIDIA', rank: 'Vision Leader' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 overflow-hidden">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg text-white">RizzGPT</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-white transition-colors px-3 py-1.5"
            >
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

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-4">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-fuchsia-600/15 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-300 mb-6">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            Powered by NVIDIA NIM — top-ranked AI models
          </div>

          <h1 className="text-5xl sm:text-7xl font-black mb-6 leading-tight">
            Date smarter with{' '}
            <span className="gradient-text">AI that actually works</span>
          </h1>

          <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            AI-powered replies, bios, profile reviews & photo coaching.
            <br />
            <span className="text-white font-medium">100% free</span> for all users.
            No credit card. No catch.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/signup"
              className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-violet-600/25"
            >
              Start for free
              <ChevronRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="text-zinc-400 hover:text-white transition-colors text-lg"
            >
              Already have an account?
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-zinc-800/60">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-sm text-zinc-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Everything you need to win at dating apps
            </h2>
            <p className="text-zinc-500">Four powerful tools. One account. Zero cost.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map(f => (
              <Link
                key={f.title}
                href={`/signup?next=${f.href}`}
                className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-4`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{f.description}</p>
                <div className="mt-4 flex items-center text-violet-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it free <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI Models ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 border-t border-zinc-800/60">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-zinc-800/80 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-6">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Enterprise-grade AI, completely free
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">
            Powered by the world&apos;s best AI models
          </h2>
          <p className="text-zinc-500 mb-10">
            We use top-ranked models from NVIDIA NIM — the same infrastructure used by Fortune 500 companies.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {MODELS.map(m => (
              <div
                key={m.name}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-left"
              >
                <div className="text-xs text-zinc-500 mb-1">{m.org}</div>
                <div className="font-semibold text-white text-sm mb-1">{m.name}</div>
                <div className="text-xs text-violet-400">{m.rank}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-violet-950/50 to-fuchsia-950/50 border border-violet-800/40 rounded-3xl p-10">
          <Users className="w-10 h-10 text-violet-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">
            Join 300,000+ users getting more dates
          </h2>
          <p className="text-zinc-400 mb-8">
            Create your free account in 30 seconds. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all shadow-lg shadow-violet-600/25"
          >
            Get started free
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
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
