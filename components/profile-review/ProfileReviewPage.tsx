'use client';

import { useState, useCallback } from 'react';
import { useDropzone }           from 'react-dropzone';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  Star, Upload, Loader2, Zap, X, AlertTriangle,
  CheckCircle2, TrendingUp, Camera, FileText
} from 'lucide-react';
import { fileToBase64, scorePathColor } from '@/lib/utils';
import type { ProfileReviewResponse } from '@/types';

const PLATFORMS = ['Tinder','Bumble','Hinge','Coffee Meets Bagel','OkCupid','Other'];

export default function ProfileReviewPage() {
  const [platform,   setPlatform]   = useState('Tinder');
  const [files,      setFiles]      = useState<File[]>([]);
  const [previews,   setPreviews]   = useState<string[]>([]);
  const [bioText,    setBioText]    = useState('');
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState<ProfileReviewResponse | null>(null);
  const [error,      setError]      = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const combined = [...files, ...accepted].slice(0, 6);
    setFiles(combined);
    setPreviews(combined.map(f => URL.createObjectURL(f)));
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 6,
  });

  function removeFile(i: number) {
    const f = files.filter((_, idx) => idx !== i);
    const p = previews.filter((_, idx) => idx !== i);
    setFiles(f);
    setPreviews(p);
  }

  async function handleReview() {
    if (files.length === 0 && !bioText.trim()) {
      setError('Upload at least one screenshot or paste your bio text');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const imageBase64s = await Promise.all(files.map(fileToBase64));

      const res  = await fetch('/api/profile-review', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          platform,
          profileDescription: bioText || `Profile screenshots provided for ${platform}`,
          imageBase64s: imageBase64s.length > 0 ? imageBase64s : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }
      setResult(data as ProfileReviewResponse);
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
          <Star className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Profile Review</h1>
          <p className="text-sm text-zinc-500">AI-powered score & actionable improvements</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-5">
          {/* Platform */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Platform</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                    platform === p
                      ? 'border-pink-500 bg-pink-600/20 text-pink-300'
                      : 'border-zinc-700 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Screenshot upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Upload profile screenshots <span className="text-zinc-600">(up to 6)</span>
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                {previews.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-lg overflow-hidden bg-zinc-800 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
                {previews.length < 6 && (
                  <div {...getRootProps()} className="aspect-square rounded-lg border-2 border-dashed border-zinc-700 flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors">
                    <input {...getInputProps()} />
                    <Upload className="w-5 h-5 text-zinc-500" />
                  </div>
                )}
              </div>
            )}

            {previews.length === 0 && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-pink-500 bg-pink-600/10'
                    : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Drop screenshots here or click to upload</p>
                <p className="text-xs text-zinc-600 mt-1">PNG, JPG up to 10 MB each</p>
              </div>
            )}
          </div>

          {/* Bio text */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Paste your bio text <span className="text-zinc-600">(optional — adds more detail)</span>
            </label>
            <textarea
              value={bioText}
              onChange={e => setBioText(e.target.value)}
              placeholder="Paste your current dating bio here..."
              rows={4}
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-pink-500 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none resize-none transition-colors text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-400">{error}</div>
          )}

          <button
            onClick={handleReview}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing your profile…</>
              : <><Zap className="w-4 h-4" /> Review my profile</>
            }
          </button>
        </div>
      ) : (
        <ReviewResults result={result} onReset={() => setResult(null)} />
      )}
    </div>
  );
}

function ReviewResults({ result, onReset }: { result: ProfileReviewResponse; onReset: () => void }) {
  const { scores, feedback, summary } = result;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Your results</h2>
        <button onClick={onReset} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          Review another
        </button>
      </div>

      {/* Score gauges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Overall',  value: scores.overall },
          { label: 'Photos',   value: scores.photos  },
          { label: 'Bio',      value: scores.bio     },
          { label: 'Prompts',  value: scores.prompts },
        ].map(s => (
          <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col items-center gap-2">
            <div className="w-20 h-20">
              <CircularProgressbar
                value={s.value}
                text={`${s.value}`}
                styles={buildStyles({
                  pathColor:  scorePathColor(s.value),
                  textColor:  '#fff',
                  trailColor: '#27272a',
                  textSize:   '28px',
                })}
              />
            </div>
            <span className="text-xs font-medium text-zinc-400">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <p className="text-sm text-zinc-300 leading-relaxed">{summary}</p>
      </div>

      {/* Red flags */}
      {feedback.redFlags.length > 0 && (
        <Section icon={<AlertTriangle className="w-4 h-4 text-red-400" />} title="Red Flags" color="red">
          {feedback.redFlags.map((item, i) => (
            <ListItem key={i} text={item} color="red" />
          ))}
        </Section>
      )}

      {/* Strengths */}
      {feedback.strengths.length > 0 && (
        <Section icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />} title="Strengths" color="emerald">
          {feedback.strengths.map((item, i) => (
            <ListItem key={i} text={item} color="emerald" />
          ))}
        </Section>
      )}

      {/* Recommendations */}
      {feedback.recommendations.length > 0 && (
        <Section icon={<TrendingUp className="w-4 h-4 text-violet-400" />} title="Top Recommendations" color="violet">
          {feedback.recommendations.map((item, i) => (
            <ListItem key={i} text={item} color="violet" />
          ))}
        </Section>
      )}

      {/* Photo & bio tips */}
      <div className="grid sm:grid-cols-2 gap-4">
        {feedback.photoTips.length > 0 && (
          <Section icon={<Camera className="w-4 h-4 text-blue-400" />} title="Photo Tips" color="blue">
            {feedback.photoTips.map((item, i) => <ListItem key={i} text={item} color="blue" />)}
          </Section>
        )}
        {feedback.bioTips.length > 0 && (
          <Section icon={<FileText className="w-4 h-4 text-fuchsia-400" />} title="Bio Tips" color="fuchsia">
            {feedback.bioTips.map((item, i) => <ListItem key={i} text={item} color="fuchsia" />)}
          </Section>
        )}
      </div>

      <div className="text-xs text-zinc-600 text-center">
        {result.usage.remaining} requests remaining today
      </div>
    </div>
  );
}

type Color = 'red' | 'emerald' | 'violet' | 'blue' | 'fuchsia';

const BG_MAP: Record<Color, string> = {
  red:     'bg-red-950/40 border-red-900/40',
  emerald: 'bg-emerald-950/40 border-emerald-900/40',
  violet:  'bg-violet-950/40 border-violet-900/40',
  blue:    'bg-blue-950/40 border-blue-900/40',
  fuchsia: 'bg-fuchsia-950/40 border-fuchsia-900/40',
};
const DOT_MAP: Record<Color, string> = {
  red:     'bg-red-500',
  emerald: 'bg-emerald-500',
  violet:  'bg-violet-500',
  blue:    'bg-blue-500',
  fuchsia: 'bg-fuchsia-500',
};

function Section({ icon, title, color, children }: {
  icon: React.ReactNode; title: string; color: Color; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-xl border p-4 space-y-2 ${BG_MAP[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-semibold text-white">{title}</span>
      </div>
      {children}
    </div>
  );
}

function ListItem({ text, color }: { text: string; color: Color }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${DOT_MAP[color]}`} />
      <span className="text-sm text-zinc-300 leading-relaxed">{text}</span>
    </div>
  );
}
