/**
 * Construit un lien mailto: pour ouvrir le client de messagerie du navigateur
 * (Gmail, Outlook, Mail...) avec le destinataire, l'objet et le message déjà
 * pré-remplis. Gratuit et sans aucune configuration : c'est l'utilisateur qui
 * envoie lui-même l'email depuis sa propre messagerie.
 */
export function buildMailto(to: string, subject: string, body: string): string {
  const params = new URLSearchParams({ subject, body });
  return `mailto:${encodeURIComponent(to)}?${params.toString()}`;
}

export function openMailto(to: string, subject: string, body: string) {
  if (typeof window !== 'undefined') {
    window.location.href = buildMailto(to, subject, body);
  }
}
