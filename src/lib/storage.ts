import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { v4 as uuid } from 'uuid';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo (stockage S3)
export const MAX_FILE_SIZE_BYTES_NO_S3 = 4 * 1024 * 1024; // 4 Mo (repli en base de données)

const s3Configured = Boolean(process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID);

const s3 = s3Configured
  ? new S3Client({
      region: process.env.S3_REGION || 'auto',
      endpoint: process.env.S3_ENDPOINT || undefined,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
    })
  : null;

/**
 * Sauvegarde un fichier uploadé et retourne son URL publique.
 * Utilise S3 (ou tout endpoint compatible S3) si configuré. Sinon, encode le
 * fichier en data URI (base64) : cette solution fonctionne sur n'importe quel
 * hébergement sans configuration (contrairement à un disque local, qui n'est
 * ni persistant ni servi sur la plupart des plateformes serverless comme
 * Netlify ou Vercel), mais n'est adaptée qu'à un usage modéré. Configurer les
 * variables S3_* est recommandé au-delà de quelques dizaines d'uploads par jour.
 */
export async function saveUploadedFile(file: File, folder: string): Promise<{ url: string; filename: string }> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    const err = new Error('Type de fichier non autorisé.');
    err.name = 'BAD_REQUEST';
    throw err;
  }

  const maxSize = s3 ? MAX_FILE_SIZE_BYTES : MAX_FILE_SIZE_BYTES_NO_S3;
  if (file.size > maxSize) {
    const err = new Error(`Fichier trop volumineux (${Math.floor(maxSize / (1024 * 1024))} Mo maximum).`);
    err.name = 'BAD_REQUEST';
    throw err;
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (s3 && process.env.S3_BUCKET) {
    const ext = path.extname(file.name).slice(0, 10);
    const key = `${folder}/${uuid()}${ext}`;
    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    );
    const base = process.env.S3_PUBLIC_URL || `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET}`;
    return { url: `${base}/${key}`, filename: file.name };
  }

  const dataUrl = `data:${file.type};base64,${buffer.toString('base64')}`;
  return { url: dataUrl, filename: file.name };
}
