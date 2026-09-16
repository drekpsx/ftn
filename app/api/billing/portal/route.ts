import { NextResponse } from 'next/server';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { stripe, isStripeConfigured } from '@/lib/stripe';

export async function POST() {
  try {
    const { business } = await requireBusiness();

    if (!isStripeConfigured() || !stripe) {
      return NextResponse.json({ error: "Les paiements ne sont pas encore configurés." }, { status: 503 });
    }
    if (!business.subscription?.stripeCustomerId) {
      return NextResponse.json({ error: 'Aucun abonnement actif.' }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const session = await stripe.billingPortal.sessions.create({
      customer: business.subscription.stripeCustomerId,
      return_url: `${appUrl}/dashboard/abonnement`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
