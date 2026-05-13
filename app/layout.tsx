import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RizzGPT — AI Dating Assistant',
  description:
    'Get more matches and better dates with AI-powered conversation starters, profile writing, and profile reviews. Powered by NVIDIA NIM.',
  keywords: ['dating app', 'AI dating', 'dating profile', 'conversation starter', 'rizz'],
  openGraph: {
    title: 'RizzGPT — AI Dating Assistant',
    description: 'Get more matches with AI-powered dating tools.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
