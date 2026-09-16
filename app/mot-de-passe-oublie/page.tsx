'use client';

import { useState } from 'react';
import { AuthCard } from '@/components/AuthCard';
import { FormSuccess } from '@/components/FormError';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard title="Mot de passe oublié" subtitle="Nous vous enverrons un lien de réinitialisation.">
      {sent ? (
        <FormSuccess message="Si un compte existe avec cette adresse, un email vient de vous être envoyé." />
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input
              type="email"
              className="input"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Envoi...' : 'Envoyer le lien'}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
