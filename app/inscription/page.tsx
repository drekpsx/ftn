'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { AuthCard } from '@/components/AuthCard';
import { FormError } from '@/components/FormError';

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.');
        return;
      }

      const loginRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });
      if (loginRes?.error) {
        router.push('/connexion');
        return;
      }
      router.push('/onboarding');
    } catch {
      setError('Impossible de contacter le serveur. Réessayez.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Créez votre compte"
      subtitle="Commencez gratuitement, sans carte bancaire."
      footer={
        <>
          Déjà inscrit ?{' '}
          <Link href="/connexion" className="font-medium text-brand-700 hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <FormError message={error} />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Prénom</label>
            <input
              className="input"
              required
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            />
          </div>
          <div>
            <label className="label">Nom</label>
            <input
              className="input"
              required
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div>
          <label className="label">Mot de passe</label>
          <input
            type="password"
            className="input"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <p className="mt-1 text-xs text-gray-400">8 caractères minimum.</p>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Création...' : 'Créer mon compte'}
        </button>
        <p className="text-center text-xs text-gray-400">
          En continuant, vous acceptez nos{' '}
          <Link href="/terms" className="underline">
            conditions générales
          </Link>{' '}
          et notre{' '}
          <Link href="/privacy" className="underline">
            politique de confidentialité
          </Link>
          .
        </p>
      </form>
    </AuthCard>
  );
}
