import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError, notFound } from '@/lib/api-utils';
import { logActivity } from '@/lib/activities';

const STATUS_LABELS: Record<string, string> = {
  NEW: 'Nouvelle',
  TO_PROCESS: 'À traiter',
  QUOTE_TO_PREPARE: 'Devis à préparer',
  QUOTE_SENT: 'Devis envoyé',
  WAITING: 'En attente',
  ACCEPTED: 'Acceptée',
  REFUSED: 'Refusée',
  DONE: 'Terminée',
};

async function getOwned(businessId: string, id: string) {
  const request = await prisma.request.findFirst({
    where: { id, businessId },
    include: {
      customer: true,
      service: true,
      files: true,
      quotes: { orderBy: { createdAt: 'desc' } },
      activities: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!request) throw notFound('Demande introuvable.');
  return request;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const request = await getOwned(business.id, params.id);
    return NextResponse.json({ request });
  } catch (error) {
    return handleApiError(error);
  }
}

const updateSchema = z.object({
  status: z.enum(['NEW', 'TO_PROCESS', 'QUOTE_TO_PREPARE', 'QUOTE_SENT', 'WAITING', 'ACCEPTED', 'REFUSED', 'DONE']).optional(),
  internalNotes: z.string().max(5000).optional().nullable(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { business } = await requireBusiness();
    const existing = await getOwned(business.id, params.id);
    const body = updateSchema.parse(await req.json());

    const request = await prisma.request.update({
      where: { id: params.id },
      data: body,
    });

    if (body.status && body.status !== existing.status) {
      await logActivity({
        businessId: business.id,
        requestId: params.id,
        type: 'status_change',
        message: `Statut changé : ${STATUS_LABELS[body.status]}`,
      });
    }
    if (body.internalNotes !== undefined && body.internalNotes !== existing.internalNotes) {
      await logActivity({
        businessId: business.id,
        requestId: params.id,
        type: 'note_added',
        message: 'Note interne mise à jour',
      });
    }

    return NextResponse.json({ request });
  } catch (error) {
    return handleApiError(error);
  }
}
