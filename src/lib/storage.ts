import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';

export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Mo

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
 * Utilise S3 (ou tout endpoint compatible S3) si configuré, sinon stocke
 * localement dans /public/uploads (développement uniquement).
 */
export async function saveUploadedFile(file: File, folder: string): Promise<{ url: string; filename: string }> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    const err = new Error('Type de fichier non autorisé.');
    err.name = 'BAD_REQUEST';
    throw err;
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const err = new Error('Fichier trop volumineux (10 Mo maximum).');
    err.name = 'BAD_REQUEST';
    throw err;
  }

  const ext = path.extname(file.name).slice(0, 10);
  const key = `${folder}/${uuid()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (s3 && process.env.S3_BUCKET) {
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

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', folder);
  await mkdir(uploadsDir, { recursive: true });
  const localPath = path.join(uploadsDir, path.basename(key));
  await writeFile(localPath, buffer);

  return { url: `/uploads/${folder}/${path.basename(key)}`, filename: file.name };
}
