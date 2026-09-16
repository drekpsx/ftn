import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { Shield } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-gray-900">
            <Shield className="h-5 w-5 text-brand-600" /> FlowDevis Admin
          </div>
          <nav className="flex gap-4 text-sm font-medium text-gray-600">
            <Link href="/admin">Vue d&apos;ensemble</Link>
            <Link href="/admin/utilisateurs">Utilisateurs</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
