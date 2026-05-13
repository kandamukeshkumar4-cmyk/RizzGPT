'use client';

import { useState, useRef } from 'react';
import {
  MessageCircle, Upload, Copy, Check, Loader2,
  ImageIcon, X, Zap, ChevronDown
} from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';
import type { Tone, ChatResponse } from '@/types';

const TONES: { value: Tone; label: string; emoji: string; desc: string }[] = [
  { value: 'flirty',   label: 'Flirty',   emoji: '😏', desc: 'Playful & charming'  },
  { value: 'funny',    label: 'Funny',    emoji: '😂', desc: 'Humor-first replies'  },
  { value: 'friendly', label: 'Friendly', emoji: '😊', desc: 'Warm & approachable'  },
  { value: 'formal',   label: 'Formal',   emoji: '🎩', desc: 'Confident & polished' },
];

export default function ChatPage() {
  const [inputText,  setInputText]  = useState('');
  const [tone,       setTone]       = useState<Tone>('flirty');
  const [imageFile,  setImageFile]  = useState<File | null>(null);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState<ChatResponse | null>(null);
  const [error,      setError]      = useState('');
  const [copied,     setCopied]     = useState<number | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function removeImage() {
    setImageFile(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inputText.trim() && !imageFile) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      let imageBase64: string | undefined;
      if (imageFile) {
        imageBase64 = await fileToBase64(imageFile);
      }

      const res = await fetch('/api/chat', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          inputText:       inputText.trim() || undefined,
          inputImageBase64: imageBase64,
          tone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong');
        return;
      }

      setResult(data as ChatResponse);
    } catch {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  async function copyReply(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Chat Assistant</h1>
            <p className="text-sm text-zinc-500">Get 3 perfect replies in seconds</p>
          </div>
        </div>
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tone selector */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">Select tone</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TONES.map(t => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTone(t.value)}
                className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-sm transition-all ${
                  tone === t.value
                    ? 'border-violet-500 bg-violet-600/20 text-violet-300'
                    : 'border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                }`}
              >
                <span className="text-xl">{t.emoji}</span>
                <span className="font-medium">{t.label}</span>
                <span className="text-xs opacity-70">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Text input */}
        <div>
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            Paste conversation or profile text
          </label>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Paste their message, bio, or a recent conversation here..."
            rows={5}
            className="w-full bg-zinc-800 border border-zinc-700 focus:border-violet-500 rounded-xl px-4 py-3 text-white placeholder-zinc-600 outline-none resize-none transition-colors text-sm"
          />
        </div>

        {/* Screenshot upload */}
        <div className="flex items-center gap-3">
          <div className="flex-1 border border-dashed border-zinc-700 rounded-xl p-4 text-center hover:border-zinc-500 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
            {preview ? (
              <div className="relative inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Screenshot" className="max-h-32 rounded-lg mx-auto" />
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); removeImage(); }}
                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-1 text-zinc-500 py-2">
                <ImageIcon className="w-6 h-6" />
                <span className="text-sm">Upload screenshot (optional)</span>
                <span className="text-xs">JPG, PNG up to 10 MB</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!inputText.trim() && !imageFile)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
        >
          {loading
            ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating replies…</>
            : <><Zap className="w-4 h-4" /> Generate 3 replies</>
          }
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-400">Your replies</h2>
            <span className="text-xs text-zinc-600 bg-zinc-800 px-2 py-1 rounded-full">
              {result.model.split('/').pop()}
            </span>
          </div>

          {result.replies.map((reply, i) => (
            <div
              key={i}
              className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-4 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600/30 text-violet-400 text-xs flex items-center justify-center font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-white text-sm leading-relaxed">{reply}</p>
                </div>
                <button
                  onClick={() => copyReply(reply, i)}
                  className="flex-shrink-0 p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all opacity-0 group-hover:opacity-100"
                  title="Copy to clipboard"
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
