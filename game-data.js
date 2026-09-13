// ============================================================
// Grilles de mots croises ET mots fleches - Presidents de la France
// Deux variantes distinctes par niveau (layouts differents) :
//  - croises : cases noires separatrices, definitions numerotees
//    listees a part (Horizontalement/Verticalement).
//  - fleches : case de definition dediee juste avant chaque mot
//    (case grisee + fleche), aucune liste externe.
// Grilles figees et verifiees (0 conflit, 0 mot non place) : le
// jeu ne genere rien a l executution, il rejoue ces donnees.
// ============================================================

const GAME_GRIDS = {
  facile: {
    croises: {
      rows: 16,
      cols: 15,
      words: [
        {
          word: "HOLLANDE",
          clue: "Président de 2012 à 2017",
          dir: "H",
          row: 9,
          col: 3,
          number: 12
        },
        {
          word: "BRIGITTE",
          clue: "Épouse d'Emmanuel Macron",
          dir: "V",
          row: 2,
          col: 10,
          number: 2
        },
        {
          word: "MATIGNON",
          clue: "Résidence du Premier ministre",
          dir: "V",
          row: 3,
          col: 4,
          number: 3
        },
        {
          word: "SARKOZY",
          clue: "Président de 2007 à 2012",
          dir: "V",
          row: 8,
          col: 7,
          number: 11
        },
        {
          word: "MACRON",
          clue: "Président élu en 2017 et réélu en 2022",
          dir: "V",
          row: 4,
          col: 8,
          number: 6
        },
        {
          word: "CHIRAC",
          clue: "Président de 1995 à 2007",
          dir: "V",
          row: 8,
          col: 3,
          number: 9
        },
        {
          word: "ELYSEE",
          clue: "Résidence officielle du président",
          dir: "V",
          row: 8,
          col: 5,
          number: 10
        },
        {
          word: "YVONNE",
          clue: "Épouse de Charles de Gaulle",
          dir: "H",
          row: 14,
          col: 7,
          number: 14
        },
        {
          word: "GAULLE",
          clue: "Fondateur de la Ve République",
          dir: "V",
          row: 6,
          col: 6,
          number: 8
        },
        {
          word: "DROITE",
          clue: "Camp politique conservateur",
          dir: "H",
          row: 3,
          col: 9,
          number: 4
        },
        {
          word: "CARLA",
          clue: "Épouse de Nicolas Sarkozy",
          dir: "H",
          row: 4,
          col: 0,
          number: 5
        },
        {
          word: "PARIS",
          clue: "Ville où se trouve le palais de l'Élysée",
          dir: "V",
          row: 0,
          col: 12,
          number: 1
        },
        {
          word: "VOTE",
          clue: "Action d'exprimer son choix à une élection",
          dir: "H",
          row: 5,
          col: 2,
          number: 7
        },
        {
          word: "URNE",
          clue: "Boîte où l'on dépose son bulletin",
          dir: "V",
          row: 12,
          col: 10,
          number: 13
        }
      ]
    },
    fleches: {
      rows: 17,
      cols: 14,
      words: [
        {
          word: "HOLLANDE",
          clue: "Président de 2012 à 2017",
          dir: "H",
          row: 8,
          col: 4,
          clueRow: 8,
          clueCol: 3
        },
        {
          word: "BRIGITTE",
          clue: "Épouse d'Emmanuel Macron",
          dir: "V",
          row: 1,
          col: 11,
          clueRow: 0,
          clueCol: 11
        },
        {
          word: "MATIGNON",
          clue: "Résidence du Premier ministre",
          dir: "V",
          row: 2,
          col: 5,
          clueRow: 1,
          clueCol: 5
        },
        {
          word: "SARKOZY",
          clue: "Président de 2007 à 2012",
          dir: "V",
          row: 7,
          col: 8,
          clueRow: 6,
          clueCol: 8
        },
        {
          word: "MACRON",
          clue: "Président élu en 2017 et réélu en 2022",
          dir: "V",
          row: 3,
          col: 9,
          clueRow: 2,
          clueCol: 9
        },
        {
          word: "CHIRAC",
          clue: "Président de 1995 à 2007",
          dir: "V",
          row: 7,
          col: 4,
          clueRow: 6,
          clueCol: 4
        },
        {
          word: "ELYSEE",
          clue: "Résidence officielle du président",
          dir: "V",
          row: 7,
          col: 6,
          clueRow: 6,
          clueCol: 6
        },
        {
          word: "YVONNE",
          clue: "Épouse de Charles de Gaulle",
          dir: "H",
          row: 13,
          col: 8,
          clueRow: 13,
          clueCol: 7
        },
        {
          word: "GAULLE",
          clue: "Fondateur de la Ve République",
          dir: "V",
          row: 5,
          col: 7,
          clueRow: 4,
          clueCol: 7
        },
        {
          word: "DROITE",
          clue: "Camp politique conservateur",
          dir: "H",
          row: 4,
          col: 1,
          clueRow: 4,
          clueCol: 0
        },
        {
          word: "CARLA",
          clue: "Épouse de Nicolas Sarkozy",
          dir: "H",
          row: 3,
          col: 4,
          clueRow: 3,
          clueCol: 3
        },
        {
          word: "PARIS",
          clue: "Ville où se trouve le palais de l'Élysée",
          dir: "H",
          row: 5,
          col: 2,
          clueRow: 5,
          clueCol: 1
        },
        {
          word: "VOTE",
          clue: "Action d'exprimer son choix à une élection",
          dir: "V",
          row: 13,
          col: 9,
          clueRow: 12,
          clueCol: 9
        },
        {
          word: "URNE",
          clue: "Boîte où l'on dépose son bulletin",
          dir: "V",
          row: 11,
          col: 11,
          clueRow: 10,
          clueCol: 11
        }
      ]
    }
  },
  moyen: {
    croises: {
      rows: 20,
      cols: 19,
      words: [
        {
          word: "CONSTITUTIONNEL",
          clue: "Conseil qui valide les candidatures",
          dir: "H",
          row: 8,
          col: 4,
          number: 12
        },
        {
          word: "COHABITATION",
          clue: "Président avec un 1er ministre opposé",
          dir: "V",
          row: 8,
          col: 4,
          number: 12
        },
        {
          word: "QUINQUENNAT",
          clue: "Durée de 5 ans du mandat depuis 2000",
          dir: "V",
          row: 5,
          col: 6,
          number: 5
        },
        {
          word: "MITTERRAND",
          clue: "Président ayant aboli la peine de mort",
          dir: "V",
          row: 6,
          col: 8,
          number: 8
        },
        {
          word: "REFERENDUM",
          clue: "Consultation directe des citoyens",
          dir: "V",
          row: 0,
          col: 11,
          number: 1
        },
        {
          word: "BERNADETTE",
          clue: "Épouse de Jacques Chirac",
          dir: "V",
          row: 1,
          col: 10,
          number: 3
        },
        {
          word: "SEPTENNAT",
          clue: "Durée du mandat avant 2000 (7 ans)",
          dir: "V",
          row: 8,
          col: 7,
          number: 13
        },
        {
          word: "ASSEMBLEE",
          clue: "Chambre basse du Parlement",
          dir: "V",
          row: 5,
          col: 17,
          number: 7
        },
        {
          word: "PARLEMENT",
          clue: "Assemblée + Sénat réunis",
          dir: "V",
          row: 0,
          col: 12,
          number: 2
        },
        {
          word: "POMPIDOU",
          clue: "Président mort en fonction en 1974",
          dir: "V",
          row: 7,
          col: 5,
          number: 11
        },
        {
          word: "DANIELLE",
          clue: "Épouse de François Mitterrand",
          dir: "V",
          row: 5,
          col: 9,
          number: 6
        },
        {
          word: "RETRAITE",
          clue: "Réforme repoussant l'âge à 64 ans",
          dir: "V",
          row: 3,
          col: 13,
          number: 4
        },
        {
          word: "MINISTRE",
          clue: "Membre du gouvernement",
          dir: "V",
          row: 6,
          col: 15,
          number: 9
        },
        {
          word: "TAUBIRA",
          clue: "Ministre de la loi sur le mariage homosexuel (2013)",
          dir: "H",
          row: 17,
          col: 0,
          number: 15
        },
        {
          word: "GISCARD",
          clue: "Président de 1974 à 1981",
          dir: "V",
          row: 13,
          col: 1,
          number: 14
        },
        {
          word: "SENAT",
          clue: "Chambre haute du Parlement",
          dir: "V",
          row: 6,
          col: 16,
          number: 10
        }
      ]
    },
    fleches: {
      rows: 21,
      cols: 20,
      words: [
        {
          word: "CONSTITUTIONNEL",
          clue: "Conseil qui valide les candidatures",
          dir: "H",
          row: 9,
          col: 5,
          clueRow: 9,
          clueCol: 4
        },
        {
          word: "COHABITATION",
          clue: "Président avec un 1er ministre opposé",
          dir: "V",
          row: 9,
          col: 5,
          clueRow: 8,
          clueCol: 5
        },
        {
          word: "QUINQUENNAT",
          clue: "Durée de 5 ans du mandat depuis 2000",
          dir: "V",
          row: 6,
          col: 7,
          clueRow: 5,
          clueCol: 7
        },
        {
          word: "MITTERRAND",
          clue: "Président ayant aboli la peine de mort",
          dir: "V",
          row: 7,
          col: 9,
          clueRow: 6,
          clueCol: 9
        },
        {
          word: "REFERENDUM",
          clue: "Consultation directe des citoyens",
          dir: "V",
          row: 1,
          col: 12,
          clueRow: 0,
          clueCol: 12
        },
        {
          word: "BERNADETTE",
          clue: "Épouse de Jacques Chirac",
          dir: "V",
          row: 2,
          col: 11,
          clueRow: 1,
          clueCol: 11
        },
        {
          word: "SEPTENNAT",
          clue: "Durée du mandat avant 2000 (7 ans)",
          dir: "V",
          row: 9,
          col: 8,
          clueRow: 8,
          clueCol: 8
        },
        {
          word: "ASSEMBLEE",
          clue: "Chambre basse du Parlement",
          dir: "V",
          row: 6,
          col: 18,
          clueRow: 5,
          clueCol: 18
        },
        {
          word: "PARLEMENT",
          clue: "Assemblée + Sénat réunis",
          dir: "V",
          row: 1,
          col: 13,
          clueRow: 0,
          clueCol: 13
        },
        {
          word: "POMPIDOU",
          clue: "Président mort en fonction en 1974",
          dir: "V",
          row: 8,
          col: 6,
          clueRow: 7,
          clueCol: 6
        },
        {
          word: "DANIELLE",
          clue: "Épouse de François Mitterrand",
          dir: "V",
          row: 6,
          col: 10,
          clueRow: 5,
          clueCol: 10
        },
        {
          word: "RETRAITE",
          clue: "Réforme repoussant l'âge à 64 ans",
          dir: "V",
          row: 4,
          col: 14,
          clueRow: 3,
          clueCol: 14
        },
        {
          word: "MINISTRE",
          clue: "Membre du gouvernement",
          dir: "V",
          row: 7,
          col: 16,
          clueRow: 6,
          clueCol: 16
        },
        {
          word: "TAUBIRA",
          clue: "Ministre de la loi sur le mariage homosexuel (2013)",
          dir: "H",
          row: 18,
          col: 1,
          clueRow: 18,
          clueCol: 0
        },
        {
          word: "GISCARD",
          clue: "Président de 1974 à 1981",
          dir: "V",
          row: 14,
          col: 2,
          clueRow: 13,
          clueCol: 2
        },
        {
          word: "SENAT",
          clue: "Chambre haute du Parlement",
          dir: "V",
          row: 7,
          col: 17,
          clueRow: 6,
          clueCol: 17
        }
      ]
    }
  },
  difficile: {
    croises: {
      rows: 18,
      cols: 17,
      words: [
        {
          word: "QUATREVINGTNEUF",
          clue: "Article constitutionnel sur la révision",
          dir: "H",
          row: 8,
          col: 2,
          number: 14
        },
        {
          word: "PRESIDENTIELLE",
          clue: "Élection au suffrage universel direct depuis 1962",
          dir: "V",
          row: 0,
          col: 5,
          number: 1
        },
        {
          word: "DISSOLUTION",
          clue: "Pouvoir de mettre fin à l'Assemblée",
          dir: "V",
          row: 2,
          col: 3,
          number: 5
        },
        {
          word: "TRIERWEILER",
          clue: "Compagne de Hollande à l'Élysée",
          dir: "V",
          row: 7,
          col: 6,
          number: 11
        },
        {
          word: "PARRAINAGES",
          clue: "Signatures d'élus pour être candidat",
          dir: "V",
          row: 7,
          col: 4,
          number: 10
        },
        {
          word: "REMANIEMENT",
          clue: "Changement de composition du gouvernement",
          dir: "V",
          row: 7,
          col: 7,
          number: 12
        },
        {
          word: "ANNEAYMONE",
          clue: "Épouse de Giscard d'Estaing",
          dir: "V",
          row: 7,
          col: 10,
          number: 13
        },
        {
          word: "EUROPEENNE",
          clue: "Convention présidée par Giscard",
          dir: "V",
          row: 1,
          col: 13,
          number: 4
        },
        {
          word: "ABROGATION",
          clue: "Annulation d'une loi ou réforme",
          dir: "V",
          row: 1,
          col: 9,
          number: 3
        },
        {
          word: "NUCLEAIRE",
          clue: "Force de dissuasion, décision présidentielle seule",
          dir: "V",
          row: 4,
          col: 14,
          number: 6
        },
        {
          word: "SEPTIEME",
          clue: "Rang du président occupé par Sarkozy",
          dir: "V",
          row: 5,
          col: 12,
          number: 7
        },
        {
          word: "IMMUNITE",
          clue: "Protection du président pendant son mandat",
          dir: "V",
          row: 5,
          col: 15,
          number: 8
        },
        {
          word: "CENSURE",
          clue: "Motion de ... pour renverser le gouvernement",
          dir: "H",
          row: 1,
          col: 0,
          number: 2
        },
        {
          word: "POHER",
          clue: "Deux fois président par intérim (1969, 1974)",
          dir: "H",
          row: 0,
          col: 5,
          number: 1
        },
        {
          word: "COVID",
          clue: "Crise sanitaire du début du 2e mandat Macron",
          dir: "V",
          row: 6,
          col: 8,
          number: 9
        },
        {
          word: "OTAN",
          clue: "Alliance militaire réintégrée sous Sarkozy",
          dir: "H",
          row: 14,
          col: 10,
          number: 15
        }
      ]
    },
    fleches: {
      rows: 19,
      cols: 20,
      words: [
        {
          word: "QUATREVINGTNEUF",
          clue: "Article constitutionnel sur la révision",
          dir: "H",
          row: 9,
          col: 5,
          clueRow: 9,
          clueCol: 4
        },
        {
          word: "PRESIDENTIELLE",
          clue: "Élection au suffrage universel direct depuis 1962",
          dir: "V",
          row: 1,
          col: 8,
          clueRow: 0,
          clueCol: 8
        },
        {
          word: "DISSOLUTION",
          clue: "Pouvoir de mettre fin à l'Assemblée",
          dir: "V",
          row: 3,
          col: 6,
          clueRow: 2,
          clueCol: 6
        },
        {
          word: "TRIERWEILER",
          clue: "Compagne de Hollande à l'Élysée",
          dir: "V",
          row: 8,
          col: 9,
          clueRow: 7,
          clueCol: 9
        },
        {
          word: "PARRAINAGES",
          clue: "Signatures d'élus pour être candidat",
          dir: "V",
          row: 8,
          col: 7,
          clueRow: 7,
          clueCol: 7
        },
        {
          word: "REMANIEMENT",
          clue: "Changement de composition du gouvernement",
          dir: "V",
          row: 8,
          col: 10,
          clueRow: 7,
          clueCol: 10
        },
        {
          word: "ANNEAYMONE",
          clue: "Épouse de Giscard d'Estaing",
          dir: "V",
          row: 8,
          col: 13,
          clueRow: 7,
          clueCol: 13
        },
        {
          word: "EUROPEENNE",
          clue: "Convention présidée par Giscard",
          dir: "V",
          row: 2,
          col: 16,
          clueRow: 1,
          clueCol: 16
        },
        {
          word: "ABROGATION",
          clue: "Annulation d'une loi ou réforme",
          dir: "V",
          row: 2,
          col: 12,
          clueRow: 1,
          clueCol: 12
        },
        {
          word: "NUCLEAIRE",
          clue: "Force de dissuasion, décision présidentielle seule",
          dir: "V",
          row: 5,
          col: 17,
          clueRow: 4,
          clueCol: 17
        },
        {
          word: "SEPTIEME",
          clue: "Rang du président occupé par Sarkozy",
          dir: "V",
          row: 6,
          col: 15,
          clueRow: 5,
          clueCol: 15
        },
        {
          word: "IMMUNITE",
          clue: "Protection du président pendant son mandat",
          dir: "V",
          row: 6,
          col: 18,
          clueRow: 5,
          clueCol: 18
        },
        {
          word: "CENSURE",
          clue: "Motion de ... pour renverser le gouvernement",
          dir: "H",
          row: 17,
          col: 1,
          clueRow: 17,
          clueCol: 0
        },
        {
          word: "POHER",
          clue: "Deux fois président par intérim (1969, 1974)",
          dir: "H",
          row: 15,
          col: 12,
          clueRow: 15,
          clueCol: 11
        },
        {
          word: "COVID",
          clue: "Crise sanitaire du début du 2e mandat Macron",
          dir: "V",
          row: 7,
          col: 11,
          clueRow: 6,
          clueCol: 11
        },
        {
          word: "OTAN",
          clue: "Alliance militaire réintégrée sous Sarkozy",
          dir: "H",
          row: 13,
          col: 3,
          clueRow: 13,
          clueCol: 2
        }
      ]
    }
  }
};
