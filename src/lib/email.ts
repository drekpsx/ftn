import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM = process.env.EMAIL_FROM || 'FlowDevis <no-reply@flowdevis.app>';

/**
 * Envoie un email transactionnel. Si aucune clé Resend n'est configurée
 * (environnement de développement), l'email est simplement journalisé afin
 * de ne jamais faire échouer le parcours utilisateur.
 */
export async function sendEmail(params: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.log(`[email:dev] À: ${params.to} | Sujet: ${params.subject}`);
    return { skipped: true };
  }

  try {
    await resend.emails.send({
      from: FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
    return { skipped: false };
  } catch (error) {
    console.error("Échec de l'envoi d'email", error);
    return { skipped: true, error: true };
  }
}
