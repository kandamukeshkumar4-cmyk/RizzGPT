'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import {
  MessageCircle, FileText, Star, Camera,
  Sparkles, LogOut, Menu, X, Zap
} from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { UsageSummary } from '@/types';

const NAV_ITEMS = [
  { label: 'Chat Assistant',  href: '/chat',           icon: MessageCircle },
  { label: 'Profile Writer',  href: '/profile-writer', icon: FileText      },
  { label: 'Profile Review',  href: '/profile-review', icon: Star          },
  { label: 'AI Photo Coach',  href: '/ai-photos',      icon: Camera        },
];

export default function Navbar({ user }: { user: User }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open,   setOpen]  = useState(false);
  const [usage,  setUsage] = useState<UsageSummary | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetch('/api/usage')
      .then(r => r.json())
      .then(setUsage)
      .catch(() => null);
  }, [pathname]); // re-fetch after each navigation

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const displayName =
    user.user_metadata?.display_name ||
    user.email?.split('@')[0] ||
    'User';

  const usagePct = usage ? (usage.used / usage.limit) * 100 : 0;

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-50 h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4">
        <Link href="/chat" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">RizzGPT</span>
        </Link>
        <button onClick={() => setOpen(v => !v)} className="text-zinc-400 hover:text-white p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* ── Mobile drawer ──────────────────────────────────────────────────── */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="absolute left-0 top-0 h-full w-72 bg-zinc-900 border-r border-zinc-800 p-6 pt-20"
            onClick={e => e.stopPropagation()}
          >
            <NavContent
              pathname={pathname}
              displayName={displayName}
              email={user.email ?? ''}
              usage={usage}
              usagePct={usagePct}
              onSignOut={handleSignOut}
              onNavClick={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Desktop sidebar ────────────────────────────────────────────────── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-zinc-900/80 border-r border-zinc-800 flex-col p-6 backdrop-blur-md z-30">
        <Link href="/chat" className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-white">RizzGPT</span>
        </Link>

        <NavContent
          pathname={pathname}
          displayName={displayName}
          email={user.email ?? ''}
          usage={usage}
          usagePct={usagePct}
          onSignOut={handleSignOut}
        />
      </aside>
    </>
  );
}

function NavContent({
  pathname, displayName, email, usage, usagePct, onSignOut, onNavClick,
}: {
  pathname:    string;
  displayName: string;
  email:       string;
  usage:       UsageSummary | null;
  usagePct:    number;
  onSignOut:   () => void;
  onNavClick?: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Nav items */}
      <nav className="space-y-1 flex-1">
        {NAV_ITEMS.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active
                  ? 'bg-violet-600/20 text-violet-300 border border-violet-700/50'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${active ? 'text-violet-400' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Usage meter */}
      <div className="mt-6 bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/40">
        <div className="flex items-center gap-1.5 mb-2">
          <Zap className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs font-medium text-zinc-300">Daily Usage</span>
          <span className="ml-auto text-xs text-zinc-500">
            {usage ? `${usage.used}/${usage.limit}` : '…'}
          </span>
        </div>
        <div className="w-full bg-zinc-700 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              usagePct >= 90 ? 'bg-red-500' :
              usagePct >= 70 ? 'bg-yellow-500' :
                               'bg-violet-500'
            }`}
            style={{ width: `${Math.min(usagePct, 100)}%` }}
          />
        </div>
        {usage && usage.remaining <= 5 && (
          <p className="text-xs text-yellow-400 mt-1.5">
            {usage.remaining} requests remaining today
          </p>
        )}
      </div>

      {/* User + sign out */}
      <div className="mt-4 pt-4 border-t border-zinc-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {displayName[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-white truncate">{displayName}</div>
            <div className="text-xs text-zinc-500 truncate">{email}</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 text-sm text-zinc-500 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}
