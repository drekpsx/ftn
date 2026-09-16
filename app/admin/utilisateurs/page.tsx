'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

type UserRow = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  suspended: boolean;
  createdAt: string;
  business: { name: string; slug: string; subscription: { plan: string } | null } | null;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [q, setQ] = useState('');

  function load() {
    fetch(`/api/admin/users?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setUsers(d.users));
  }

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  async function toggleSuspend(id: string) {
    await fetch(`/api/admin/users/${id}/toggle-suspend`, { method: 'POST' });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Utilisateurs</h1>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9" placeholder="Rechercher..." value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <div className="card divide-y divide-gray-100">
        {users?.map((u) => (
          <div key={u.id} className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="font-medium text-gray-900">
                {u.firstName} {u.lastName}
              </p>
              <p className="text-sm text-gray-500">
                {u.email} {u.business ? `· ${u.business.name} (${u.business.subscription?.plan ?? 'FREE'})` : '· Sans entreprise'}
              </p>
            </div>
            <button onClick={() => toggleSuspend(u.id)} className={u.suspended ? 'btn-secondary' : 'btn-danger'}>
              {u.suspended ? 'Réactiver' : 'Suspendre'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
