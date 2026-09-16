import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export async function POST(_req: NextRequest, { params }: { params: { token: string } }) {
  if (!isStripeConfigured() || !stripe) {
    return NextResponse.json(
      { error: "Le paiement en ligne n'est pas encore configuré par ce professionnel." },
      { status: 503 }
    );
  }

  const quote = await prisma.quote.findUnique({
    where: { publicToken: params.token },
    include: { customer: true, business: true, payments: { where: { status: 'SUCCEEDED' } } },
  });

  if (!quote) return NextResponse.json({ error: 'Devis introuvable.' }, { status: 404 });
  if (quote.status !== 'ACCEPTED') {
    return NextResponse.json({ error: 'Ce devis doit être accepté avant de pouvoir être payé.' }, { status: 400 });
  }
  if (!quote.depositAmount || quote.depositAmount <= 0) {
    return NextResponse.json({ error: "Aucun acompte n'est requis pour ce devis." }, { status: 400 });
  }
  if (quote.payments.some((p) => p.type === 'DEPOSIT')) {
    return NextResponse.json({ error: "L'acompte a déjà été réglé." }, { status: 400 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: quote.customer.email,
    line_items: [
      {
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(quote.depositAmount * 100),
          product_data: {
            name: `Acompte — Devis ${quote.number}`,
            description: `${quote.business.name}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: { quoteId: quote.id, businessId: quote.businessId, type: 'DEPOSIT' },
    success_url: `${appUrl}/devis/${params.token}?paid=1`,
    cancel_url: `${appUrl}/devis/${params.token}`,
  });

  await prisma.payment.create({
    data: {
      businessId: quote.businessId,
      quoteId: quote.id,
      customerId: quote.customerId,
      type: 'DEPOSIT',
      status: 'PENDING',
      amount: quote.depositAmount,
      stripeCheckoutSessionId: session.id,
    },
  });

  return NextResponse.json({ url: session.url });
}
