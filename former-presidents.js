// ============================================================
// Présidents de la Ve République (1958 -> aujourd'hui)
// Dates d'élection = date du scrutin (2e tour quand il y en a un).
// Aucune photo fournie : avatars générés (initiales), comme pour
// les candidats sans photo. Remplaçable via un champ "photo" si
// des images sous licence libre sont fournies plus tard.
// ============================================================
const FORMER_PRESIDENTS = [
  { id: 'degaulle', nom: 'Charles de Gaulle', parti: 'Union pour la Nouvelle République', couleur: '#264653', dateElection: '21 décembre 1958', note: 'Élu par un collège électoral élargi (avant la réforme du suffrage universel direct de 1962).' },
  { id: 'pompidou', nom: 'Georges Pompidou', parti: 'Union des démocrates pour la République', couleur: '#1d3557', dateElection: '15 juin 1969' },
  { id: 'giscard', nom: 'Valéry Giscard d\'Estaing', parti: 'Républicains indépendants', couleur: '#457b9d', dateElection: '19 mai 1974' },
  { id: 'mitterrand', nom: 'François Mitterrand', parti: 'Parti socialiste', couleur: '#e63946', dateElection: '10 mai 1981', note: 'Réélu en 1988.' },
  { id: 'chirac', nom: 'Jacques Chirac', parti: 'Rassemblement pour la République', couleur: '#1d3557', dateElection: '7 mai 1995', note: 'Réélu en 2002.' },
  { id: 'sarkozy', nom: 'Nicolas Sarkozy', parti: 'Union pour un mouvement populaire', couleur: '#264653', dateElection: '6 mai 2007' },
  { id: 'hollande', nom: 'François Hollande', parti: 'Parti socialiste', couleur: '#e63946', dateElection: '6 mai 2012' },
  { id: 'macron', nom: 'Emmanuel Macron', parti: 'La République En Marche', couleur: '#7b2cbf', dateElection: '7 mai 2017', note: 'Réélu en 2022.' }
];
