import { prisma } from '@/lib/prisma';

export async function logActivity(params: {
  businessId: string;
  requestId?: string;
  quoteId?: string;
  type: string;
  message: string;
}) {
  await prisma.activity.create({
    data: {
      businessId: params.businessId,
      requestId: params.requestId,
      quoteId: params.quoteId,
      type: params.type,
      message: params.message,
    },
  });
}

export async function notify(params: {
  businessId: string;
  type: string;
  message: string;
  link?: string;
}) {
  await prisma.notification.create({
    data: {
      businessId: params.businessId,
      type: params.type,
      message: params.message,
      link: params.link,
    },
  });
}
