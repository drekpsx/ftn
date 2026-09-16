'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  Users,
  Package,
  ListChecks,
  Globe,
  Zap,
  BarChart3,
  Settings,
  CreditCard,
  Menu,
  X,
  LogOut,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { NotificationsBell } from './NotificationsBell';

const NAV = [
  { href: '/dashboard', label: 'Accueil', icon: LayoutDashboard },
  { href: '/dashboard/demandes', label: 'Demandes', icon: Inbox },
  { href: '/dashboard/devis', label: 'Devis', icon: FileText },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/prestations', label: 'Prestations', icon: Package },
  { href: '/dashboard/formulaire', label: 'Formulaire', icon: ListChecks },
  { href: '/dashboard/page-publique', label: 'Page publique', icon: Globe },
  { href: '/dashboard/automatisations', label: 'Automatisations', icon: Zap },
  { href: '/dashboard/statistiques', label: 'Statistiques', icon: BarChart3 },
  { href: '/dashboard/parametres', label: 'Paramètres', icon: Settings },
  { href: '/dashboard/abonnement', label: 'Abonnement', icon: CreditCard },
];

export function DashboardShell({
  children,
  businessName,
  slug,
}: {
  children: React.ReactNode;
  businessName: string;
  slug: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavLinks = (
    <nav className="flex flex-1 flex-col gap-1 px-3">
      {NAV.map((item) => {
        const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              active ? 'bg-brand-50 text-brand-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-4.5 w-4.5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 lg:flex">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col border-r border-gray-100 bg-white lg:flex">
        <div className="flex items-center gap-2 px-5 py-5">
          <Sparkles className="h-6 w-6 text-brand-600" />
          <span className="text-lg font-bold text-gray-900">FlowDevis</span>
        </div>
        {NavLinks}
        <div className="border-t border-gray-100 p-3">
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <ExternalLink className="h-4.5 w-4.5" /> Voir ma page
          </a>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <LogOut className="h-4.5 w-4.5" /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-brand-600" />
          <span className="font-bold text-gray-900">FlowDevis</span>
        </div>
        <div className="flex items-center gap-2">
          <NotificationsBell />
          <button onClick={() => setMobileOpen(true)} className="btn-ghost px-2" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="relative flex w-72 flex-col bg-white pb-4">
            <div className="flex items-center justify-between px-5 py-5">
              <span className="text-lg font-bold">FlowDevis</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {NavLinks}
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="mx-3 mt-3 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              <LogOut className="h-4.5 w-4.5" /> Déconnexion
            </button>
          </div>
        </div>
      )}

      <div className="flex-1">
        <div className="hidden items-center justify-between border-b border-gray-100 bg-white px-8 py-4 lg:flex">
          <p className="text-sm text-gray-500">{businessName}</p>
          <NotificationsBell />
        </div>
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
