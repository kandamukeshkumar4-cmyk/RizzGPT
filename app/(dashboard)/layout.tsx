import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/Navbar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <Navbar user={user} />
      <main className="flex-1 ml-0 md:ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8 pt-20 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
