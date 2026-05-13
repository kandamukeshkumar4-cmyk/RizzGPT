'use client';

import { useState, useCallback } from 'react';
import { useDropzone }           from 'react-dropzone';
import { Camera, Upload, Loader2, Zap, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { fileToBase64 } from '@/lib/utils';
import type { PhotoStyle } from '@/types';

const STYLES: { value: PhotoStyle; label: string; emoji: string; desc: string }[] = [
  { value: 'professional', label: 'Professional', emoji: '💼', desc: 'LinkedIn-ready headshots' },
  { value: 'casual',       label: 'Casual',       emoji: '😎', desc: 'Natural & approachable'  },
  { value: 'adventurous',  label: 'Adventurous',  emoji: '🏔️', desc: 'Outdoor & lifestyle'     },
  { value: 'artistic',     label: 'Artistic',     emoji: '🎨', desc: 'Creative & moody'        },
];

type PhotoAnalysis = {
  photo:   number;
  works:   string;
  improve: string;
  useIt:   string;
  order?:  number;
};

type AnalysisResult = {
  analysis: {
    photoAnalysis?: PhotoAnalysis[];
    tips?:          string[];
    rawFeedback?:   string;
  };
  model: string;
  usage: { used: number; limit: number; remaining: number; resetsAt: string };
};

export default function AIPhotosPage() {
  const [style,   setStyle]   = useState<PhotoStyle>('casual');
  const [files,   setFiles]   = useState<File[]>([]);
  const [prev,    setPrev]    = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<AnalysisResult | null>(null);
  const [error,   setError]   = useState('');

  const onDrop = useCallback((accepted: File[]) => {
    const combined = [...files, ...accepted].slice(0, 10);
    setFiles(combined);
    setPrev(combined.map(f => URL.createObjectURL(f)));
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 10,
  });

  function removeFile(i: number) {
    setFiles(f => f.filter((_, idx) => idx !== i));
    setPrev(p => p.filter((_, idx) => idx !== i));
  }

  async function handleAnalyze() {
    if (files.length === 0) { setError('Upload at least one photo'); return; }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const photos = await Promise.all(files.map(fileToBase64));

      const res  = await fetch('/api/ai-photos', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ style, photos }),
      });

      const data = await res.json();
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return; }
      setResult(data as AnalysisResult);
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
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 flex items-center justify-center">
          <Camera className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">AI Photo Coach</h1>
          <p className="text-sm text-zinc-500">Expert feedback on your dating profile photos</p>
        </div>
      </div>

      {!result ? (
        <div className="space-y-5">
          {/* Style selector */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Target style</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STYLES.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border text-sm transition-all ${
                    style === s.value
                      ? 'border-rose-500 bg-rose-600/20 text-rose-300'
                      : 'border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600'
                  }`}
                >
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="font-medium">{s.label}</span>
                  <span className="text-xs opacity-70 text-center">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">
              Upload photos <span className="text-zinc-600">(1–10 photos)</span>
            </label>

            {prev.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
                {prev.map((p, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-800 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFile(i)}
                      className="absolute top-1.5 right-1.5 w-5 h-5 bg-black/70 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-white" />
                    </button>
                    <div className="absolute bottom-1 left-1 bg-black/60 rounded text-xs text-white px-1">
                      #{i + 1}
                    </div>
                  </div>
                ))}
                {prev.length < 10 && (
                  <div
                    {...getRootProps()}
                    className="aspect-square rounded-xl border-2 border-dashed border-zinc-700 flex items-center justify-center cursor-pointer hover:border-zinc-500 transition-colors"
                  >
                    <input {...getInputProps()} />
                    <Upload className="w-5 h-5 text-zinc-500" />
                  </div>
                )}
              </div>
            )}

            {prev.length === 0 && (
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${
                  isDragActive ? 'border-rose-500 bg-rose-600/10' : 'border-zinc-700 hover:border-zinc-500'
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                <p className="text-sm text-zinc-400">Drop photos here or click to upload</p>
                <p className="text-xs text-zinc-600 mt-1">PNG, JPG — up to 10 photos</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800 rounded-xl px-4 py-3 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || files.length === 0}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-all text-sm"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing {files.length} photo{files.length !== 1 ? 's' : ''}…</>
              : <><Zap className="w-4 h-4" /> Analyze photos</>
            }
          </button>
        </div>
      ) : (
        <PhotoResults result={result} previews={prev} onReset={() => { setResult(null); setFiles([]); setPrev([]); }} />
      )}
    </div>
  );
}

function PhotoResults({
  result, previews, onReset,
}: { result: AnalysisResult; previews: string[]; onReset: () => void }) {
  const { analysis } = result;
  const photoAnalysis = analysis.photoAnalysis ?? [];
  const tips          = analysis.tips ?? [];

  const useItColor = (useIt: string) => {
    if (useIt === 'yes')   return 'text-emerald-400 bg-emerald-950/50 border-emerald-800';
    if (useIt === 'no')    return 'text-red-400 bg-red-950/50 border-red-800';
    return 'text-yellow-400 bg-yellow-950/50 border-yellow-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-white">Photo Analysis</h2>
        <button onClick={onReset} className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
          Analyze new photos
        </button>
      </div>

      {photoAnalysis.length > 0 ? (
        <div className="space-y-4">
          {photoAnalysis.map((pa, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
              <div className="flex items-start gap-4 p-4">
                {previews[pa.photo - 1] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previews[pa.photo - 1]}
                    alt={`Photo ${pa.photo}`}
                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">Photo {pa.photo}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium capitalize ${useItColor(pa.useIt)}`}>
                      {pa.useIt === 'yes' ? '✓ Use it' : pa.useIt === 'no' ? '✗ Skip' : '? Maybe'}
                    </span>
                    {pa.order && (
                      <span className="text-xs text-zinc-500">Position #{pa.order}</span>
                    )}
                  </div>

                  {pa.works && (
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-400 leading-relaxed">{pa.works}</p>
                    </div>
                  )}
                  {pa.improve && (
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-3.5 h-3.5 text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-zinc-400 leading-relaxed">{pa.improve}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : analysis.rawFeedback ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{analysis.rawFeedback}</p>
        </div>
      ) : null}

      {tips.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-white mb-3">📸 Pro Tips for Better Photos</h3>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-rose-600/30 text-rose-400 text-xs flex items-center justify-center font-bold mt-0.5">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-xs text-zinc-600 text-center">
        {result.usage.remaining} requests remaining today
      </div>
    </div>
  );
}
