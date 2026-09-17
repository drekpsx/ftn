export const REQUEST_STATUS_LABELS: Record<string, string> = {
  NEW: 'Nouvelle',
  TO_PROCESS: 'À traiter',
  QUOTE_TO_PREPARE: 'Devis à préparer',
  QUOTE_SENT: 'Devis envoyé',
  WAITING: 'En attente',
  ACCEPTED: 'Acceptée',
  REFUSED: 'Refusée',
  DONE: 'Terminée',
};

export const REQUEST_STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-blue-100 text-blue-700',
  TO_PROCESS: 'bg-amber-100 text-amber-700',
  QUOTE_TO_PREPARE: 'bg-purple-100 text-purple-700',
  QUOTE_SENT: 'bg-indigo-100 text-indigo-700',
  WAITING: 'bg-gray-100 text-gray-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REFUSED: 'bg-red-100 text-red-700',
  DONE: 'bg-gray-200 text-gray-600',
};

export const REQUEST_STATUS_DOT: Record<string, string> = {
  NEW: 'bg-blue-500',
  TO_PROCESS: 'bg-amber-500',
  QUOTE_TO_PREPARE: 'bg-purple-500',
  QUOTE_SENT: 'bg-indigo-500',
  WAITING: 'bg-gray-400',
  ACCEPTED: 'bg-emerald-500',
  REFUSED: 'bg-red-500',
  DONE: 'bg-gray-400',
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Brouillon',
  SENT: 'Envoyé',
  VIEWED: 'Vu',
  ACCEPTED: 'Accepté',
  REFUSED: 'Refusé',
  EXPIRED: 'Expiré',
};

export const QUOTE_STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-600',
  SENT: 'bg-indigo-100 text-indigo-700',
  VIEWED: 'bg-blue-100 text-blue-700',
  ACCEPTED: 'bg-emerald-100 text-emerald-700',
  REFUSED: 'bg-red-100 text-red-700',
  EXPIRED: 'bg-amber-100 text-amber-700',
};
