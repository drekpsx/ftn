import { NextResponse } from 'next/server';
import { requireBusiness } from '@/lib/auth';
import { handleApiError } from '@/lib/api-utils';
import { isStripeConfigured } from '@/lib/stripe';

export async function GET() {
  try {
    await requireBusiness();
    return NextResponse.json({
      emailConfigured: Boolean(process.env.RESEND_API_KEY),
      stripeConfigured: isStripeConfigured(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
