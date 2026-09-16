import type { Metadata } from 'next';
import './globals.css';
import { SessionProvider } from '@/components/SessionProvider';

export const metadata: Metadata = {
  title: 'FlowDevis — Vos demandes. Vos devis. Vos clients. Un seul endroit.',
  description:
    'Transformez vos demandes Instagram, TikTok et Facebook en devis et en clients, sans perdre de temps dans les DM.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
