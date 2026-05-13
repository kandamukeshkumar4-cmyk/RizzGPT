import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'integrate.api.nvidia.com' },
    ],
  },
  // SECURITY: NVIDIA_API_KEY has no NEXT_PUBLIC_ prefix
  // → it is NEVER included in client-side JS bundles by Next.js
  // → accessible only via process.env.NVIDIA_API_KEY in API routes
};

export default nextConfig;
