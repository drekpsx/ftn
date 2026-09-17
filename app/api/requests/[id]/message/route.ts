import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';
import { logActivity } from '@/lib/activities';

const schema = z.object({
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(5000),
});

/**
 * N'envoie plus l'email lui-même : le message est composé puis envoyé
 * gratuitement depuis la messagerie de l'utilisateur (mailto), déclenché
 * côté client. Cette route se contente de tracer l'action dans l'historique.
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const request = await prisma.request.findFirst({ where: { id: params.id, businessId: business.id } });
    if (!request) throw notFound('Demande introuvable.');

    schema.parse(await req.json());

    await logActivity({
      businessId: business.id,
      requestId: request.id,
      type: 'message_sent',
      message: `Message envoyé à ${request.clientName}`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
