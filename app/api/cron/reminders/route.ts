import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { quoteReminderEmail } from '@/emails/templates';
import { logActivity } from '@/lib/activities';

export const dynamic = 'force-dynamic';

/**
 * Endpoint destiné à être appelé périodiquement (ex : Vercel Cron toutes les heures)
 * pour envoyer les relances automatiques de devis configurées par chaque entreprise.
 * Protégé par CRON_SECRET si défini.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const now = Date.now();

  const quotes = await prisma.quote.findMany({
    where: { status: { in: ['SENT', 'VIEWED'] } },
    include: { customer: true, business: { include: { automations: true } } },
  });

  let sentCount = 0;

  for (const quote of quotes) {
    if (!quote.sentAt) continue;
    const hoursSinceSent = (now - quote.sentAt.getTime()) / (1000 * 60 * 60);

    const enabledAutomations = quote.business.automations
      .filter((a) => a.enabled && a.type === 'quote_reminder')
      .sort((a, b) => a.delayHours - b.delayHours);

    for (let i = 0; i < enabledAutomations.length; i++) {
      const automation = enabledAutomations[i];
      const isFinal = i === enabledAutomations.length - 1;
      const alreadySent = quote.remindersSent > i;

      if (!alreadySent && hoursSinceSent >= automation.delayHours) {
        await sendEmail({
          to: quote.customer.email,
          subject: isFinal ? 'Dernière relance' : 'Votre devis vous attend',
          html: quoteReminderEmail({
            clientFirstName: quote.customer.name.split(' ')[0],
            businessName: quote.business.name,
            link: `${appUrl}/devis/${quote.publicToken}`,
            isFinal,
          }),
        });
        await prisma.quote.update({
          where: { id: quote.id },
          data: { remindersSent: { increment: 1 }, lastReminderAt: new Date() },
        });
        await logActivity({
          businessId: quote.businessId,
          quoteId: quote.id,
          type: 'reminder_sent',
          message: `Relance envoyée à ${quote.customer.name}`,
        });
        sentCount += 1;
      }
    }
  }

  return NextResponse.json({ success: true, sentCount });
}
