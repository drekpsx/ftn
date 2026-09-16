const buckets = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limiter en mémoire, best-effort (suffisant pour une seule instance).
 * Pour un déploiement multi-instances, remplacer par un store partagé (Redis).
 */
export function isRateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > max) return true;
  return false;
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers.get('x-real-ip') || 'unknown';
}
