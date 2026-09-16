import { NextResponse } from 'next/server';
import { requireBusiness } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { handleApiError } from '@/lib/api-utils';

export async function POST() {
  try {
    const { business } = await requireBusiness();
    await prisma.notification.updateMany({
      where: { businessId: business.id, read: false },
      data: { read: true },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
