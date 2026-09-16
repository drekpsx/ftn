import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

export const metadata = { title: 'Conditions générales — FlowDevis' };

export default function TermsPage() {
  return (
    <div>
      <MarketingHeader />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold text-gray-900">Conditions générales d&apos;utilisation</h1>
        <p className="mt-2 text-sm text-gray-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>

        <div className="prose prose-sm mt-8 max-w-none text-gray-600">
          <h2>1. Objet</h2>
          <p>
            FlowDevis est une plateforme SaaS permettant aux micro-entrepreneurs de recevoir des demandes, créer
            des devis et gérer leurs clients depuis une page publique personnalisée.
          </p>

          <h2>2. Compte utilisateur</h2>
          <p>
            L&apos;utilisation de FlowDevis nécessite la création d&apos;un compte. Vous êtes responsable de la
            confidentialité de vos identifiants et de toute activité effectuée depuis votre compte.
          </p>

          <h2>3. Forfaits et facturation</h2>
          <p>
            FlowDevis propose un forfait gratuit ainsi que des forfaits payants (Starter, Pro) facturés
            mensuellement via Stripe. Vous pouvez changer de forfait ou annuler votre abonnement à tout moment
            depuis votre espace Abonnement. Aucun remboursement au prorata n&apos;est effectué sauf obligation légale.
          </p>

          <h2>4. Utilisation autorisée</h2>
          <p>
            Vous vous engagez à utiliser FlowDevis conformément à la loi, à ne pas diffuser de contenu illicite
            sur votre page publique, et à ne pas tenter de compromettre la sécurité du service.
          </p>

          <h2>5. Responsabilité</h2>
          <p>
            FlowDevis est un outil de gestion. Les relations commerciales, la qualité des prestations et le
            respect des engagements pris via les devis relèvent de la seule responsabilité de l&apos;utilisateur
            professionnel envers ses propres clients.
          </p>

          <h2>6. Paiements</h2>
          <p>
            Les paiements (acomptes, abonnements) sont traités par Stripe. FlowDevis ne stocke jamais vos
            informations bancaires.
          </p>

          <h2>7. Résiliation</h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment depuis les paramètres. FlowDevis se réserve le droit
            de suspendre un compte en cas de violation manifeste des présentes conditions.
          </p>

          <h2>8. Modification des conditions</h2>
          <p>
            Ces conditions peuvent être mises à jour. Toute modification substantielle sera communiquée par email.
          </p>
        </div>
      </div>
      <MarketingFooter />
    </div>
  );
}
