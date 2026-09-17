import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.name === 'UNAUTHORIZED') {
      return NextResponse.json({ error: 'Vous devez être connecté.' }, { status: 401 });
    }
    if (error.name === 'NO_BUSINESS') {
      return NextResponse.json({ error: 'Aucune entreprise associée à ce compte.' }, { status: 404 });
    }
    if (error.name === 'FORBIDDEN') {
      return NextResponse.json({ error: "Vous n'avez pas accès à cette ressource." }, { status: 403 });
    }
    if (error.name === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Ressource introuvable.' }, { status: 404 });
    }
    if (error.name === 'BAD_REQUEST') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  }
  if (error instanceof ZodError) {
    const firstMessage = error.issues[0]?.message;
    return NextResponse.json(
      { error: firstMessage || 'Données invalides.', issues: error.flatten() },
      { status: 400 }
    );
  }
  console.error(error);
  return NextResponse.json(
    { error: "Une erreur est survenue. Merci de réessayer." },
    { status: 500 }
  );
}

export function notFound(message = 'Ressource introuvable.') {
  const err = new Error(message);
  err.name = 'NOT_FOUND';
  return err;
}
