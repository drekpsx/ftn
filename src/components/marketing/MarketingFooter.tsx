import Link from 'next/link';

export function MarketingFooter() {
  return (
    <footer className="border-t border-gray-100 bg-white py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-gray-500 sm:flex-row">
        <p>© {new Date().getFullYear()} FlowDevis. Tous droits réservés.</p>
        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-gray-800">
            Confidentialité
          </Link>
          <Link href="/terms" className="hover:text-gray-800">
            Conditions générales
          </Link>
        </div>
      </div>
    </footer>
  );
}
