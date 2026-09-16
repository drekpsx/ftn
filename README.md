# Flotik

> Vos demandes. Vos devis. Vos clients. Un seul endroit.

Flotik est un SaaS qui aide les micro-entrepreneurs (photographes, tatoueurs,
coiffeurs, coachs, wedding planners, artisans, freelances...) à transformer les
demandes reçues via Instagram, TikTok ou leur site en devis puis en clients,
sans perdre de temps dans les DM.

Ce dépôt contient une application **réellement fonctionnelle**, connectée à une
vraie base de données PostgreSQL : inscription, configuration d'entreprise,
prestations, formulaire personnalisable, page publique, demandes, CRM, devis
avec PDF, acceptation en ligne, acomptes Stripe, relances automatiques,
statistiques et abonnements.

## Stack technique

- **Frontend** : Next.js 14 (App Router), TypeScript, React, Tailwind CSS
- **Backend** : Next.js Route Handlers, Prisma ORM, PostgreSQL
- **Auth** : NextAuth (Credentials + JWT), mots de passe hashés (bcrypt)
- **Paiements** : Stripe (Checkout, abonnements, webhooks)
- **Emails transactionnels** : Resend (no-op silencieux si non configuré)
- **Fichiers** : compatible S3 (ou stockage local en développement)
- **PDF** : @react-pdf/renderer
- **Tests** : Vitest (unitaire) + script de bout en bout Playwright

## Fonctionnalités livrées

Le développement a suivi la priorité demandée : authentification → entreprise
→ prestations → formulaire → page publique → demandes → CRM → devis → emails
→ Stripe → automatisations → statistiques → admin.

- Inscription / connexion / mot de passe oublié / vérification email / suppression de compte
- Onboarding en 6 étapes (métier, entreprise, prestations, formulaire, branding, lien public)
- Prestations avec types de prix (fixe, à partir de, fourchette, sur devis) et options
- Form builder avec logique conditionnelle (afficher un champ selon la réponse à un autre)
- Page publique `/p/[slug]` mobile-first, personnalisable, avec QR code et liens trackés par source (Instagram, TikTok, site, QR)
- Tarification dynamique avec estimation en temps réel
- Demandes avec statuts, filtres, recherche, notes internes, historique
- Mini CRM (clients créés automatiquement à chaque demande)
- Devis professionnels : numérotation automatique, PDF, envoi par email, lien public
- Acceptation de devis en ligne avec signature simple, refus, expiration
- Acomptes Stripe (10/20/30/50 % ou montant fixe) + webhooks
- Abonnements Stripe (Gratuit / Starter / Pro) avec limites appliquées côté serveur
- Relances automatiques configurables (délai, activation) via `/api/cron/reminders`
- Statistiques (visiteurs, demandes, devis, conversion, sources, CA)
- Notifications in-app, emails transactionnels (bienvenue, nouvelle demande, devis envoyé/accepté, paiement reçu, relance)
- Mini back-office admin (`/admin`) : utilisateurs, MRR estimé, suspension de compte
- Isolation stricte des données par entreprise (toutes les requêtes sont scoping par `businessId`)
- Pages `/privacy` et `/terms`, `sitemap.xml` et `robots.txt`

### Simplifications assumées

Pour livrer un produit qui fonctionne réellement plutôt qu'une maquette, certains
points avancés du cahier des charges ont été volontairement simplifiés :

- Les relances automatiques sont envoyées par un endpoint (`/api/cron/reminders`)
  à appeler périodiquement (Vercel Cron, cron système...) plutôt que par un
  scheduler intégré.
- Les modèles de messages sont gérés de façon ad-hoc (message libre pré-rempli)
  plutôt que via une bibliothèque de templates dédiée en base.
- Le stockage de fichiers utilise le disque local en développement si aucune
  variable `S3_*` n'est configurée (voir `src/lib/storage.ts`).

## Démarrage local

### 1. Prérequis

- Node.js 20+
- PostgreSQL 14+

### 2. Installation

```bash
npm install
cp .env.example .env
# Renseignez DATABASE_URL, NEXTAUTH_SECRET (openssl rand -base64 32), etc.
```

### 3. Base de données

```bash
npx prisma migrate dev   # crée les tables
npm run db:seed          # données de démonstration (entreprise "Studio Nova")
```

Compte de démonstration créé par le seed :

- Email : `demo@flotik.app`
- Mot de passe : `password123`
- Page publique : `/p/studio-nova`

### 4. Lancer l'application

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

### 5. Stripe (optionnel en local)

Sans clés Stripe configurées, l'application fonctionne normalement mais les
boutons de paiement affichent un message indiquant que le paiement n'est pas
encore configuré (jamais un paiement simulé).

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Renseignez `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`,
`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`.

### 6. Emails (optionnel en local)

Sans `RESEND_API_KEY`, les emails sont simplement journalisés dans la console
du serveur (`[email:dev] ...`) au lieu d'échouer le parcours utilisateur.

## Variables d'environnement

Voir `.env.example` pour la liste complète et commentée. Aucune clé secrète
n'est codée en dur dans le code source.

## Tests

```bash
npm run test        # tests unitaires (Vitest) : calculs de devis, tarification, slug, logique conditionnelle
npm run typecheck   # vérification TypeScript stricte
```

Un script de test de bout en bout couvre le parcours critique complet
(demande publique → connexion → devis → envoi → acceptation publique) :

```bash
npm run dev          # dans un terminal
npm run db:seed      # base fraîche
npm run test:e2e     # dans un second terminal (nécessite `playwright`)
```

## Déploiement en production

- Compatible Vercel (ou tout hébergeur Node.js).
- `npm run build` exécute `prisma generate` puis `next build`.
- Exécutez `npx prisma migrate deploy` lors du déploiement pour appliquer les migrations.
- Configurez un déclencheur périodique (ex. Vercel Cron) vers
  `GET /api/cron/reminders` (protégé par `CRON_SECRET` si défini) pour les relances.
- Configurez le webhook Stripe vers `https://votre-domaine/api/webhooks/stripe`.
- Pour le stockage de fichiers en production, configurez les variables `S3_*`
  (compatible AWS S3 ou tout stockage compatible S3).

## Sécurité

- Mots de passe hashés avec bcrypt (jamais stockés en clair).
- Toutes les routes de tableau de bord vérifient la session et scoppent les
  requêtes Prisma par `businessId` — une entreprise ne peut jamais accéder aux
  données d'une autre, y compris en modifiant un identifiant dans l'URL.
- Validation systématique des entrées côté serveur avec Zod.
- Limitation de débit basique sur les formulaires publics et les actions de devis.
- Uploads limités en taille (10 Mo) et en types MIME autorisés.
- Les paiements ne sont jamais considérés comme valides côté client : seul le
  webhook Stripe signé met à jour le statut d'un paiement ou d'un abonnement.

## Architecture du projet

```
app/                     Routes Next.js (pages + API route handlers)
  api/                   Endpoints backend (auth, business, quotes, stripe, public...)
  dashboard/             Espace entrepreneur (protégé)
  admin/                 Back-office plateforme (rôle ADMIN)
  p/[slug]/              Page publique d'une entreprise
  devis/[token]/         Page publique d'acceptation d'un devis
src/
  components/            Composants React réutilisables
  lib/                   Logique métier partagée (auth, pricing, stripe, storage...)
  emails/                Templates d'emails transactionnels
prisma/
  schema.prisma          Modèle de données complet
  seed.ts                Données de démonstration réalistes
tests/
  unit/                  Tests Vitest
  e2e-smoke.mjs           Script de bout en bout du parcours critique
```
