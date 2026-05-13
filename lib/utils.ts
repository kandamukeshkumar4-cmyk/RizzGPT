import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Convert a File to base64 string (no compression) */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
}

/**
 * Convert a File to a compressed base64 JPEG string.
 * Resizes to maxDim × maxDim (preserving aspect ratio) and re-encodes as JPEG.
 * Typical result: < 200 KB even for 12 MP photos — safe for JSON request bodies.
 */
export function fileToCompressedBase64(
  file: File,
  maxDim = 1024,
  quality = 0.82,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate target dimensions
      let { width, height } = img;
      if (width > maxDim || height > maxDim) {
        if (width >= height) {
          height = Math.round((height / width)  * maxDim);
          width  = maxDim;
        } else {
          width  = Math.round((width  / height) * maxDim);
          height = maxDim;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(dataUrl.split(',')[1]); // return only the base64 part
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

/** Format large numbers (e.g. 300000 → "300K") */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

/** Score colour: red → yellow → green */
export function scoreColor(score: number): string {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
}

export function scorePathColor(score: number): string {
  if (score >= 70) return '#34d399'; // emerald-400
  if (score >= 40) return '#facc15'; // yellow-400
  return '#f87171';                  // red-400
}
