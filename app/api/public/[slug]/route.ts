import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  const business = await prisma.business.findUnique({
    where: { slug: params.slug },
    include: {
      services: {
        where: { active: true },
        orderBy: { order: 'asc' },
        include: { options: { orderBy: { order: 'asc' } } },
      },
      formFields: { orderBy: { order: 'asc' } },
    },
  });

  if (!business) {
    return NextResponse.json({ error: 'Page introuvable.' }, { status: 404 });
  }

  return NextResponse.json({
    business: {
      name: business.name,
      slug: business.slug,
      activity: business.activity,
      description: business.description,
      logoUrl: business.logoUrl,
      avatarUrl: business.avatarUrl,
      coverUrl: business.coverUrl,
      primaryColor: business.primaryColor,
      phone: business.phone,
      publicEmail: business.publicEmail,
      instagram: business.instagram,
      tiktok: business.tiktok,
      website: business.website,
      showPricingPublicly: business.showPricingPublicly,
      allowIndexing: business.allowIndexing,
    },
    services: business.services,
    fields: business.formFields,
  });
}
