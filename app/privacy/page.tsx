import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export const metadata = { title: 'Politique de confidentialité — Flotik' };

export default function PrivacyPage() {
  return (
    <div>
      <MarketingHeader />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-gray-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

        <div className="prose prose-sm mt-8 max-w-none text-gray-600">
          <h2>1. Données collectées</h2>
          <p>
            Flotik collecte les données nécessaires au fonctionnement du service : informations de compte
            (nom, email, mot de passe chiffré), informations d&apos;entreprise, prestations, demandes reçues via votre
            page publique, devis, clients et paiements.
          </p>

          <h2>2. Finalités</h2>
          <p>
            Ces données sont utilisées exclusivement pour fournir le service Flotik : gestion de votre compte,
            de vos demandes, devis et clients, envoi d&apos;emails transactionnels, traitement des paiements via Stripe.
          </p>

          <h2>3. Isolation des données</h2>
          <p>
            Chaque entreprise n&apos;a accès qu&apos;à ses propres données. Aucune donnée d&apos;une entreprise n&apos;est accessible
            par une autre entreprise utilisatrice de Flotik.
          </p>

          <h2>4. Sous-traitants</h2>
          <p>
            Nous utilisons des prestataires pour l&apos;hébergement, l&apos;envoi d&apos;emails (Resend) et le traitement des
            paiements (Stripe). Ces prestataires n&apos;accèdent qu&apos;aux données strictement nécessaires à leur mission.
          </p>

          <h2>5. Vos droits (RGPD)</h2>
          <p>
            Conformément au Règlement Général sur la Protection des Données, vous disposez d&apos;un droit d&apos;accès,
            de rectification, de portabilité et de suppression de vos données. Vous pouvez exporter ou supprimer
            votre compte et toutes les données associées à tout moment depuis la page Paramètres.
          </p>

          <h2>6. Conservation des données</h2>
          <p>
            Vos données sont conservées tant que votre compte est actif. En cas de suppression de compte,
            l&apos;ensemble des données (entreprise, demandes, devis, clients, paiements) est définitivement effacé.
          </p>

          <h2>7. Cookies</h2>
          <p>
            Flotik utilise uniquement des cookies strictement nécessaires au fonctionnement du service
            (authentification, session). Aucun cookie publicitaire ou de tracking tiers n&apos;est utilisé.
          </p>

          <h2>8. Contact</h2>
          <p>Pour toute question relative à vos données personnelles, contactez-nous depuis votre espace client.</p>
        </div>
      </div>
      <MarketingFooter />
    </div>
  );
}
