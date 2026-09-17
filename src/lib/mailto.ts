/**
 * Construit un lien mailto: pour ouvrir le client de messagerie du navigateur
 * (Gmail, Outlook, Mail...) avec le destinataire, l'objet et le message déjà
 * pré-remplis. Gratuit et sans aucune configuration : c'est l'utilisateur qui
 * envoie lui-même l'email depuis sa propre messagerie.
 */
function encodeMailtoParam(value: string): string {
  // encodeURIComponent produit des espaces en %20 (correct pour un lien mailto).
  // URLSearchParams encoderait les espaces en "+", ce que les messageries
  // affichent tel quel au lieu de les interpréter comme des espaces.
  // RFC 6068 recommande des retours à la ligne CRLF.
  return encodeURIComponent(value.replace(/\r\n|\r|\n/g, '\r\n'));
}

export function buildMailto(to: string, subject: string, body: string): string {
  const query = `subject=${encodeMailtoParam(subject)}&body=${encodeMailtoParam(body)}`;
  return `mailto:${encodeURIComponent(to)}?${query}`;
}

export function openMailto(to: string, subject: string, body: string) {
  if (typeof window !== 'undefined') {
    window.location.href = buildMailto(to, subject, body);
  }
}
