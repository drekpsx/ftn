import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { QuoteActions } from '@/components/public/QuoteActions';

export const dynamic = 'force-dynamic';

export default async function PublicQuotePage({ params }: { params: { token: string } }) {
  const quote = await prisma.quote.findUnique({
    where: { publicToken: params.token },
    include: {
      items: { orderBy: { order: 'asc' } },
      customer: true,
      business: { select: { name: true, primaryColor: true, phone: true, publicEmail: true } },
      payments: { where: { status: 'SUCCEEDED' } },
    },
  });

  if (!quote) notFound();

  if (quote.status === 'SENT') {
    await prisma.quote.update({ where: { id: quote.id }, data: { status: 'VIEWED', viewedAt: new Date() } });
  }

  const depositPaid = quote.payments.some((p) => p.type === 'DEPOSIT');

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <div className="card p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Devis de</p>
              <h1 className="text-xl font-bold text-gray-900">{quote.business.name}</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">N° {quote.number}</p>
              {quote.validUntil && (
                <p className="text-xs text-gray-400">
                  Valable jusqu&apos;au {new Date(quote.validUntil).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
          </div>

          <div className="mb-6 divide-y divide-gray-100 border-y border-gray-100">
            {quote.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-800">{item.label}</p>
                  {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
                  <p className="text-xs text-gray-400">
                    {item.quantity} × {item.unitPrice.toFixed(2)} €
                  </p>
                </div>
                <p className="font-medium text-gray-800">{item.total.toFixed(2)} €</p>
              </div>
            ))}
          </div>

          <div className="ml-auto max-w-xs space-y-1 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Sous-total</span>
              <span>{quote.subtotal.toFixed(2)} €</span>
            </div>
            {quote.discount > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>Réduction</span>
                <span>- {quote.discount.toFixed(2)} €</span>
              </div>
            )}
            {quote.taxRate > 0 && (
              <div className="flex justify-between text-gray-500">
                <span>TVA ({quote.taxRate}%)</span>
                <span>{quote.taxAmount.toFixed(2)} €</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold text-gray-900">
              <span>Total TTC</span>
              <span>{quote.total.toFixed(2)} €</span>
            </div>
          </div>

          {quote.terms && (
            <div className="mt-6 rounded-xl bg-gray-50 p-4 text-xs text-gray-500">{quote.terms}</div>
          )}

          <div className="mt-8">
            <QuoteActions
              token={params.token}
              status={quote.status}
              clientComment={quote.clientComment}
              signatureName={quote.signatureName}
              depositAmount={quote.depositAmount}
              depositPaid={depositPaid}
              pdfHref={`/api/public/quotes/${params.token}/pdf`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
