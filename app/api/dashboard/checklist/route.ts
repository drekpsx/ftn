import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    const { business } = await requireBusiness();

    const [servicesCount, fieldsCount, requestsCount] = await Promise.all([
      prisma.service.count({ where: { businessId: business.id } }),
      prisma.formField.count({ where: { businessId: business.id } }),
      prisma.request.count({ where: { businessId: business.id } }),
    ]);

    const items = [
      { key: 'service', label: 'Ajouter votre première prestation', done: servicesCount > 0, href: '/dashboard/prestations' },
      {
        key: 'branding',
        label: 'Personnaliser votre page',
        done: Boolean(business.description || business.avatarUrl || business.logoUrl),
        href: '/dashboard/page-publique',
      },
      { key: 'form', label: 'Configurer votre formulaire', done: fieldsCount > 0, href: '/dashboard/formulaire' },
      {
        key: 'share',
        label: 'Ajouter votre lien à votre bio Instagram',
        done: Boolean(business.instagram || business.tiktok || business.website),
        href: '/dashboard/page-publique',
      },
      { key: 'request', label: 'Recevoir votre première demande', done: requestsCount > 0, href: '/dashboard/demandes' },
    ];

    const progress = Math.round((items.filter((i) => i.done).length / items.length) * 100);

    return NextResponse.json({ items, progress });
  } catch (error) {
    return handleApiError(error);
  }
}
