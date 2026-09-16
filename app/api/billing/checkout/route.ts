import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { stripe, isStripeConfigured, PRICE_IDS } from '@/lib/stripe';

const schema = z.object({ plan: z.enum(['STARTER', 'PRO']) });

export async function POST(req: NextRequest) {
  try {
    const { business, sessionUser } = await requireBusiness();

    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json({ error: "Les paiements ne sont pas encore configurés." }, { status: 503 });
    }

    const { plan } = schema.parse(await req.json());
    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: 'Ce forfait n\'est pas encore disponible.' }, { status: 503 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    let stripeCustomerId = business.subscription?.stripeCustomerId;
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: sessionUser.email,
        name: business.name,
        metadata: { businessId: business.id },
      });
      stripeCustomerId = customer.id;
      await prisma.subscription.upsert({
        where: { businessId: business.id },
        update: { stripeCustomerId },
        create: { businessId: business.id, stripeCustomerId, plan: 'FREE' },
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { businessId: business.id, plan },
      subscription_data: { metadata: { businessId: business.id, plan } },
      success_url: `${appUrl}/dashboard/abonnement?success=1`,
      cancel_url: `${appUrl}/dashboard/abonnement`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
