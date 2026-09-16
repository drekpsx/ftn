import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSessionUser } from '@/lib/auth';
import { Logo } from '@/components/Logo';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== 'ADMIN') redirect('/dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-100 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="badge bg-gray-100 text-gray-500">Admin</span>
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
