import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export function MarketingHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 text-brand-700">
          <Sparkles className="h-6 w-6" />
          <span className="text-lg font-bold">FlowDevis</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-600 sm:flex">
          <a href="#fonctionnalites" className="hover:text-gray-900">
            Fonctionnalités
          </a>
          <a href="#metiers" className="hover:text-gray-900">
            Métiers
          </a>
          <a href="#tarifs" className="hover:text-gray-900">
            Tarifs
          </a>
          <a href="#faq" className="hover:text-gray-900">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/connexion" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Connexion
          </Link>
          <Link href="/inscription" className="btn-primary">
            Commencer gratuitement
          </Link>
        </div>
      </div>
    </header>
  );
}
