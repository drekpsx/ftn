import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    const { business } = await requireBusiness();

    // La configuration initiale (prestations, formulaire, branding) est déjà
    // faite pendant l'onboarding : elle ne doit donc pas réapparaître ici,
    // sinon la progression saute artificiellement à 60-80% dès la création
    // du compte. Ce suivi ne porte que sur de vrais jalons de lancement,
    // impossibles à atteindre pendant l'onboarding lui-même.
    const [pageViews, requestsCount, sentQuotesCount, acceptedQuotesCount] = await Promise.all([
      prisma.analyticsEvent.count({ where: { businessId: business.id, type: 'page_view' } }),
      prisma.request.count({ where: { businessId: business.id } }),
      prisma.quote.count({ where: { businessId: business.id, status: { in: ['SENT', 'ACCEPTED', 'REFUSED'] } } }),
      prisma.quote.count({ where: { businessId: business.id, status: 'ACCEPTED' } }),
    ]);

    const items = [
      {
        key: 'view',
        label: 'Recevoir une première visite sur votre page publique',
        done: pageViews > 0,
        href: '/dashboard/page-publique',
      },
      { key: 'request', label: 'Recevoir votre première demande', done: requestsCount > 0, href: '/dashboard/demandes' },
      { key: 'quote_sent', label: 'Envoyer votre premier devis', done: sentQuotesCount > 0, href: '/dashboard/devis' },
      {
        key: 'quote_accepted',
        label: 'Décrocher votre premier devis accepté',
        done: acceptedQuotesCount > 0,
        href: '/dashboard/devis',
      },
    ];

    const progress = Math.round((items.filter((i) => i.done).length / items.length) * 100);

    return NextResponse.json({ items, progress });
  } catch (error) {
    return handleApiError(error);
  }
}
