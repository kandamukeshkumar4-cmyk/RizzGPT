'use client';

import { useState } from 'react';
import { FileText, Loader2, Copy, Check, ChevronRight, ChevronLeft, Zap } from 'lucide-react';
import type { Platform, ProfileWriterAnswers, ProfileWriterResponse } from '@/types';

const PLATFORMS: { value: Platform; label: string; icon: string }[] = [
  { value: 'tinder',             label: 'Tinder',              icon: '🔥' },
  { value: 'bumble',             label: 'Bumble',              icon: '🐝' },
  { value: 'hinge',              label: 'Hinge',               icon: '💚' },
  { value: 'coffee_meets_bagel', label: 'Coffee Meets Bagel',  icon: '☕' },
  { value: 'other',              label: 'Other',               icon: '💬' },
];

const HUMOR_OPTIONS = ['Witty / Sarcastic', 'Dad jokes', 'Self-deprecating', 'Dry / Deadpan', 'Absurdist'];
const LOOKING_FOR   = ['Something serious', 'Something casual', 'Not sure yet', 'Friends first', 'Open to anything'];

const STEPS = ['Platform', 'About You', 'Your Vibe', 'Generate'];

type Step = 0 | 1 | 2 | 3;

const EMPTY: ProfileWriterAnswers = {
  occupation: '', hobbies: '', humor: '', lookingFor: '',
  unique: '', funFact: '', age: '', height: '',
};

export default function ProfileWriterPage() {
  const [step,      setStep]    = useState<Step>(0);
  const [platform,  setPlatform] = useState<Platform>('tinder');
  const [answers,   setAnswers]  = useState<ProfileWriterAnswers>(EMPTY);
  const [loading,   setLoading]  = useState(false);
  const [result,    setResult]   = useState<ProfileWriterResponse | null>(null);
  const [error,     setError]    = useState('');
  const [copied,    setCopied]   = useState<number | null>(null);

  function set(key: keyof ProfileWriterAnswers, val: string) {
    setAnswers(prev => ({ ...prev, [key]: val }));
  }

  async function generate() {
    setLoading(true);
    setError('');

    try {
      const res  = await fetch('/api/profile-writer', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ platform, answers }),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }
      setResult(data as ProfileWriterResponse);
      setStep(3);
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  async function copyBio(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  const canNext0 = !!platform;
  const canNext1 = answers.occupation.trim() && answers.hobbies.trim();
  const canNext2 = answers.humor && answers.lookingFor && answers.unique.trim() && answers.funFact.trim();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Writer</h1>
          <p className="text-sm text-zinc-500">6 bio variations that get more matches</p>
        </div>
      </div>

      {/* Progress steps */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
              i < step       ? 'bg-violet-600 text-white' :
              i === step     ? 'bg-violet-600/30 border-2 border-violet-500 text-violet-400' :
                               'bg-zinc-800 text-zinc-600'
            }`}>
              {i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-white' : 'text-zinc-600'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-violet-600' : 'bg-zinc-800'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Platform */}
      {step === 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold text-white">Which app is this bio for?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PLATFORMS.map(p => (
              <button
                key={p.value}
                onClick={() => setPlatform(p.value)}
                className={`flex items-center gap-2 p-4 rounded-xl border text-sm font-medium transition-all ${
                  platform === p.value
                    ? 'border-violet-500 bg-violet-600/20 text-violet-300'
                    : 'border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <span className="text-xl">{p.icon}</span>
                {p.label}
              </button>
            ))}
          </div>
          <NavButtons onNext={() => setStep(1)} canNext={canNext0} />
        </div>
      )}

      {/* Step 1: Occupation & hobbies */}
      {step === 1 && (
        <div className="space-y-5">
          <h2 className="font-semibold text-white">Tell us about yourself</h2>

          <Field
            label="What do you do for work?"
            placeholder="e.g. Software engineer at a startup, nurse, graphic designer"
            value={answers.occupation}
            onChange={v => set('occupation', v)}
          />
          <Field
            label="Hobbies & interests"
            placeholder="e.g. Rock climbing, cooking, bad horror movies, vinyl records"
            value={answers.hobbies}
            onChange={v => set('hobbies', v)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Age (optional)"    placeholder="28"   value={answers.age ?? ''}    onChange={v => set('age', v)}    />
            <Field label="Height (optional)" placeholder={`6'1"`} value={answers.height ?? ''} onChange={v => set('height', v)} />
          </div>
          <NavButtons onBack={() => setStep(0)} onNext={() => setStep(2)} canNext={!!canNext1} />
        </div>
      )}

      {/* Step 2: Vibe */}
      {step === 2 && (
        <div className="space-y-5">
          <h2 className="font-semibold text-white">Your personality & goals</h2>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Humor style</label>
            <div className="flex flex-wrap gap-2">
              {HUMOR_OPTIONS.map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => set('humor', h)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    answers.humor === h
                      ? 'border-violet-500 bg-violet-600/20 text-violet-300'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">What are you looking for?</label>
            <div className="flex flex-wrap gap-2">
              {LOOKING_FOR.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set('lookingFor', l)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    answers.lookingFor === l
                      ? 'border-fuchsia-500 bg-fuchsia-600/20 text-fuchsia-300'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <Field
            label="What makes you unique or interesting?"
            placeholder="e.g. I've visited 40 countries, I can solve a Rubik's cube in 30s"
            value={answers.unique}
            onChange={v => set('unique', v)}
            multiline
          />
          <Field
            label="Fun fact about yourself"
            placeholder="e.g. I once accidentally became a local celebrity in a small town in Italy"
            value={answers.funFact}
            onChange={v => set('funFact', v)}
            multiline
          />

          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          <NavButtons
            onBack={() => setStep(1)}
            onNext={generate}
            nextLabel={loading ? 'Generating…' : 'Generate 6 bios'}
            nextIcon={loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            canNext={!!canNext2 && !loading}
          />
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && result && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Your 6 bio variations</h2>
            <button
              onClick={() => { setStep(0); setResult(null); setAnswers(EMPTY); }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Start over
            </button>
          </div>

          {result.bios.map((bio, i) => (
            <div key={i} className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 transition-all">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-fuchsia-600/30 text-fuchsia-400 text-xs flex items-center justify-center font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-zinc-200 text-sm leading-relaxed whitespace-pre-wrap">{bio}</p>
                </div>
                <button
                  onClick={() => copyBio(bio, i)}
                  className="flex-shrink-0 p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100"
                >
                  {copied === i
                    ? <Check className="w-4 h-4 text-emerald-400" />
                    : <Copy className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>
          ))}

          <div className="text-xs text-zinc-600 text-center pt-2">
            {result.usage.remaining} requests remaining today
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function Field({
  label, placeholder, value, onChange, multiline,
}: {
  label: string; placeholder: string; value: string;
  onChange: (v: string) => void; multiline?: boolean;
}) {
  const cls = 'w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none transition-colors text-sm';
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-400 mb-1.5">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

function NavButtons({
  onBack, onNext, nextLabel = 'Next', nextIcon, canNext,
}: {
  onBack?:   () => void;
  onNext?:   () => void;
  nextLabel?: string;
  nextIcon?:  React.ReactNode;
  canNext:   boolean;
}) {
  return (
    <div className="flex gap-3 pt-2">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600 text-sm transition-all"
        >
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      )}
      {onNext && (
        <button
          type="button"
          onClick={onNext}
          disabled={!canNext}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl text-sm transition-all"
        >
          {nextIcon} {nextLabel} {!nextIcon && <ChevronRight className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}
