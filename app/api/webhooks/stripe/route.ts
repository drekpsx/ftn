import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { notify, logActivity } from '@/lib/activities';
import { sendEmail } from '@/lib/email';
import { paymentReceivedEmail } from '@/emails/templates';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe non configuré.' }, { status: 503 });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Signature manquante.' }, { status: 400 });
  }

  const rawBody = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error('Signature webhook Stripe invalide', err);
    return NextResponse.json({ error: 'Signature invalide.' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'payment') {
          const payment = await prisma.payment.findUnique({
            where: { stripeCheckoutSessionId: session.id },
            include: { quote: { include: { customer: true, business: true } } },
          });
          if (payment && payment.status !== 'SUCCEEDED') {
            await prisma.payment.update({
              where: { id: payment.id },
              data: { status: 'SUCCEEDED', stripePaymentIntentId: session.payment_intent as string },
            });

            if (payment.quote) {
              await logActivity({
                businessId: payment.businessId,
                quoteId: payment.quote.id,
                type: 'payment_received',
                message: `Paiement de ${payment.amount} € reçu pour le devis ${payment.quote.number}`,
              });
              if (payment.quote.business.notifyOnPayment) {
                await notify({
                  businessId: payment.businessId,
                  type: 'payment_received',
                  message: `Paiement reçu (${payment.amount} €) pour le devis ${payment.quote.number}`,
                  link: `/dashboard/devis/${payment.quote.id}`,
                });
              }
              await sendEmail({
                to: payment.quote.customer.email,
                subject: 'Paiement reçu',
                html: paymentReceivedEmail({
                  clientFirstName: payment.quote.customer.name.split(' ')[0],
                  amount: `${payment.amount.toFixed(2)} €`,
                  businessName: payment.quote.business.name,
                }),
              });
            }
          }
        }

        if (session.mode === 'subscription' && session.metadata?.businessId) {
          const businessId = session.metadata.businessId;
          const plan = (session.metadata.plan as 'STARTER' | 'PRO') ?? 'STARTER';
          const subscriptionId = session.subscription as string;

          await prisma.subscription.upsert({
            where: { businessId },
            update: {
              plan,
              status: 'ACTIVE',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscriptionId,
            },
            create: {
              businessId,
              plan,
              status: 'ACTIVE',
              stripeCustomerId: session.customer as string,
              stripeSubscriptionId: subscriptionId,
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const businessId = subscription.metadata?.businessId;
        if (businessId) {
          const statusMap: Record<string, string> = {
            active: 'ACTIVE',
            trialing: 'TRIALING',
            past_due: 'PAST_DUE',
            canceled: 'CANCELED',
            incomplete: 'INCOMPLETE',
          };
          await prisma.subscription.updateMany({
            where: { businessId },
            data: {
              status: (statusMap[subscription.status] ?? 'ACTIVE') as never,
              cancelAtPeriodEnd: subscription.cancel_at_period_end,
              currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const businessId = subscription.metadata?.businessId;
        if (businessId) {
          await prisma.subscription.updateMany({
            where: { businessId },
            data: { plan: 'FREE', status: 'CANCELED' },
          });
        }
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erreur de traitement du webhook Stripe', error);
    return NextResponse.json({ error: 'Erreur interne.' }, { status: 500 });
  }
}
