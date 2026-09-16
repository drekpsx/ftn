import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';

export async function GET() {
  try {
    const { business } = await requireBusiness();
    const automations = await prisma.automation.findMany({
      where: { businessId: business.id },
      orderBy: { delayHours: 'asc' },
    });
    return NextResponse.json({ automations });
  } catch (error) {
    return handleApiError(error);
  }
}
