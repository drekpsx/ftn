import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const businesses = await prisma.business.findMany({
    where: { allowIndexing: true },
    select: { slug: true, updatedAt: true },
  });

  return [
    { url: appUrl, lastModified: new Date() },
    { url: `${appUrl}/privacy`, lastModified: new Date() },
    { url: `${appUrl}/terms`, lastModified: new Date() },
    ...businesses.map((b) => ({ url: `${appUrl}/p/${b.slug}`, lastModified: b.updatedAt })),
  ];
}
