import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const business = await prisma.business.findUnique({ where: { slug: params.slug }, select: { id: true } });
  if (!business) {
    return NextResponse.json({ error: 'Page introuvable.' }, { status: 404 });
  }

  // Uniquement les jours à venir : pas besoin d'exposer l'historique.
  const dates = await prisma.unavailability.findMany({
    where: { businessId: business.id, date: { gte: new Date(new Date().toDateString()) } },
    select: { date: true },
    orderBy: { date: 'asc' },
  });

  return NextResponse.json({ dates: dates.map((d) => d.date.toISOString().slice(0, 10)) });
}
