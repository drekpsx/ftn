const wrapper = (title: string, body: string) => `
<!doctype html>
<html>
  <body style="margin:0;background:#f4f5f9;padding:32px 0;font-family:Helvetica,Arial,sans-serif;color:#1a1a2e;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <tr>
        <td style="background:#5b5eec;padding:24px 32px;">
          <span style="color:#fff;font-weight:700;font-size:18px;">FlowDevis</span>
        </td>
      </tr>
      <tr>
        <td style="padding:32px;">
          <h1 style="font-size:20px;margin:0 0 16px;">${title}</h1>
          ${body}
        </td>
      </tr>
      <tr>
        <td style="padding:16px 32px;color:#9296a8;font-size:12px;">
          FlowDevis — Vos demandes. Vos devis. Vos clients. Un seul endroit.
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const button = (href: string, label: string) => `
  <a href="${href}" style="display:inline-block;margin-top:16px;background:#5b5eec;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:600;font-size:14px;">${label}</a>
`;

export function welcomeEmail(firstName: string) {
  return wrapper(
    `Bienvenue ${firstName} !`,
    `<p>Votre compte FlowDevis est prêt. Configurez votre entreprise pour obtenir votre lien public et commencer à recevoir des demandes.</p>`
  );
}

export function verifyEmail(link: string) {
  return wrapper(
    'Confirmez votre adresse email',
    `<p>Cliquez sur le bouton ci-dessous pour confirmer votre adresse email.</p>${button(link, 'Confirmer mon email')}`
  );
}

export function resetPasswordEmail(link: string) {
  return wrapper(
    'Réinitialisation de votre mot de passe',
    `<p>Vous avez demandé à réinitialiser votre mot de passe. Ce lien est valable 1 heure.</p>${button(link, 'Réinitialiser mon mot de passe')}`
  );
}

export function newRequestOwnerEmail(params: {
  businessName: string;
  clientName: string;
  serviceName?: string;
  dashboardLink: string;
}) {
  return wrapper(
    'Nouvelle demande reçue 🎉',
    `<p><strong>${params.clientName}</strong> vient de vous envoyer une demande${
      params.serviceName ? ` pour <strong>${params.serviceName}</strong>` : ''
    } sur la page de ${params.businessName}.</p>${button(params.dashboardLink, 'Voir la demande')}`
  );
}

export function requestReceivedClientEmail(params: { businessName: string; clientFirstName: string }) {
  return wrapper(
    'Demande envoyée 🎉',
    `<p>Bonjour ${params.clientFirstName},</p><p>${params.businessName} a bien reçu votre demande et reviendra vers vous rapidement.</p>`
  );
}

export function quoteSentEmail(params: {
  businessName: string;
  clientFirstName: string;
  quoteNumber: string;
  link: string;
}) {
  return wrapper(
    `Votre devis ${params.quoteNumber}`,
    `<p>Bonjour ${params.clientFirstName},</p><p>${params.businessName} vient de vous envoyer un devis. Vous pouvez le consulter et l'accepter en ligne.</p>${button(
      params.link,
      'Consulter mon devis'
    )}`
  );
}

export function quoteAcceptedOwnerEmail(params: { clientName: string; quoteNumber: string; link: string }) {
  return wrapper(
    'Devis accepté ✅',
    `<p><strong>${params.clientName}</strong> a accepté le devis ${params.quoteNumber}.</p>${button(
      params.link,
      'Voir le devis'
    )}`
  );
}

export function paymentReceivedEmail(params: { clientFirstName: string; amount: string; businessName: string }) {
  return wrapper(
    'Paiement reçu ✅',
    `<p>Bonjour ${params.clientFirstName},</p><p>Nous confirmons la réception de votre paiement de ${params.amount} pour ${params.businessName}. Merci !</p>`
  );
}

export function quoteReminderEmail(params: {
  clientFirstName: string;
  businessName: string;
  link: string;
  isFinal: boolean;
}) {
  return wrapper(
    params.isFinal ? 'Dernière relance' : 'Votre devis vous attend',
    `<p>Bonjour ${params.clientFirstName},</p><p>${
      params.isFinal
        ? `Je me permets une dernière relance concernant votre demande auprès de ${params.businessName}.`
        : `Avez-vous eu le temps de consulter votre devis de ${params.businessName} ?`
    }</p>${button(params.link, 'Consulter mon devis')}`
  );
}
