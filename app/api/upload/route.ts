import { NextRequest, NextResponse } from 'next/server';
import { requireBusiness } from '@/lib/auth';
import { saveUploadedFile } from '@/lib/storage';
import { handleApiError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const { business } = await requireBusiness();
    const formData = await req.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Aucun fichier fourni.' }, { status: 400 });
    }

    const saved = await saveUploadedFile(file, business.id);
    return NextResponse.json({ url: saved.url });
  } catch (error) {
    return handleApiError(error);
  }
}
