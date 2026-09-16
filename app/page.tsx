import Link from 'next/link';
import {
  Instagram,
  MessageSquareOff,
  FileWarning,
  Users,
  ArrowRight,
  Check,
  Camera,
  Palette,
  Scissors,
  Sparkles as SparklesIcon,
  PartyPopper,
  Inbox,
  FileText,
  Send,
  CreditCard,
} from 'lucide-react';
import { MarketingHeader } from '@/components/marketing/MarketingHeader';
import { MarketingFooter } from '@/components/marketing/MarketingFooter';

const PROBLEMS = [
  { icon: MessageSquareOff, title: 'Trop de DM Instagram', text: 'Vous répondez sans arrêt aux mêmes questions dans vos messages privés.' },
  { icon: FileWarning, title: 'Demandes incomplètes', text: 'Il manque toujours une information : date, budget, photo de référence...' },
  { icon: Users, title: 'Prospects oubliés', text: 'Sans suivi, difficile de savoir qui recontacter et quand.' },
];

const STEPS = [
  { icon: Instagram, title: 'Partagez votre lien', text: 'Ajoutez votre page FlowDevis dans votre bio Instagram, TikTok ou votre site.' },
  { icon: Inbox, title: 'Recevez des demandes complètes', text: 'Vos prospects remplissent un formulaire adapté à votre métier.' },
  { icon: FileText, title: 'Créez un devis en un clic', text: 'Transformez la demande en devis professionnel automatiquement pré-rempli.' },
  { icon: Send, title: 'Envoyez et suivez', text: 'Votre client reçoit un lien pour consulter et accepter son devis en ligne.' },
  { icon: CreditCard, title: 'Encaissez un acompte', text: 'Paiement sécurisé par carte bancaire directement après acceptation.' },
];

const FEATURES = [
  'Page publique personnalisée',
  'Formulaire intelligent et conditionnel',
  'Tarification dynamique avec options',
  'Devis professionnels en PDF',
  'Acceptation et signature en ligne',
  'Acomptes Stripe sécurisés',
  'CRM simple pour vos clients',
  'Relances automatiques',
  'Statistiques et suivi des sources',
];

const METIERS = [
  { icon: Camera, name: 'Photographe' },
  { icon: SparklesIcon, name: 'Tatoueur' },
  { icon: Scissors, name: 'Coiffeur' },
  { icon: Palette, name: 'Graphiste' },
  { icon: PartyPopper, name: 'Événementiel' },
];

const PLANS = [
  {
    name: 'Gratuit',
    price: '0€',
    features: ['5 demandes / mois', '3 prestations', 'Page publique', 'Formulaire', 'Devis'],
  },
  {
    name: 'Starter',
    price: '9€',
    highlight: true,
    features: ['Demandes illimitées', 'Prestations illimitées', 'CRM', 'Automatisations', 'Statistiques'],
  },
  {
    name: 'Pro',
    price: '19€',
    features: ['Tout Starter', 'Paiements & acomptes', 'Relances avancées', 'Branding avancé', 'Sans logo FlowDevis'],
  },
];

const FAQS = [
  {
    q: 'Est-ce que je dois savoir coder pour utiliser FlowDevis ?',
    a: "Non. FlowDevis est conçu pour les entrepreneurs non techniques. Tout se configure en quelques clics depuis votre tableau de bord.",
  },
  {
    q: 'Puis-je adapter le formulaire à mon métier ?',
    a: 'Oui, vous créez vos propres questions, prestations et options. Le formulaire peut aussi afficher des questions différentes selon la réponse précédente.',
  },
  {
    q: 'Comment mes clients paient-ils un acompte ?',
    a: 'Après acceptation du devis, votre client peut régler un acompte en ligne par carte bancaire via Stripe, en toute sécurité.',
  },
  {
    q: 'Puis-je changer de forfait à tout moment ?',
    a: 'Oui, vous pouvez passer à un forfait supérieur ou inférieur, ou annuler à tout moment depuis votre espace abonnement.',
  },
];

export default function LandingPage() {
  return (
    <div className="bg-white">
      <MarketingHeader />

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-16 text-center sm:pt-24">
        <span className="badge mb-6 bg-brand-50 text-brand-700">Fait pour les micro-entrepreneurs</span>
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          Transformez vos demandes Instagram en clients.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
          Recevez des demandes complètes, créez vos devis en quelques clics et suivez vos prospects au même endroit.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/inscription" className="btn-primary px-6 py-3 text-base">
            Commencer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#comment-ca-marche" className="btn-secondary px-6 py-3 text-base">
            Voir comment ça marche
          </a>
        </div>
        <p className="mt-4 text-xs text-gray-400">Vos demandes. Vos devis. Vos clients. Un seul endroit.</p>
      </section>

      {/* Problème */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">
            Gérer ses demandes clients ne devrait pas être un casse-tête
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PROBLEMS.map((p) => (
              <div key={p.title} className="card p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900">{p.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution + Comment ça marche */}
      <section id="comment-ca-marche" className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">Comment ça fonctionne</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-gray-500">
            Une seule page publique remplace vos DM Instagram et centralise tout votre suivi client.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <s.icon className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-brand-600">Étape {i + 1}</p>
                <h3 className="mt-1 font-medium text-gray-900">{s.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exemple concret */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">Un exemple concret</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="card p-6">
              <p className="mb-2 text-xs font-semibold uppercase text-brand-600">Photographe</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Type de shooting</li>
                <li>Date souhaitée</li>
                <li>Nombre de personnes</li>
                <li>Lieu</li>
                <li>Budget</li>
                <li>Photos de référence</li>
              </ul>
            </div>
            <div className="card p-6">
              <p className="mb-2 text-xs font-semibold uppercase text-brand-600">Tatoueur</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Zone du corps</li>
                <li>Taille</li>
                <li>Style</li>
                <li>Noir & blanc / couleur</li>
                <li>Image de référence</li>
                <li>Budget</li>
              </ul>
            </div>
            <div className="card p-6">
              <p className="mb-2 text-xs font-semibold uppercase text-brand-600">Prestataire événementiel</p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>Type d&apos;événement</li>
                <li>Date</li>
                <li>Nombre d&apos;invités</li>
                <li>Lieu</li>
                <li>Budget</li>
                <li>Services souhaités</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">Tout ce dont vous avez besoin</h2>
          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2.5 rounded-xl border border-gray-100 px-4 py-3 text-sm text-gray-700">
                <Check className="h-4 w-4 flex-shrink-0 text-emerald-500" /> {f}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Métiers */}
      <section id="metiers" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 sm:text-3xl">Pour quels métiers ?</h2>
          <p className="mx-auto mt-3 max-w-xl text-gray-500">
            Photographe, tatoueur, coiffeur, coach, wedding planner, traiteur, artisan, graphiste, développeur freelance... et bien
            d&apos;autres. Ou entrez simplement votre propre métier.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {METIERS.map((m) => (
              <div key={m.name} className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700">
                <m.icon className="h-4 w-4 text-brand-600" /> {m.name}
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-full border border-dashed border-gray-300 bg-white px-4 py-2 text-sm text-gray-500">
              + votre métier
            </div>
          </div>
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">Tarifs simples et transparents</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name} className={`card p-6 ${p.highlight ? 'ring-2 ring-brand-500' : ''}`}>
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <p className="mt-1 text-3xl font-bold text-gray-900">
                  {p.price}
                  <span className="text-sm font-normal text-gray-400">/mois</span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-600">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/inscription" className={`mt-6 block text-center ${p.highlight ? 'btn-primary' : 'btn-secondary'}`}>
                  Commencer
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-2xl font-semibold text-gray-900 sm:text-3xl">Questions fréquentes</h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="card p-5">
                <h3 className="font-medium text-gray-900">{f.q}</h3>
                <p className="mt-1 text-sm text-gray-500">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl rounded-2xl bg-brand-600 px-8 py-12 text-center text-white">
          <h2 className="text-2xl font-semibold sm:text-3xl">Prêt à ne plus perdre une seule demande ?</h2>
          <p className="mt-3 text-brand-100">Créez votre compte gratuitement en moins de 2 minutes.</p>
          <Link href="/inscription" className="btn-primary mt-6 inline-flex bg-white text-brand-700 hover:bg-brand-50">
            Commencer gratuitement <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
