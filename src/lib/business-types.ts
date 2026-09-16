export type ActivityId =
  | 'photographe'
  | 'tatoueur'
  | 'coiffeur'
  | 'prothesiste-ongulaire'
  | 'maquilleur'
  | 'coach'
  | 'consultant'
  | 'wedding-planner'
  | 'traiteur'
  | 'patissier'
  | 'artisan'
  | 'decorateur'
  | 'graphiste'
  | 'videaste'
  | 'developpeur'
  | 'prestataire-evenementiel'
  | 'agent-immobilier'
  | 'professeur'
  | 'therapeute'
  | 'autre';

export type DefaultField = {
  label: string;
  type:
    | 'TEXT'
    | 'TEXTAREA'
    | 'EMAIL'
    | 'PHONE'
    | 'NUMBER'
    | 'DATE'
    | 'TIME'
    | 'SELECT'
    | 'MULTISELECT'
    | 'BOOLEAN'
    | 'AMOUNT'
    | 'ADDRESS'
    | 'FILE';
  required: boolean;
  options?: string[];
};

export type DefaultService = {
  name: string;
  priceType: 'FIXED' | 'STARTING_AT' | 'RANGE' | 'ON_QUOTE';
  price?: number;
  priceMin?: number;
  priceMax?: number;
};

export const ACTIVITIES: {
  id: ActivityId;
  label: string;
  defaultServices: DefaultService[];
  defaultFields: DefaultField[];
}[] = [
  {
    id: 'photographe',
    label: 'Photographe',
    defaultServices: [
      { name: 'Shooting portrait', priceType: 'FIXED', price: 150 },
      { name: 'Shooting couple', priceType: 'FIXED', price: 220 },
      { name: 'Mariage', priceType: 'ON_QUOTE' },
    ],
    defaultFields: [
      { label: 'Date souhaitée', type: 'DATE', required: true },
      { label: "Type de shooting", type: 'SELECT', required: true, options: ['Portrait', 'Couple', 'Famille', 'Mariage', 'Événement'] },
      { label: 'Nombre de personnes', type: 'NUMBER', required: false },
      { label: 'Lieu', type: 'TEXT', required: false },
      { label: 'Budget', type: 'AMOUNT', required: false },
      { label: 'Photos de référence', type: 'FILE', required: false },
    ],
  },
  {
    id: 'tatoueur',
    label: 'Tatoueur',
    defaultServices: [
      { name: 'Petit tatouage', priceType: 'STARTING_AT', price: 80 },
      { name: 'Projet personnalisé', priceType: 'ON_QUOTE' },
    ],
    defaultFields: [
      { label: 'Zone du corps', type: 'TEXT', required: true },
      { label: 'Taille approximative', type: 'TEXT', required: false },
      { label: 'Style', type: 'SELECT', required: false, options: ['Fine line', 'Traditionnel', 'Réaliste', 'Japonais', 'Autre'] },
      { label: 'Noir & blanc ou couleur', type: 'SELECT', required: false, options: ['Noir & blanc', 'Couleur'] },
      { label: 'Image de référence', type: 'FILE', required: false },
      { label: 'Budget', type: 'AMOUNT', required: false },
    ],
  },
  {
    id: 'prestataire-evenementiel',
    label: 'Prestataire événementiel',
    defaultServices: [{ name: 'Organisation événement', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: "Type d'événement", type: 'TEXT', required: true },
      { label: 'Date', type: 'DATE', required: true },
      { label: "Nombre d'invités", type: 'NUMBER', required: false },
      { label: 'Lieu', type: 'TEXT', required: false },
      { label: 'Budget', type: 'AMOUNT', required: false },
      { label: 'Services souhaités', type: 'TEXTAREA', required: false },
    ],
  },
  {
    id: 'coiffeur',
    label: 'Coiffeur',
    defaultServices: [
      { name: 'Coupe', priceType: 'FIXED', price: 35 },
      { name: 'Coloration', priceType: 'STARTING_AT', price: 60 },
    ],
    defaultFields: [
      { label: 'Prestation souhaitée', type: 'TEXT', required: true },
      { label: 'Date et heure souhaitées', type: 'DATE', required: true },
      { label: 'Photo de référence', type: 'FILE', required: false },
    ],
  },
  {
    id: 'prothesiste-ongulaire',
    label: 'Prothésiste ongulaire',
    defaultServices: [
      { name: 'Pose complète', priceType: 'FIXED', price: 40 },
      { name: 'Nail art', priceType: 'STARTING_AT', price: 50 },
    ],
    defaultFields: [
      { label: 'Style souhaité', type: 'TEXT', required: false },
      { label: 'Date souhaitée', type: 'DATE', required: true },
      { label: 'Photo de référence', type: 'FILE', required: false },
    ],
  },
  {
    id: 'maquilleur',
    label: 'Maquilleur',
    defaultServices: [{ name: 'Maquillage événement', priceType: 'FIXED', price: 70 }],
    defaultFields: [
      { label: "Type d'événement", type: 'TEXT', required: true },
      { label: 'Date', type: 'DATE', required: true },
      { label: 'Lieu', type: 'TEXT', required: false },
    ],
  },
  {
    id: 'coach',
    label: 'Coach',
    defaultServices: [{ name: 'Séance individuelle', priceType: 'FIXED', price: 60 }],
    defaultFields: [
      { label: 'Objectif principal', type: 'TEXTAREA', required: true },
      { label: 'Disponibilités', type: 'TEXT', required: false },
    ],
  },
  {
    id: 'consultant',
    label: 'Consultant',
    defaultServices: [{ name: 'Consultation', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: 'Décrivez votre besoin', type: 'TEXTAREA', required: true },
      { label: 'Budget estimé', type: 'AMOUNT', required: false },
    ],
  },
  {
    id: 'wedding-planner',
    label: 'Wedding planner',
    defaultServices: [{ name: 'Organisation mariage', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: 'Date du mariage', type: 'DATE', required: true },
      { label: "Nombre d'invités", type: 'NUMBER', required: false },
      { label: 'Budget global', type: 'AMOUNT', required: false },
    ],
  },
  {
    id: 'traiteur',
    label: 'Traiteur',
    defaultServices: [{ name: 'Menu événementiel', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: "Type d'événement", type: 'TEXT', required: true },
      { label: 'Date', type: 'DATE', required: true },
      { label: 'Nombre de convives', type: 'NUMBER', required: false },
      { label: 'Régimes particuliers', type: 'TEXT', required: false },
    ],
  },
  {
    id: 'patissier',
    label: 'Pâtissier',
    defaultServices: [{ name: 'Gâteau sur mesure', priceType: 'STARTING_AT', price: 60 }],
    defaultFields: [
      { label: "Type de gâteau", type: 'TEXT', required: true },
      { label: 'Nombre de parts', type: 'NUMBER', required: false },
      { label: 'Date de retrait', type: 'DATE', required: true },
      { label: 'Photo d\'inspiration', type: 'FILE', required: false },
    ],
  },
  {
    id: 'artisan',
    label: 'Artisan',
    defaultServices: [{ name: 'Réalisation sur mesure', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: 'Décrivez votre projet', type: 'TEXTAREA', required: true },
      { label: 'Budget', type: 'AMOUNT', required: false },
    ],
  },
  {
    id: 'decorateur',
    label: 'Décorateur',
    defaultServices: [{ name: 'Décoration événement', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: "Type d'événement", type: 'TEXT', required: true },
      { label: 'Date', type: 'DATE', required: true },
      { label: 'Style souhaité', type: 'TEXT', required: false },
    ],
  },
  {
    id: 'graphiste',
    label: 'Graphiste',
    defaultServices: [{ name: 'Identité visuelle', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: 'Décrivez votre projet', type: 'TEXTAREA', required: true },
      { label: "Délai souhaité", type: 'TEXT', required: false },
      { label: 'Budget', type: 'AMOUNT', required: false },
    ],
  },
  {
    id: 'videaste',
    label: 'Vidéaste',
    defaultServices: [{ name: 'Vidéo événementielle', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: 'Type de vidéo', type: 'TEXT', required: true },
      { label: 'Date', type: 'DATE', required: false },
      { label: 'Durée souhaitée', type: 'TEXT', required: false },
    ],
  },
  {
    id: 'developpeur',
    label: 'Développeur freelance',
    defaultServices: [{ name: 'Développement sur mesure', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: 'Décrivez votre projet', type: 'TEXTAREA', required: true },
      { label: 'Budget estimé', type: 'AMOUNT', required: false },
      { label: 'Délai souhaité', type: 'TEXT', required: false },
    ],
  },
  {
    id: 'agent-immobilier',
    label: 'Agent immobilier',
    defaultServices: [{ name: 'Estimation bien', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: 'Type de bien', type: 'TEXT', required: true },
      { label: 'Ville', type: 'TEXT', required: false },
      { label: 'Budget', type: 'AMOUNT', required: false },
    ],
  },
  {
    id: 'professeur',
    label: 'Professeur particulier',
    defaultServices: [{ name: "Cours à l'heure", priceType: 'FIXED', price: 25 }],
    defaultFields: [
      { label: 'Matière', type: 'TEXT', required: true },
      { label: 'Niveau', type: 'TEXT', required: false },
      { label: 'Disponibilités', type: 'TEXT', required: false },
    ],
  },
  {
    id: 'therapeute',
    label: 'Thérapeute / praticien',
    defaultServices: [{ name: 'Séance', priceType: 'FIXED', price: 50 }],
    defaultFields: [
      { label: 'Motif de la demande', type: 'TEXTAREA', required: false },
      { label: 'Disponibilités', type: 'TEXT', required: false },
    ],
  },
  {
    id: 'autre',
    label: 'Autre',
    defaultServices: [{ name: 'Ma prestation', priceType: 'ON_QUOTE' }],
    defaultFields: [
      { label: 'Décrivez votre demande', type: 'TEXTAREA', required: true },
      { label: 'Date souhaitée', type: 'DATE', required: false },
      { label: 'Budget', type: 'AMOUNT', required: false },
    ],
  },
];

export function getActivity(id: string) {
  return ACTIVITIES.find((a) => a.id === id) ?? ACTIVITIES[ACTIVITIES.length - 1];
}
