// ============================================================
// Grilles de mots croises ET mots fleches - Presidents de la France
// Deux variantes par niveau ET par mode (GAME_GRIDS[niveau][mode] est
// un TABLEAU de grilles, pas un objet unique) : le jeu en tire une au
// hasard a chaque nouvelle partie, pour limiter la repetition des
// memes definitions. Le chevauchement de mots entre les 2 variantes
// d'un meme mode est proche de 0, et le chevauchement entre croises
// et fleches (memes definitions "trop similaires" signalees) a ete
// reduit a environ 40-60% via un tirage decorrele par mode dans un
// pool de mots elargi.
//  - croises : cases noires separatrices, definitions numerotees
//    listees a part (Horizontalement/Verticalement).
//  - fleches : case de definition dediee juste avant chaque mot
//    (case grisee + fleche), aucune liste externe.
// Grilles figees et verifiees (0 conflit, 0 mot non place) : le
// jeu ne genere rien a l executution, il rejoue ces donnees.
// ============================================================

const GAME_GRIDS = {
  facile: {
    croises: [
      {
        rows: 18,
        cols: 17,
        words: [
          {
            word: "PROGRAMME",
            clue: "Ensemble des propositions d'un candidat",
            dir: "H",
            row: 9,
            col: 4,
            number: 13
          },
          {
            word: "HOLLANDE",
            clue: "Président de 2012 à 2017",
            dir: "V",
            row: 8,
            col: 6,
            number: 12
          },
          {
            word: "CAMPAGNE",
            clue: "Période avant une élection, avec meetings et débats",
            dir: "V",
            row: 6,
            col: 4,
            number: 9
          },
          {
            word: "BULLETIN",
            clue: "Papier sur lequel on vote",
            dir: "V",
            row: 5,
            col: 12,
            number: 7
          },
          {
            word: "CIVISME",
            clue: "Sens du devoir envers la collectivité",
            dir: "V",
            row: 4,
            col: 10,
            number: 4
          },
          {
            word: "MEETING",
            clue: "Grand rassemblement politique",
            dir: "H",
            row: 15,
            col: 5,
            number: 18
          },
          {
            word: "ISOLOIR",
            clue: "Cabine où l'on vote seul",
            dir: "V",
            row: 3,
            col: 8,
            number: 3
          },
          {
            word: "AFFICHE",
            clue: "Support de propagande électorale placardé",
            dir: "H",
            row: 6,
            col: 0,
            number: 8
          },
          {
            word: "SARKOZY",
            clue: "Président de 2007 à 2012",
            dir: "V",
            row: 5,
            col: 0,
            number: 6
          },
          {
            word: "GAULLE",
            clue: "Fondateur de la Ve République",
            dir: "V",
            row: 1,
            col: 6,
            number: 1
          },
          {
            word: "DEPUTE",
            clue: "Membre élu de l'Assemblée nationale",
            dir: "V",
            row: 11,
            col: 8,
            number: 14
          },
          {
            word: "CHIRAC",
            clue: "Président de 1995 à 2007",
            dir: "H",
            row: 2,
            col: 2,
            number: 2
          },
          {
            word: "MANDAT",
            clue: "Durée d'exercice du pouvoir présidentiel",
            dir: "H",
            row: 12,
            col: 10,
            number: 16
          },
          {
            word: "MAIRE",
            clue: "Premier élu d'une commune",
            dir: "H",
            row: 13,
            col: 0,
            number: 17
          },
          {
            word: "PARIS",
            clue: "Ville où se trouve le palais de l'Élysée",
            dir: "V",
            row: 11,
            col: 14,
            number: 15
          },
          {
            word: "LISTE",
            clue: "Registre des électeurs inscrits",
            dir: "H",
            row: 7,
            col: 12,
            number: 10
          },
          {
            word: "TOUR",
            clue: "Premier ... et second ... de la présidentielle",
            dir: "V",
            row: 7,
            col: 15,
            number: 11
          },
          {
            word: "URNE",
            clue: "Boîte où l'on dépose son bulletin",
            dir: "V",
            row: 4,
            col: 16,
            number: 5
          }
        ]
      },
      {
        rows: 18,
        cols: 17,
        words: [
          {
            word: "REPUBLIQUE",
            clue: "Régime politique de la France depuis 1792",
            dir: "H",
            row: 9,
            col: 3,
            number: 13
          },
          {
            word: "MATIGNON",
            clue: "Résidence du Premier ministre",
            dir: "V",
            row: 6,
            col: 9,
            number: 10
          },
          {
            word: "ELECTEUR",
            clue: "Personne inscrite sur les listes électorales",
            dir: "V",
            row: 2,
            col: 3,
            number: 5
          },
          {
            word: "SUFFRAGE",
            clue: "Droit de vote, universel depuis 1944 pour les femmes",
            dir: "V",
            row: 8,
            col: 6,
            number: 12
          },
          {
            word: "BRIGITTE",
            clue: "Épouse d'Emmanuel Macron",
            dir: "V",
            row: 2,
            col: 12,
            number: 6
          },
          {
            word: "PANCARTE",
            clue: "Affiche brandie en meeting ou manifestation",
            dir: "H",
            row: 5,
            col: 0,
            number: 9
          },
          {
            word: "SCRUTIN",
            clue: "Ensemble des opérations de vote",
            dir: "H",
            row: 3,
            col: 10,
            number: 7
          },
          {
            word: "SONDAGE",
            clue: "Enquête d'opinion avant une élection",
            dir: "H",
            row: 12,
            col: 8,
            number: 14
          },
          {
            word: "DRAPEAU",
            clue: "Symbole tricolore de la France",
            dir: "H",
            row: 13,
            col: 1,
            number: 16
          },
          {
            word: "YVONNE",
            clue: "Épouse de Charles de Gaulle",
            dir: "H",
            row: 15,
            col: 1,
            number: 17
          },
          {
            word: "MACRON",
            clue: "Président élu en 2017 et réélu en 2022",
            dir: "V",
            row: 4,
            col: 1,
            number: 8
          },
          {
            word: "DROITE",
            clue: "Camp politique conservateur",
            dir: "V",
            row: 1,
            col: 6,
            number: 2
          },
          {
            word: "NATION",
            clue: "Communauté politique et territoriale",
            dir: "V",
            row: 1,
            col: 14,
            number: 3
          },
          {
            word: "ELYSEE",
            clue: "Résidence officielle du président",
            dir: "V",
            row: 0,
            col: 10,
            number: 1
          },
          {
            word: "DEBAT",
            clue: "Confrontation télévisée entre candidats",
            dir: "V",
            row: 12,
            col: 11,
            number: 15
          },
          {
            word: "CARLA",
            clue: "Épouse de Nicolas Sarkozy",
            dir: "H",
            row: 15,
            col: 10,
            number: 18
          },
          {
            word: "VOTE",
            clue: "Action d'exprimer son choix à une élection",
            dir: "H",
            row: 2,
            col: 0,
            number: 4
          },
          {
            word: "ETAT",
            clue: "Structure politique souveraine",
            dir: "H",
            row: 7,
            col: 7,
            number: 11
          }
        ]
      }
    ],
    fleches: [
      {
        rows: 20,
        cols: 19,
        words: [
          {
            word: "REPUBLIQUE",
            clue: "Régime politique de la France depuis 1792",
            dir: "H",
            row: 10,
            col: 4,
            clueRow: 10,
            clueCol: 3
          },
          {
            word: "HOLLANDE",
            clue: "Président de 2012 à 2017",
            dir: "V",
            row: 3,
            col: 5,
            clueRow: 2,
            clueCol: 5
          },
          {
            word: "CAMPAGNE",
            clue: "Période avant une élection, avec meetings et débats",
            dir: "V",
            row: 3,
            col: 13,
            clueRow: 2,
            clueCol: 13
          },
          {
            word: "SUFFRAGE",
            clue: "Droit de vote, universel depuis 1944 pour les femmes",
            dir: "V",
            row: 9,
            col: 7,
            clueRow: 8,
            clueCol: 7
          },
          {
            word: "SONDAGE",
            clue: "Enquête d'opinion avant une élection",
            dir: "H",
            row: 4,
            col: 4,
            clueRow: 4,
            clueCol: 3
          },
          {
            word: "MEETING",
            clue: "Grand rassemblement politique",
            dir: "V",
            row: 6,
            col: 10,
            clueRow: 5,
            clueCol: 10
          },
          {
            word: "ISOLOIR",
            clue: "Cabine où l'on vote seul",
            dir: "H",
            row: 6,
            col: 2,
            clueRow: 6,
            clueCol: 1
          },
          {
            word: "DRAPEAU",
            clue: "Symbole tricolore de la France",
            dir: "H",
            row: 14,
            col: 5,
            clueRow: 14,
            clueCol: 4
          },
          {
            word: "CHIRAC",
            clue: "Président de 1995 à 2007",
            dir: "H",
            row: 3,
            col: 13,
            clueRow: 3,
            clueCol: 12
          },
          {
            word: "ELYSEE",
            clue: "Résidence officielle du président",
            dir: "H",
            row: 16,
            col: 7,
            clueRow: 16,
            clueCol: 6
          },
          {
            word: "NATION",
            clue: "Communauté politique et territoriale",
            dir: "H",
            row: 7,
            col: 12,
            clueRow: 7,
            clueCol: 11
          },
          {
            word: "DEPUTE",
            clue: "Membre élu de l'Assemblée nationale",
            dir: "V",
            row: 14,
            col: 5,
            clueRow: 13,
            clueCol: 5
          },
          {
            word: "GAULLE",
            clue: "Fondateur de la Ve République",
            dir: "H",
            row: 12,
            col: 10,
            clueRow: 12,
            clueCol: 9
          },
          {
            word: "LISTE",
            clue: "Registre des électeurs inscrits",
            dir: "V",
            row: 5,
            col: 2,
            clueRow: 4,
            clueCol: 2
          },
          {
            word: "PARIS",
            clue: "Ville où se trouve le palais de l'Élysée",
            dir: "V",
            row: 1,
            col: 16,
            clueRow: 0,
            clueCol: 16
          },
          {
            word: "VOTE",
            clue: "Action d'exprimer son choix à une élection",
            dir: "V",
            row: 1,
            col: 10,
            clueRow: 0,
            clueCol: 10
          },
          {
            word: "TOUR",
            clue: "Premier ... et second ... de la présidentielle",
            dir: "H",
            row: 17,
            col: 3,
            clueRow: 17,
            clueCol: 2
          },
          {
            word: "URNE",
            clue: "Boîte où l'on dépose son bulletin",
            dir: "H",
            row: 15,
            col: 2,
            clueRow: 15,
            clueCol: 1
          }
        ]
      },
      {
        rows: 20,
        cols: 19,
        words: [
          {
            word: "PROGRAMME",
            clue: "Ensemble des propositions d'un candidat",
            dir: "H",
            row: 10,
            col: 5,
            clueRow: 10,
            clueCol: 4
          },
          {
            word: "ELECTEUR",
            clue: "Personne inscrite sur les listes électorales",
            dir: "V",
            row: 3,
            col: 6,
            clueRow: 2,
            clueCol: 6
          },
          {
            word: "MATIGNON",
            clue: "Résidence du Premier ministre",
            dir: "V",
            row: 6,
            col: 8,
            clueRow: 5,
            clueCol: 8
          },
          {
            word: "BULLETIN",
            clue: "Papier sur lequel on vote",
            dir: "V",
            row: 6,
            col: 13,
            clueRow: 5,
            clueCol: 13
          },
          {
            word: "PANCARTE",
            clue: "Affiche brandie en meeting ou manifestation",
            dir: "V",
            row: 10,
            col: 5,
            clueRow: 9,
            clueCol: 5
          },
          {
            word: "BRIGITTE",
            clue: "Épouse d'Emmanuel Macron",
            dir: "H",
            row: 12,
            col: 11,
            clueRow: 12,
            clueCol: 10
          },
          {
            word: "SARKOZY",
            clue: "Président de 2007 à 2012",
            dir: "H",
            row: 15,
            col: 3,
            clueRow: 15,
            clueCol: 2
          },
          {
            word: "CIVISME",
            clue: "Sens du devoir envers la collectivité",
            dir: "V",
            row: 11,
            col: 15,
            clueRow: 10,
            clueCol: 15
          },
          {
            word: "AFFICHE",
            clue: "Support de propagande électorale placardé",
            dir: "V",
            row: 6,
            col: 18,
            clueRow: 5,
            clueCol: 18
          },
          {
            word: "SCRUTIN",
            clue: "Ensemble des opérations de vote",
            dir: "H",
            row: 7,
            col: 10,
            clueRow: 7,
            clueCol: 9
          },
          {
            word: "DROITE",
            clue: "Camp politique conservateur",
            dir: "H",
            row: 3,
            col: 1,
            clueRow: 3,
            clueCol: 0
          },
          {
            word: "MANDAT",
            clue: "Durée d'exercice du pouvoir présidentiel",
            dir: "H",
            row: 7,
            col: 1,
            clueRow: 7,
            clueCol: 0
          },
          {
            word: "YVONNE",
            clue: "Épouse de Charles de Gaulle",
            dir: "H",
            row: 5,
            col: 1,
            clueRow: 5,
            clueCol: 0
          },
          {
            word: "MACRON",
            clue: "Président élu en 2017 et réélu en 2022",
            dir: "H",
            row: 13,
            col: 3,
            clueRow: 13,
            clueCol: 2
          },
          {
            word: "MAIRE",
            clue: "Premier élu d'une commune",
            dir: "H",
            row: 17,
            col: 1,
            clueRow: 17,
            clueCol: 0
          },
          {
            word: "CARLA",
            clue: "Épouse de Nicolas Sarkozy",
            dir: "H",
            row: 11,
            col: 1,
            clueRow: 11,
            clueCol: 0
          },
          {
            word: "DEBAT",
            clue: "Confrontation télévisée entre candidats",
            dir: "H",
            row: 17,
            col: 14,
            clueRow: 17,
            clueCol: 13
          },
          {
            word: "ETAT",
            clue: "Structure politique souveraine",
            dir: "V",
            row: 9,
            col: 2,
            clueRow: 8,
            clueCol: 2
          }
        ]
      }
    ]
  },
  moyen: {
    croises: [
      {
        rows: 22,
        cols: 21,
        words: [
          {
            word: "CONSTITUTIONNEL",
            clue: "Conseil qui valide les candidatures",
            dir: "H",
            row: 11,
            col: 3,
            number: 13
          },
          {
            word: "PROPORTIONNELLE",
            clue: "Mode de scrutin attribuant des sièges selon les voix obtenues",
            dir: "V",
            row: 7,
            col: 4,
            number: 9
          },
          {
            word: "CIRCONSCRIPTION",
            clue: "Zone géographique représentée par un élu",
            dir: "V",
            row: 5,
            col: 6,
            number: 7
          },
          {
            word: "LEGISLATIVES",
            clue: "Élections qui désignent les députés",
            dir: "V",
            row: 8,
            col: 8,
            number: 10
          },
          {
            word: "MITTERRAND",
            clue: "Président ayant aboli la peine de mort",
            dir: "V",
            row: 9,
            col: 11,
            number: 11
          },
          {
            word: "SEPARATION",
            clue: "... des pouvoirs : principe fondamental de la démocratie",
            dir: "V",
            row: 3,
            col: 13,
            number: 5
          },
          {
            word: "UNINOMINAL",
            clue: "Scrutin où l'on vote pour une seule personne",
            dir: "V",
            row: 10,
            col: 15,
            number: 12
          },
          {
            word: "BERNADETTE",
            clue: "Épouse de Jacques Chirac",
            dir: "H",
            row: 21,
            col: 3,
            number: 19
          },
          {
            word: "ASSEMBLEE",
            clue: "Chambre basse du Parlement",
            dir: "V",
            row: 5,
            col: 17,
            number: 8
          },
          {
            word: "COALITION",
            clue: "Alliance de plusieurs partis",
            dir: "H",
            row: 19,
            col: 12,
            number: 18
          },
          {
            word: "DISSOUDRE",
            clue: "Verbe : mettre fin à l'Assemblée nationale",
            dir: "H",
            row: 3,
            col: 11,
            number: 4
          },
          {
            word: "PARLEMENT",
            clue: "Assemblée + Sénat réunis",
            dir: "V",
            row: 12,
            col: 20,
            number: 14
          },
          {
            word: "RETRAITE",
            clue: "Réforme repoussant l'âge à 64 ans",
            dir: "V",
            row: 14,
            col: 18,
            number: 16
          },
          {
            word: "CANDIDAT",
            clue: "Personne qui se présente à une élection",
            dir: "V",
            row: 0,
            col: 11,
            number: 1
          },
          {
            word: "TAUBIRA",
            clue: "Ministre de la loi sur le mariage homosexuel (2013)",
            dir: "H",
            row: 1,
            col: 10,
            number: 2
          },
          {
            word: "REFORME",
            clue: "Changement important d'une loi ou d'un système",
            dir: "V",
            row: 2,
            col: 19,
            number: 3
          },
          {
            word: "GISCARD",
            clue: "Président de 1974 à 1981",
            dir: "H",
            row: 5,
            col: 3,
            number: 6
          },
          {
            word: "MOTION",
            clue: "... de censure : procédure pour renverser le gouvernement",
            dir: "V",
            row: 15,
            col: 13,
            number: 17
          },
          {
            word: "SENAT",
            clue: "Chambre haute du Parlement",
            dir: "H",
            row: 13,
            col: 0,
            number: 15
          }
        ]
      },
      {
        rows: 22,
        cols: 21,
        words: [
          {
            word: "CONSTITUTIONNEL",
            clue: "Conseil qui valide les candidatures",
            dir: "H",
            row: 11,
            col: 3,
            number: 13
          },
          {
            word: "COHABITATION",
            clue: "Président avec un 1er ministre opposé",
            dir: "V",
            row: 10,
            col: 4,
            number: 12
          },
          {
            word: "INVALIDATION",
            clue: "Annulation d'une élection par le Conseil constitutionnel",
            dir: "V",
            row: 3,
            col: 7,
            number: 6
          },
          {
            word: "REPRESENTANT",
            clue: "Élu qui parle au nom de ses électeurs",
            dir: "V",
            row: 3,
            col: 9,
            number: 7
          },
          {
            word: "GOUVERNEMENT",
            clue: "Équipe dirigée par le Premier ministre",
            dir: "V",
            row: 0,
            col: 11,
            number: 3
          },
          {
            word: "QUINQUENNAT",
            clue: "Durée de 5 ans du mandat depuis 2000",
            dir: "V",
            row: 8,
            col: 14,
            number: 11
          },
          {
            word: "BALLOTTAGE",
            clue: "Second tour quand personne n'a la majorité au premier",
            dir: "V",
            row: 2,
            col: 16,
            number: 5
          },
          {
            word: "OPPOSITION",
            clue: "Partis qui ne soutiennent pas le gouvernement",
            dir: "H",
            row: 20,
            col: 4,
            number: 19
          },
          {
            word: "REFERENDUM",
            clue: "Consultation directe des citoyens",
            dir: "H",
            row: 14,
            col: 11,
            number: 15
          },
          {
            word: "ABSTENTION",
            clue: "Fait de ne pas voter",
            dir: "H",
            row: 16,
            col: 1,
            number: 16
          },
          {
            word: "ASSEMBLEE",
            clue: "Chambre basse du Parlement",
            dir: "H",
            row: 7,
            col: 1,
            number: 9
          },
          {
            word: "ELECTORAT",
            clue: "Ensemble des électeurs inscrits",
            dir: "H",
            row: 18,
            col: 0,
            number: 18
          },
          {
            word: "UNIVERSEL",
            clue: "Suffrage ... : tous les citoyens majeurs votent",
            dir: "V",
            row: 13,
            col: 17,
            number: 14
          },
          {
            word: "SEPTENNAT",
            clue: "Durée du mandat avant 2000 (7 ans)",
            dir: "V",
            row: 0,
            col: 1,
            number: 1
          },
          {
            word: "DANIELLE",
            clue: "Épouse de François Mitterrand",
            dir: "H",
            row: 17,
            col: 13,
            number: 17
          },
          {
            word: "MAJORITE",
            clue: "Camp qui dispose de plus de la moitié des sièges",
            dir: "H",
            row: 1,
            col: 8,
            number: 4
          },
          {
            word: "MINISTRE",
            clue: "Membre du gouvernement",
            dir: "V",
            row: 0,
            col: 4,
            number: 2
          },
          {
            word: "POMPIDOU",
            clue: "Président mort en fonction en 1974",
            dir: "V",
            row: 7,
            col: 19,
            number: 10
          },
          {
            word: "PARITE",
            clue: "Égalité femmes-hommes en politique",
            dir: "H",
            row: 5,
            col: 9,
            number: 8
          }
        ]
      }
    ],
    fleches: [
      {
        rows: 22,
        cols: 21,
        words: [
          {
            word: "CONSTITUTIONNEL",
            clue: "Conseil qui valide les candidatures",
            dir: "H",
            row: 11,
            col: 3,
            clueRow: 11,
            clueCol: 2
          },
          {
            word: "PROPORTIONNELLE",
            clue: "Mode de scrutin attribuant des sièges selon les voix obtenues",
            dir: "V",
            row: 7,
            col: 4,
            clueRow: 6,
            clueCol: 4
          },
          {
            word: "REPRESENTANT",
            clue: "Élu qui parle au nom de ses électeurs",
            dir: "V",
            row: 6,
            col: 6,
            clueRow: 5,
            clueCol: 6
          },
          {
            word: "INVALIDATION",
            clue: "Annulation d'une élection par le Conseil constitutionnel",
            dir: "V",
            row: 6,
            col: 8,
            clueRow: 5,
            clueCol: 8
          },
          {
            word: "LEGISLATIVES",
            clue: "Élections qui désignent les députés",
            dir: "V",
            row: 4,
            col: 11,
            clueRow: 3,
            clueCol: 11
          },
          {
            word: "GOUVERNEMENT",
            clue: "Équipe dirigée par le Premier ministre",
            dir: "V",
            row: 10,
            col: 13,
            clueRow: 9,
            clueCol: 13
          },
          {
            word: "BALLOTTAGE",
            clue: "Second tour quand personne n'a la majorité au premier",
            dir: "V",
            row: 2,
            col: 16,
            clueRow: 1,
            clueCol: 16
          },
          {
            word: "BERNADETTE",
            clue: "Épouse de Jacques Chirac",
            dir: "H",
            row: 19,
            col: 7,
            clueRow: 19,
            clueCol: 6
          },
          {
            word: "UNINOMINAL",
            clue: "Scrutin où l'on vote pour une seule personne",
            dir: "H",
            row: 4,
            col: 2,
            clueRow: 4,
            clueCol: 1
          },
          {
            word: "SEPTENNAT",
            clue: "Durée du mandat avant 2000 (7 ans)",
            dir: "H",
            row: 13,
            col: 1,
            clueRow: 13,
            clueCol: 0
          },
          {
            word: "PARLEMENT",
            clue: "Assemblée + Sénat réunis",
            dir: "V",
            row: 13,
            col: 16,
            clueRow: 12,
            clueCol: 16
          },
          {
            word: "ELECTORAT",
            clue: "Ensemble des électeurs inscrits",
            dir: "H",
            row: 21,
            col: 2,
            clueRow: 21,
            clueCol: 1
          },
          {
            word: "DISSOUDRE",
            clue: "Verbe : mettre fin à l'Assemblée nationale",
            dir: "V",
            row: 11,
            col: 1,
            clueRow: 10,
            clueCol: 1
          },
          {
            word: "RETRAITE",
            clue: "Réforme repoussant l'âge à 64 ans",
            dir: "H",
            row: 15,
            col: 13,
            clueRow: 15,
            clueCol: 12
          },
          {
            word: "MINISTRE",
            clue: "Membre du gouvernement",
            dir: "V",
            row: 14,
            col: 18,
            clueRow: 13,
            clueCol: 18
          },
          {
            word: "MAJORITE",
            clue: "Camp qui dispose de plus de la moitié des sièges",
            dir: "H",
            row: 6,
            col: 13,
            clueRow: 6,
            clueCol: 12
          },
          {
            word: "REFORME",
            clue: "Changement important d'une loi ou d'un système",
            dir: "V",
            row: 14,
            col: 20,
            clueRow: 13,
            clueCol: 20
          },
          {
            word: "TAUBIRA",
            clue: "Ministre de la loi sur le mariage homosexuel (2013)",
            dir: "H",
            row: 2,
            col: 13,
            clueRow: 2,
            clueCol: 12
          },
          {
            word: "SENAT",
            clue: "Chambre haute du Parlement",
            dir: "V",
            row: 17,
            col: 10,
            clueRow: 16,
            clueCol: 10
          }
        ]
      },
      {
        rows: 24,
        cols: 23,
        words: [
          {
            word: "CIRCONSCRIPTION",
            clue: "Zone géographique représentée par un élu",
            dir: "H",
            row: 12,
            col: 4,
            clueRow: 12,
            clueCol: 3
          },
          {
            word: "COHABITATION",
            clue: "Président avec un 1er ministre opposé",
            dir: "V",
            row: 12,
            col: 4,
            clueRow: 11,
            clueCol: 4
          },
          {
            word: "QUINQUENNAT",
            clue: "Durée de 5 ans du mandat depuis 2000",
            dir: "V",
            row: 9,
            col: 9,
            clueRow: 8,
            clueCol: 9
          },
          {
            word: "BALLOTTAGE",
            clue: "Second tour quand personne n'a la majorité au premier",
            dir: "V",
            row: 7,
            col: 15,
            clueRow: 6,
            clueCol: 15
          },
          {
            word: "ABSTENTION",
            clue: "Fait de ne pas voter",
            dir: "V",
            row: 5,
            col: 13,
            clueRow: 4,
            clueCol: 13
          },
          {
            word: "REFERENDUM",
            clue: "Consultation directe des citoyens",
            dir: "V",
            row: 12,
            col: 6,
            clueRow: 11,
            clueCol: 6
          },
          {
            word: "OPPOSITION",
            clue: "Partis qui ne soutiennent pas le gouvernement",
            dir: "V",
            row: 12,
            col: 17,
            clueRow: 11,
            clueCol: 17
          },
          {
            word: "SEPARATION",
            clue: "... des pouvoirs : principe fondamental de la démocratie",
            dir: "V",
            row: 3,
            col: 18,
            clueRow: 2,
            clueCol: 18
          },
          {
            word: "MITTERRAND",
            clue: "Président ayant aboli la peine de mort",
            dir: "H",
            row: 5,
            col: 6,
            clueRow: 5,
            clueCol: 5
          },
          {
            word: "ASSEMBLEE",
            clue: "Chambre basse du Parlement",
            dir: "V",
            row: 1,
            col: 6,
            clueRow: 0,
            clueCol: 6
          },
          {
            word: "COALITION",
            clue: "Alliance de plusieurs partis",
            dir: "V",
            row: 12,
            col: 11,
            clueRow: 11,
            clueCol: 11
          },
          {
            word: "UNIVERSEL",
            clue: "Suffrage ... : tous les citoyens majeurs votent",
            dir: "H",
            row: 23,
            col: 3,
            clueRow: 23,
            clueCol: 2
          },
          {
            word: "POMPIDOU",
            clue: "Président mort en fonction en 1974",
            dir: "H",
            row: 19,
            col: 13,
            clueRow: 19,
            clueCol: 12
          },
          {
            word: "MAJORITE",
            clue: "Camp qui dispose de plus de la moitié des sièges",
            dir: "V",
            row: 1,
            col: 11,
            clueRow: 0,
            clueCol: 11
          },
          {
            word: "CANDIDAT",
            clue: "Personne qui se présente à une élection",
            dir: "H",
            row: 21,
            col: 15,
            clueRow: 21,
            clueCol: 14
          },
          {
            word: "DANIELLE",
            clue: "Épouse de François Mitterrand",
            dir: "H",
            row: 7,
            col: 1,
            clueRow: 7,
            clueCol: 0
          },
          {
            word: "GISCARD",
            clue: "Président de 1974 à 1981",
            dir: "H",
            row: 17,
            col: 16,
            clueRow: 17,
            clueCol: 15
          },
          {
            word: "MOTION",
            clue: "... de censure : procédure pour renverser le gouvernement",
            dir: "H",
            row: 1,
            col: 11,
            clueRow: 1,
            clueCol: 10
          },
          {
            word: "PARITE",
            clue: "Égalité femmes-hommes en politique",
            dir: "H",
            row: 17,
            col: 1,
            clueRow: 17,
            clueCol: 0
          }
        ]
      }
    ]
  },
  difficile: {
    croises: [
      {
        rows: 24,
        cols: 23,
        words: [
          {
            word: "QUATREVINGTNEUF",
            clue: "Article constitutionnel sur la révision",
            dir: "H",
            row: 12,
            col: 4,
            number: 14
          },
          {
            word: "PARLEMENTARISME",
            clue: "Régime où le gouvernement dépend du Parlement",
            dir: "V",
            row: 3,
            col: 6,
            number: 4
          },
          {
            word: "MULTIPARTISME",
            clue: "Système avec de nombreux partis représentés",
            dir: "V",
            row: 5,
            col: 8,
            number: 7
          },
          {
            word: "INELIGIBILITE",
            clue: "Sanction qui empêche de se présenter à une élection",
            dir: "V",
            row: 8,
            col: 11,
            number: 10
          },
          {
            word: "SOUVERAINETE",
            clue: "Pouvoir suprême, populaire depuis la Révolution",
            dir: "V",
            row: 2,
            col: 14,
            number: 2
          },
          {
            word: "TECHNOCRATIE",
            clue: "Gouvernement exercé par des experts plutôt que des élus",
            dir: "V",
            row: 11,
            col: 16,
            number: 13
          },
          {
            word: "PROROGATION",
            clue: "Report de la date d'une session parlementaire",
            dir: "H",
            row: 19,
            col: 4,
            number: 17
          },
          {
            word: "TRIERWEILER",
            clue: "Compagne de Hollande à l'Élysée",
            dir: "H",
            row: 7,
            col: 0,
            number: 8
          },
          {
            word: "REMANIEMENT",
            clue: "Changement de composition du gouvernement",
            dir: "H",
            row: 22,
            col: 10,
            number: 18
          },
          {
            word: "INTERIMAIRE",
            clue: "Président par ... en cas de vacance du pouvoir",
            dir: "H",
            row: 5,
            col: 2,
            number: 6
          },
          {
            word: "DEONTOLOGIE",
            clue: "Règles éthiques encadrant les élus",
            dir: "H",
            row: 3,
            col: 12,
            number: 5
          },
          {
            word: "ABROGATION",
            clue: "Annulation d'une loi ou réforme",
            dir: "H",
            row: 7,
            col: 12,
            number: 9
          },
          {
            word: "EUROPEENNE",
            clue: "Convention présidée par Giscard",
            dir: "H",
            row: 16,
            col: 13,
            number: 16
          },
          {
            word: "ARBITRAGE",
            clue: "Rôle du président entre les pouvoirs, selon la Constitution",
            dir: "V",
            row: 3,
            col: 0,
            number: 3
          },
          {
            word: "HEMICYCLE",
            clue: "Salle en demi-cercle où siègent les députés",
            dir: "V",
            row: 15,
            col: 22,
            number: 15
          },
          {
            word: "IMMUNITE",
            clue: "Protection du président pendant son mandat",
            dir: "H",
            row: 9,
            col: 14,
            number: 11
          },
          {
            word: "POHER",
            clue: "Deux fois président par intérim (1969, 1974)",
            dir: "H",
            row: 3,
            col: 6,
            number: 4
          },
          {
            word: "COVID",
            clue: "Crise sanitaire du début du 2e mandat Macron",
            dir: "V",
            row: 0,
            col: 21,
            number: 1
          },
          {
            word: "OTAN",
            clue: "Alliance militaire réintégrée sous Sarkozy",
            dir: "H",
            row: 10,
            col: 3,
            number: 12
          }
        ]
      },
      {
        rows: 24,
        cols: 23,
        words: [
          {
            word: "QUATREVINGTNEUF",
            clue: "Article constitutionnel sur la révision",
            dir: "H",
            row: 12,
            col: 4,
            number: 10
          },
          {
            word: "PRESIDENTIELLE",
            clue: "Élection au suffrage universel direct depuis 1962",
            dir: "V",
            row: 4,
            col: 7,
            number: 3
          },
          {
            word: "BICAMERALISME",
            clue: "Système à deux chambres parlementaires",
            dir: "V",
            row: 7,
            col: 9,
            number: 7
          },
          {
            word: "CONSTITUANTE",
            clue: "Assemblée chargée de rédiger une constitution",
            dir: "V",
            row: 5,
            col: 5,
            number: 4
          },
          {
            word: "INVESTITURE",
            clue: "Cérémonie d'entrée en fonction du président",
            dir: "V",
            row: 12,
            col: 11,
            number: 11
          },
          {
            word: "DISSOLUTION",
            clue: "Pouvoir de mettre fin à l'Assemblée",
            dir: "V",
            row: 2,
            col: 12,
            number: 1
          },
          {
            word: "PARRAINAGES",
            clue: "Signatures d'élus pour être candidat",
            dir: "V",
            row: 6,
            col: 15,
            number: 6
          },
          {
            word: "EUROPEENNE",
            clue: "Convention présidée par Giscard",
            dir: "V",
            row: 11,
            col: 17,
            number: 9
          },
          {
            word: "ANNEAYMONE",
            clue: "Épouse de Giscard d'Estaing",
            dir: "H",
            row: 19,
            col: 0,
            number: 16
          },
          {
            word: "BIPARTISME",
            clue: "Système dominé par deux grands partis",
            dir: "H",
            row: 21,
            col: 7,
            number: 17
          },
          {
            word: "PLEBISCITE",
            clue: "Vote massif en faveur d'une personne ou d'une idée",
            dir: "H",
            row: 4,
            col: 7,
            number: 3
          },
          {
            word: "LEGITIMITE",
            clue: "Caractère de ce qui est reconnu comme fondé",
            dir: "V",
            row: 14,
            col: 13,
            number: 13
          },
          {
            word: "SUPPLEANT",
            clue: "Remplaçant potentiel d'un élu",
            dir: "V",
            row: 13,
            col: 0,
            number: 12
          },
          {
            word: "NUCLEAIRE",
            clue: "Force de dissuasion, décision présidentielle seule",
            dir: "V",
            row: 15,
            col: 3,
            number: 14
          },
          {
            word: "AMNISTIE",
            clue: "Effacement légal d'une infraction, souvent décidé par le pouvoir",
            dir: "H",
            row: 7,
            col: 15,
            number: 8
          },
          {
            word: "SEPTIEME",
            clue: "Rang du président occupé par Sarkozy",
            dir: "H",
            row: 23,
            col: 12,
            number: 18
          },
          {
            word: "OUTREMER",
            clue: "Territoires français hors de métropole",
            dir: "V",
            row: 5,
            col: 20,
            number: 5
          },
          {
            word: "CENSURE",
            clue: "Motion de ... pour renverser le gouvernement",
            dir: "H",
            row: 17,
            col: 16,
            number: 15
          },
          {
            word: "GRACIER",
            clue: "Pouvoir présidentiel d'annuler une peine",
            dir: "V",
            row: 3,
            col: 18,
            number: 2
          }
        ]
      }
    ],
    fleches: [
      {
        rows: 22,
        cols: 21,
        words: [
          {
            word: "QUATREVINGTNEUF",
            clue: "Article constitutionnel sur la révision",
            dir: "H",
            row: 11,
            col: 3,
            clueRow: 11,
            clueCol: 2
          },
          {
            word: "PARLEMENTARISME",
            clue: "Régime où le gouvernement dépend du Parlement",
            dir: "V",
            row: 2,
            col: 5,
            clueRow: 1,
            clueCol: 5
          },
          {
            word: "BICAMERALISME",
            clue: "Système à deux chambres parlementaires",
            dir: "V",
            row: 5,
            col: 7,
            clueRow: 4,
            clueCol: 7
          },
          {
            word: "SOUVERAINETE",
            clue: "Pouvoir suprême, populaire depuis la Révolution",
            dir: "V",
            row: 8,
            col: 9,
            clueRow: 7,
            clueCol: 9
          },
          {
            word: "INVESTITURE",
            clue: "Cérémonie d'entrée en fonction du président",
            dir: "V",
            row: 10,
            col: 11,
            clueRow: 9,
            clueCol: 11
          },
          {
            word: "REMANIEMENT",
            clue: "Changement de composition du gouvernement",
            dir: "V",
            row: 1,
            col: 13,
            clueRow: 0,
            clueCol: 13
          },
          {
            word: "INTERIMAIRE",
            clue: "Président par ... en cas de vacance du pouvoir",
            dir: "V",
            row: 8,
            col: 15,
            clueRow: 7,
            clueCol: 15
          },
          {
            word: "BIPARTISME",
            clue: "Système dominé par deux grands partis",
            dir: "H",
            row: 3,
            col: 2,
            clueRow: 3,
            clueCol: 1
          },
          {
            word: "ANNEAYMONE",
            clue: "Épouse de Giscard d'Estaing",
            dir: "H",
            row: 5,
            col: 11,
            clueRow: 5,
            clueCol: 10
          },
          {
            word: "ABROGATION",
            clue: "Annulation d'une loi ou réforme",
            dir: "H",
            row: 1,
            col: 11,
            clueRow: 1,
            clueCol: 10
          },
          {
            word: "HEMICYCLE",
            clue: "Salle en demi-cercle où siègent les députés",
            dir: "H",
            row: 19,
            col: 1,
            clueRow: 19,
            clueCol: 0
          },
          {
            word: "ARBITRAGE",
            clue: "Rôle du président entre les pouvoirs, selon la Constitution",
            dir: "V",
            row: 1,
            col: 2,
            clueRow: 0,
            clueCol: 2
          },
          {
            word: "AMNISTIE",
            clue: "Effacement légal d'une infraction, souvent décidé par le pouvoir",
            dir: "H",
            row: 8,
            col: 12,
            clueRow: 8,
            clueCol: 11
          },
          {
            word: "IMMUNITE",
            clue: "Protection du président pendant son mandat",
            dir: "H",
            row: 14,
            col: 13,
            clueRow: 14,
            clueCol: 12
          },
          {
            word: "OUTREMER",
            clue: "Territoires français hors de métropole",
            dir: "V",
            row: 13,
            col: 2,
            clueRow: 12,
            clueCol: 2
          },
          {
            word: "CENSURE",
            clue: "Motion de ... pour renverser le gouvernement",
            dir: "H",
            row: 20,
            col: 10,
            clueRow: 20,
            clueCol: 9
          },
          {
            word: "GRACIER",
            clue: "Pouvoir présidentiel d'annuler une peine",
            dir: "H",
            row: 17,
            col: 14,
            clueRow: 17,
            clueCol: 13
          },
          {
            word: "POHER",
            clue: "Deux fois président par intérim (1969, 1974)",
            dir: "V",
            row: 11,
            col: 20,
            clueRow: 10,
            clueCol: 20
          },
          {
            word: "OTAN",
            clue: "Alliance militaire réintégrée sous Sarkozy",
            dir: "V",
            row: 3,
            col: 15,
            clueRow: 2,
            clueCol: 15
          }
        ]
      },
      {
        rows: 24,
        cols: 23,
        words: [
          {
            word: "PRESIDENTIELLE",
            clue: "Élection au suffrage universel direct depuis 1962",
            dir: "H",
            row: 12,
            col: 4,
            clueRow: 12,
            clueCol: 3
          },
          {
            word: "BICAMERALISME",
            clue: "Système à deux chambres parlementaires",
            dir: "V",
            row: 6,
            col: 5,
            clueRow: 5,
            clueCol: 5
          },
          {
            word: "MULTIPARTISME",
            clue: "Système avec de nombreux partis représentés",
            dir: "V",
            row: 2,
            col: 7,
            clueRow: 1,
            clueCol: 7
          },
          {
            word: "INELIGIBILITE",
            clue: "Sanction qui empêche de se présenter à une élection",
            dir: "V",
            row: 10,
            col: 10,
            clueRow: 9,
            clueCol: 10
          },
          {
            word: "TECHNOCRATIE",
            clue: "Gouvernement exercé par des experts plutôt que des élus",
            dir: "V",
            row: 12,
            col: 12,
            clueRow: 11,
            clueCol: 12
          },
          {
            word: "CONSTITUANTE",
            clue: "Assemblée chargée de rédiger une constitution",
            dir: "V",
            row: 1,
            col: 14,
            clueRow: 0,
            clueCol: 14
          },
          {
            word: "TRIERWEILER",
            clue: "Compagne de Hollande à l'Élysée",
            dir: "V",
            row: 4,
            col: 16,
            clueRow: 3,
            clueCol: 16
          },
          {
            word: "PROROGATION",
            clue: "Report de la date d'une session parlementaire",
            dir: "H",
            row: 2,
            col: 12,
            clueRow: 2,
            clueCol: 11
          },
          {
            word: "PARRAINAGES",
            clue: "Signatures d'élus pour être candidat",
            dir: "H",
            row: 20,
            col: 5,
            clueRow: 20,
            clueCol: 4
          },
          {
            word: "DISSOLUTION",
            clue: "Pouvoir de mettre fin à l'Assemblée",
            dir: "H",
            row: 16,
            col: 2,
            clueRow: 16,
            clueCol: 1
          },
          {
            word: "INVESTITURE",
            clue: "Cérémonie d'entrée en fonction du président",
            dir: "H",
            row: 22,
            col: 12,
            clueRow: 22,
            clueCol: 11
          },
          {
            word: "DEONTOLOGIE",
            clue: "Règles éthiques encadrant les élus",
            dir: "H",
            row: 4,
            col: 1,
            clueRow: 4,
            clueCol: 0
          },
          {
            word: "LEGITIMITE",
            clue: "Caractère de ce qui est reconnu comme fondé",
            dir: "H",
            row: 2,
            col: 1,
            clueRow: 2,
            clueCol: 0
          },
          {
            word: "EUROPEENNE",
            clue: "Convention présidée par Giscard",
            dir: "H",
            row: 22,
            col: 1,
            clueRow: 22,
            clueCol: 0
          },
          {
            word: "PLEBISCITE",
            clue: "Vote massif en faveur d'une personne ou d'une idée",
            dir: "V",
            row: 14,
            col: 19,
            clueRow: 13,
            clueCol: 19
          },
          {
            word: "NUCLEAIRE",
            clue: "Force de dissuasion, décision présidentielle seule",
            dir: "V",
            row: 2,
            col: 22,
            clueRow: 1,
            clueCol: 22
          },
          {
            word: "SUPPLEANT",
            clue: "Remplaçant potentiel d'un élu",
            dir: "H",
            row: 16,
            col: 14,
            clueRow: 16,
            clueCol: 13
          },
          {
            word: "SEPTIEME",
            clue: "Rang du président occupé par Sarkozy",
            dir: "H",
            row: 7,
            col: 11,
            clueRow: 7,
            clueCol: 10
          },
          {
            word: "COVID",
            clue: "Crise sanitaire du début du 2e mandat Macron",
            dir: "H",
            row: 18,
            col: 12,
            clueRow: 18,
            clueCol: 11
          }
        ]
      }
    ]
  }
};
