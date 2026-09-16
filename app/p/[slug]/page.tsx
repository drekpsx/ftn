import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Instagram, Globe, Phone, Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { RequestForm } from '@/components/public/RequestForm';

export const dynamic = 'force-dynamic';

async function getBusiness(slug: string) {
  return prisma.business.findUnique({
    where: { slug },
    include: {
      services: { where: { active: true }, orderBy: { order: 'asc' }, include: { options: { orderBy: { order: 'asc' } } } },
      formFields: { orderBy: { order: 'asc' } },
    },
  });
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const business = await getBusiness(params.slug);
  if (!business) return {};

  return {
    title: `${business.name} — ${business.activity}`,
    description: business.description || `Demandez un devis auprès de ${business.name}.`,
    robots: business.allowIndexing ? 'index, follow' : 'noindex, nofollow',
    openGraph: {
      title: business.name,
      description: business.description || undefined,
      images: business.coverUrl ? [business.coverUrl] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: business.name,
      description: business.description || undefined,
    },
  };
}

function priceLabel(s: {
  priceType: string;
  price: number | null;
  priceMin: number | null;
  priceMax: number | null;
}) {
  if (s.priceType === 'ON_QUOTE') return 'Sur devis';
  if (s.priceType === 'FIXED') return `${s.price ?? 0} €`;
  if (s.priceType === 'STARTING_AT') return `À partir de ${s.price ?? 0} €`;
  return `${s.priceMin ?? 0} € - ${s.priceMax ?? 0} €`;
}

export default async function PublicBusinessPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { source?: string };
}) {
  const business = await getBusiness(params.slug);
  if (!business) notFound();

  prisma.analyticsEvent
    .create({ data: { businessId: business.id, type: 'page_view', source: searchParams.source } })
    .catch(() => {});

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div
        className="h-40 w-full bg-gradient-to-br from-brand-500 to-brand-700 sm:h-56"
        style={
          business.coverUrl
            ? { backgroundImage: `url(${business.coverUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: `linear-gradient(135deg, ${business.primaryColor}, #211d63)` }
        }
      />

      <div className="mx-auto -mt-12 max-w-2xl px-4">
        <div className="card p-6 text-center sm:p-8">
          {business.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={business.avatarUrl} alt={business.name} className="mx-auto -mt-16 h-20 w-20 rounded-full border-4 border-white object-cover" />
          ) : (
            <div
              className="mx-auto -mt-16 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white text-xl font-bold text-white"
              style={{ backgroundColor: business.primaryColor }}
            >
              {business.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{business.name}</h1>
          <p className="text-sm text-gray-500">{business.activity}</p>
          {business.description && <p className="mt-3 text-sm text-gray-600">{business.description}</p>}

          <div className="mt-4 flex flex-wrap justify-center gap-3 text-sm text-gray-500">
            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:text-brand-700"
              >
                <Instagram className="h-4 w-4" /> {business.instagram}
              </a>
            )}
            {business.website && (
              <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-brand-700">
                <Globe className="h-4 w-4" /> Site internet
              </a>
            )}
            {business.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> {business.phone}
              </span>
            )}
            {business.publicEmail && (
              <span className="flex items-center gap-1">
                <Mail className="h-4 w-4" /> {business.publicEmail}
              </span>
            )}
          </div>
        </div>

        {business.services.length > 0 && (
          <div className="card mt-6 p-6">
            <h2 className="mb-4 font-semibold text-gray-900">Prestations</h2>
            <div className="space-y-3">
              {business.services.map((s) => (
                <div key={s.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-gray-800">{s.name}</p>
                    {s.description && <p className="text-xs text-gray-500">{s.description}</p>}
                  </div>
                  {business.showPricingPublicly && <p className="text-sm font-medium text-gray-700">{priceLabel(s)}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div id="demande" className="card mt-6 p-6">
          <h2 className="mb-4 font-semibold text-gray-900">Faire une demande</h2>
          <RequestForm
            slug={business.slug}
            services={business.services}
            fields={business.formFields.map((f) => ({ ...f, options: (f.options as string[] | null) ?? null }))}
            showPricing={business.showPricingPublicly}
            source={searchParams.source}
          />
        </div>

        <p className="mt-8 text-center text-xs text-gray-400">Propulsé par FlowDevis</p>
      </div>
    </div>
  );
}
