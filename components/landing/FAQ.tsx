'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'Is RizzGPT really free?',
    a: 'Yes — every tool is 100% free. No credit card, no trial timer, no hidden upsell. You get a generous daily quota across all four tools just by creating an account.',
  },
  {
    q: 'Which dating apps does it work with?',
    a: 'All of them. Tinder, Bumble, Hinge, Coffee Meets Bagel, OkCupid and more. Paste text or upload a screenshot from any app and the AI adapts to that platform\'s style.',
  },
  {
    q: 'Can it read screenshots of my conversations?',
    a: 'Yes. The Chat Assistant, Profile Review and Photo Coach all accept image uploads. We use vision-capable AI models to read screenshots and photos directly — no manual typing needed.',
  },
  {
    q: 'What AI powers the replies?',
    a: 'Top-ranked open models served through NVIDIA NIM — including Kimi K2, Qwen 2.5 72B, Llama 3.3 70B and Llama 3.2 90B Vision. The same enterprise infrastructure used by Fortune 500 companies.',
  },
  {
    q: 'Is my data private?',
    a: 'Your screenshots and conversations are only used to generate your results in that moment. We don\'t sell your data or train models on your private chats.',
  },
  {
    q: 'Will the other person know I used AI?',
    a: 'No. Replies are written to sound like you — natural, casual and on-tone. You pick the vibe (flirty, funny, friendly or formal) and tweak before sending.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="max-w-2xl mx-auto space-y-3">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-colors hover:border-zinc-700"
          >
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-medium text-white text-sm sm:text-base">{f.q}</span>
              <ChevronDown
                className={`w-5 h-5 flex-shrink-0 text-violet-400 transition-transform duration-300 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{f.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
