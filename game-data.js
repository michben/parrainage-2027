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
      rows: 20,
      cols: 19,
      words: [
        {
          word: "REPUBLIQUE",
          clue: "Régime politique de la France depuis 1792",
          dir: "H",
          row: 10,
          col: 4,
          number: 14
        },
        {
          word: "MATIGNON",
          clue: "Résidence du Premier ministre",
          dir: "V",
          row: 7,
          col: 10,
          number: 11
        },
        {
          word: "HOLLANDE",
          clue: "Président de 2012 à 2017",
          dir: "V",
          row: 3,
          col: 5,
          number: 4
        },
        {
          word: "SUFFRAGE",
          clue: "Droit de vote, universel depuis 1944 pour les femmes",
          dir: "V",
          row: 9,
          col: 7,
          number: 13
        },
        {
          word: "BRIGITTE",
          clue: "Épouse d'Emmanuel Macron",
          dir: "V",
          row: 3,
          col: 13,
          number: 5
        },
        {
          word: "DRAPEAU",
          clue: "Symbole tricolore de la France",
          dir: "H",
          row: 7,
          col: 0,
          number: 10
        },
        {
          word: "SARKOZY",
          clue: "Président de 2007 à 2012",
          dir: "H",
          row: 4,
          col: 1,
          number: 6
        },
        {
          word: "DEPUTE",
          clue: "Membre élu de l'Assemblée nationale",
          dir: "H",
          row: 16,
          col: 6,
          number: 18
        },
        {
          word: "GAULLE",
          clue: "Fondateur de la Ve République",
          dir: "H",
          row: 6,
          col: 13,
          number: 8
        },
        {
          word: "DROITE",
          clue: "Camp politique conservateur",
          dir: "H",
          row: 4,
          col: 12,
          number: 7
        },
        {
          word: "ELYSEE",
          clue: "Résidence officielle du président",
          dir: "V",
          row: 6,
          col: 18,
          number: 9
        },
        {
          word: "MANDAT",
          clue: "Durée d'exercice du pouvoir présidentiel",
          dir: "H",
          row: 14,
          col: 3,
          number: 17
        },
        {
          word: "CHIRAC",
          clue: "Président de 1995 à 2007",
          dir: "V",
          row: 0,
          col: 2,
          number: 1
        },
        {
          word: "MACRON",
          clue: "Président élu en 2017 et réélu en 2022",
          dir: "V",
          row: 14,
          col: 3,
          number: 17
        },
        {
          word: "YVONNE",
          clue: "Épouse de Charles de Gaulle",
          dir: "H",
          row: 18,
          col: 1,
          number: 19
        },
        {
          word: "CARLA",
          clue: "Épouse de Nicolas Sarkozy",
          dir: "H",
          row: 0,
          col: 2,
          number: 1
        },
        {
          word: "MAIRE",
          clue: "Premier élu d'une commune",
          dir: "V",
          row: 0,
          col: 17,
          number: 2
        },
        {
          word: "PARIS",
          clue: "Ville où se trouve le palais de l'Élysée",
          dir: "H",
          row: 2,
          col: 14,
          number: 3
        },
        {
          word: "ETAT",
          clue: "Structure politique souveraine",
          dir: "H",
          row: 8,
          col: 8,
          number: 12
        },
        {
          word: "URNE",
          clue: "Boîte où l'on dépose son bulletin",
          dir: "V",
          row: 10,
          col: 12,
          number: 15
        },
        {
          word: "VOTE",
          clue: "Action d'exprimer son choix à une élection",
          dir: "H",
          row: 13,
          col: 9,
          number: 16
        }
      ]
    },
    fleches: {
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
          word: "MATIGNON",
          clue: "Résidence du Premier ministre",
          dir: "V",
          row: 7,
          col: 10,
          clueRow: 6,
          clueCol: 10
        },
        {
          word: "SUFFRAGE",
          clue: "Droit de vote, universel depuis 1944 pour les femmes",
          dir: "V",
          row: 6,
          col: 4,
          clueRow: 5,
          clueCol: 4
        },
        {
          word: "HOLLANDE",
          clue: "Président de 2012 à 2017",
          dir: "V",
          row: 3,
          col: 13,
          clueRow: 2,
          clueCol: 13
        },
        {
          word: "BRIGITTE",
          clue: "Épouse d'Emmanuel Macron",
          dir: "V",
          row: 10,
          col: 8,
          clueRow: 9,
          clueCol: 8
        },
        {
          word: "SARKOZY",
          clue: "Président de 2007 à 2012",
          dir: "H",
          row: 4,
          col: 9,
          clueRow: 4,
          clueCol: 8
        },
        {
          word: "DRAPEAU",
          clue: "Symbole tricolore de la France",
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
          row: 17,
          col: 3,
          clueRow: 17,
          clueCol: 2
        },
        {
          word: "MANDAT",
          clue: "Durée d'exercice du pouvoir présidentiel",
          dir: "H",
          row: 7,
          col: 12,
          clueRow: 7,
          clueCol: 11
        },
        {
          word: "MACRON",
          clue: "Président élu en 2017 et réélu en 2022",
          dir: "V",
          row: 1,
          col: 11,
          clueRow: 0,
          clueCol: 11
        },
        {
          word: "CHIRAC",
          clue: "Président de 1995 à 2007",
          dir: "H",
          row: 2,
          col: 7,
          clueRow: 2,
          clueCol: 6
        },
        {
          word: "DROITE",
          clue: "Camp politique conservateur",
          dir: "H",
          row: 9,
          col: 13,
          clueRow: 9,
          clueCol: 12
        },
        {
          word: "ELYSEE",
          clue: "Résidence officielle du président",
          dir: "V",
          row: 9,
          col: 18,
          clueRow: 8,
          clueCol: 18
        },
        {
          word: "DEPUTE",
          clue: "Membre élu de l'Assemblée nationale",
          dir: "H",
          row: 15,
          col: 4,
          clueRow: 15,
          clueCol: 3
        },
        {
          word: "GAULLE",
          clue: "Fondateur de la Ve République",
          dir: "H",
          row: 13,
          col: 13,
          clueRow: 13,
          clueCol: 12
        },
        {
          word: "MAIRE",
          clue: "Premier élu d'une commune",
          dir: "V",
          row: 12,
          col: 14,
          clueRow: 11,
          clueCol: 14
        },
        {
          word: "PARIS",
          clue: "Ville où se trouve le palais de l'Élysée",
          dir: "V",
          row: 6,
          col: 16,
          clueRow: 5,
          clueCol: 16
        },
        {
          word: "CARLA",
          clue: "Épouse de Nicolas Sarkozy",
          dir: "V",
          row: 2,
          col: 7,
          clueRow: 1,
          clueCol: 7
        },
        {
          word: "URNE",
          clue: "Boîte où l'on dépose son bulletin",
          dir: "H",
          row: 13,
          col: 1,
          clueRow: 13,
          clueCol: 0
        },
        {
          word: "VOTE",
          clue: "Action d'exprimer son choix à une élection",
          dir: "H",
          row: 16,
          col: 11,
          clueRow: 16,
          clueCol: 10
        },
        {
          word: "ETAT",
          clue: "Structure politique souveraine",
          dir: "H",
          row: 8,
          col: 8,
          clueRow: 8,
          clueCol: 7
        }
      ]
    }
  },
  moyen: {
    croises: {
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
          number: 11
        },
        {
          word: "GOUVERNEMENT",
          clue: "Équipe dirigée par le Premier ministre",
          dir: "V",
          row: 0,
          col: 7,
          number: 1
        },
        {
          word: "QUINQUENNAT",
          clue: "Durée de 5 ans du mandat depuis 2000",
          dir: "V",
          row: 1,
          col: 9,
          number: 2
        },
        {
          word: "OPPOSITION",
          clue: "Partis qui ne soutiennent pas le gouvernement",
          dir: "V",
          row: 5,
          col: 11,
          number: 7
        },
        {
          word: "BERNADETTE",
          clue: "Épouse de Jacques Chirac",
          dir: "V",
          row: 8,
          col: 14,
          number: 10
        },
        {
          word: "REFERENDUM",
          clue: "Consultation directe des citoyens",
          dir: "V",
          row: 10,
          col: 16,
          number: 12
        },
        {
          word: "BALLOTTAGE",
          clue: "Second tour quand personne n'a la majorité au premier",
          dir: "H",
          row: 17,
          col: 3,
          number: 19
        },
        {
          word: "MITTERRAND",
          clue: "Président ayant aboli la peine de mort",
          dir: "H",
          row: 19,
          col: 3,
          number: 20
        },
        {
          word: "PARLEMENT",
          clue: "Assemblée + Sénat réunis",
          dir: "H",
          row: 6,
          col: 11,
          number: 8
        },
        {
          word: "SEPTENNAT",
          clue: "Durée du mandat avant 2000 (7 ans)",
          dir: "V",
          row: 1,
          col: 18,
          number: 3
        },
        {
          word: "ASSEMBLEE",
          clue: "Chambre basse du Parlement",
          dir: "H",
          row: 2,
          col: 11,
          number: 5
        },
        {
          word: "ELECTORAT",
          clue: "Ensemble des électeurs inscrits",
          dir: "V",
          row: 13,
          col: 8,
          number: 15
        },
        {
          word: "DANIELLE",
          clue: "Épouse de François Mitterrand",
          dir: "H",
          row: 15,
          col: 1,
          number: 18
        },
        {
          word: "MAJORITE",
          clue: "Camp qui dispose de plus de la moitié des sièges",
          dir: "H",
          row: 4,
          col: 0,
          number: 6
        },
        {
          word: "MINISTRE",
          clue: "Membre du gouvernement",
          dir: "H",
          row: 7,
          col: 0,
          number: 9
        },
        {
          word: "RETRAITE",
          clue: "Réforme repoussant l'âge à 64 ans",
          dir: "H",
          row: 14,
          col: 13,
          number: 17
        },
        {
          word: "CANDIDAT",
          clue: "Personne qui se présente à une élection",
          dir: "V",
          row: 12,
          col: 1,
          number: 14
        },
        {
          word: "POMPIDOU",
          clue: "Président mort en fonction en 1974",
          dir: "H",
          row: 2,
          col: 0,
          number: 4
        },
        {
          word: "GISCARD",
          clue: "Président de 1974 à 1981",
          dir: "V",
          row: 13,
          col: 18,
          number: 16
        },
        {
          word: "TAUBIRA",
          clue: "Ministre de la loi sur le mariage homosexuel (2013)",
          dir: "H",
          row: 21,
          col: 8,
          number: 22
        },
        {
          word: "SENAT",
          clue: "Chambre haute du Parlement",
          dir: "H",
          row: 21,
          col: 2,
          number: 21
        }
      ]
    },
    fleches: {
      rows: 24,
      cols: 23,
      words: [
        {
          word: "CONSTITUTIONNEL",
          clue: "Conseil qui valide les candidatures",
          dir: "H",
          row: 12,
          col: 4,
          clueRow: 12,
          clueCol: 3
        },
        {
          word: "GOUVERNEMENT",
          clue: "Équipe dirigée par le Premier ministre",
          dir: "V",
          row: 11,
          col: 5,
          clueRow: 10,
          clueCol: 5
        },
        {
          word: "COHABITATION",
          clue: "Président avec un 1er ministre opposé",
          dir: "V",
          row: 6,
          col: 8,
          clueRow: 5,
          clueCol: 8
        },
        {
          word: "QUINQUENNAT",
          clue: "Durée de 5 ans du mandat depuis 2000",
          dir: "V",
          row: 2,
          col: 10,
          clueRow: 1,
          clueCol: 10
        },
        {
          word: "BERNADETTE",
          clue: "Épouse de Jacques Chirac",
          dir: "V",
          row: 5,
          col: 12,
          clueRow: 4,
          clueCol: 12
        },
        {
          word: "OPPOSITION",
          clue: "Partis qui ne soutiennent pas le gouvernement",
          dir: "V",
          row: 12,
          col: 14,
          clueRow: 11,
          clueCol: 14
        },
        {
          word: "BALLOTTAGE",
          clue: "Second tour quand personne n'a la majorité au premier",
          dir: "V",
          row: 3,
          col: 17,
          clueRow: 2,
          clueCol: 17
        },
        {
          word: "MITTERRAND",
          clue: "Président ayant aboli la peine de mort",
          dir: "H",
          row: 20,
          col: 1,
          clueRow: 20,
          clueCol: 0
        },
        {
          word: "REFERENDUM",
          clue: "Consultation directe des citoyens",
          dir: "H",
          row: 3,
          col: 2,
          clueRow: 3,
          clueCol: 1
        },
        {
          word: "ASSEMBLEE",
          clue: "Chambre basse du Parlement",
          dir: "H",
          row: 16,
          col: 13,
          clueRow: 16,
          clueCol: 12
        },
        {
          word: "PARLEMENT",
          clue: "Assemblée + Sénat réunis",
          dir: "H",
          row: 14,
          col: 14,
          clueRow: 14,
          clueCol: 13
        },
        {
          word: "ELECTORAT",
          clue: "Ensemble des électeurs inscrits",
          dir: "H",
          row: 22,
          col: 1,
          clueRow: 22,
          clueCol: 0
        },
        {
          word: "SEPTENNAT",
          clue: "Durée du mandat avant 2000 (7 ans)",
          dir: "H",
          row: 18,
          col: 11,
          clueRow: 18,
          clueCol: 10
        },
        {
          word: "RETRAITE",
          clue: "Réforme repoussant l'âge à 64 ans",
          dir: "H",
          row: 8,
          col: 15,
          clueRow: 8,
          clueCol: 14
        },
        {
          word: "POMPIDOU",
          clue: "Président mort en fonction en 1974",
          dir: "H",
          row: 20,
          col: 13,
          clueRow: 20,
          clueCol: 12
        },
        {
          word: "DANIELLE",
          clue: "Épouse de François Mitterrand",
          dir: "V",
          row: 12,
          col: 21,
          clueRow: 11,
          clueCol: 21
        },
        {
          word: "MINISTRE",
          clue: "Membre du gouvernement",
          dir: "V",
          row: 15,
          col: 3,
          clueRow: 14,
          clueCol: 3
        },
        {
          word: "CANDIDAT",
          clue: "Personne qui se présente à une élection",
          dir: "V",
          row: 2,
          col: 19,
          clueRow: 1,
          clueCol: 19
        },
        {
          word: "MAJORITE",
          clue: "Camp qui dispose de plus de la moitié des sièges",
          dir: "V",
          row: 2,
          col: 21,
          clueRow: 1,
          clueCol: 21
        },
        {
          word: "TAUBIRA",
          clue: "Ministre de la loi sur le mariage homosexuel (2013)",
          dir: "H",
          row: 9,
          col: 2,
          clueRow: 9,
          clueCol: 1
        },
        {
          word: "GISCARD",
          clue: "Président de 1974 à 1981",
          dir: "V",
          row: 3,
          col: 15,
          clueRow: 2,
          clueCol: 15
        },
        {
          word: "SENAT",
          clue: "Chambre haute du Parlement",
          dir: "V",
          row: 18,
          col: 9,
          clueRow: 17,
          clueCol: 9
        }
      ]
    }
  },
  difficile: {
    croises: {
      rows: 22,
      cols: 21,
      words: [
        {
          word: "QUATREVINGTNEUF",
          clue: "Article constitutionnel sur la révision",
          dir: "H",
          row: 11,
          col: 3,
          number: 15
        },
        {
          word: "PRESIDENTIELLE",
          clue: "Élection au suffrage universel direct depuis 1962",
          dir: "V",
          row: 3,
          col: 6,
          number: 7
        },
        {
          word: "INELIGIBILITE",
          clue: "Sanction qui empêche de se présenter à une élection",
          dir: "V",
          row: 9,
          col: 8,
          number: 14
        },
        {
          word: "BICAMERALISME",
          clue: "Système à deux chambres parlementaires",
          dir: "V",
          row: 2,
          col: 10,
          number: 5
        },
        {
          word: "REMANIEMENT",
          clue: "Changement de composition du gouvernement",
          dir: "V",
          row: 1,
          col: 13,
          number: 4
        },
        {
          word: "TRIERWEILER",
          clue: "Compagne de Hollande à l'Élysée",
          dir: "V",
          row: 8,
          col: 15,
          number: 13
        },
        {
          word: "INVESTITURE",
          clue: "Cérémonie d'entrée en fonction du président",
          dir: "V",
          row: 3,
          col: 4,
          number: 6
        },
        {
          word: "PARRAINAGES",
          clue: "Signatures d'élus pour être candidat",
          dir: "H",
          row: 19,
          col: 3,
          number: 20
        },
        {
          word: "DISSOLUTION",
          clue: "Pouvoir de mettre fin à l'Assemblée",
          dir: "H",
          row: 16,
          col: 10,
          number: 18
        },
        {
          word: "ABROGATION",
          clue: "Annulation d'une loi ou réforme",
          dir: "H",
          row: 1,
          col: 11,
          number: 3
        },
        {
          word: "ANNEAYMONE",
          clue: "Épouse de Giscard d'Estaing",
          dir: "H",
          row: 21,
          col: 5,
          number: 21
        },
        {
          word: "EUROPEENNE",
          clue: "Convention présidée par Giscard",
          dir: "H",
          row: 14,
          col: 10,
          number: 16
        },
        {
          word: "PLEBISCITE",
          clue: "Vote massif en faveur d'une personne ou d'une idée",
          dir: "V",
          row: 5,
          col: 19,
          number: 9
        },
        {
          word: "NUCLEAIRE",
          clue: "Force de dissuasion, décision présidentielle seule",
          dir: "H",
          row: 4,
          col: 8,
          number: 8
        },
        {
          word: "AMNISTIE",
          clue: "Effacement légal d'une infraction, souvent décidé par le pouvoir",
          dir: "H",
          row: 7,
          col: 0,
          number: 11
        },
        {
          word: "SEPTIEME",
          clue: "Rang du président occupé par Sarkozy",
          dir: "V",
          row: 1,
          col: 1,
          number: 2
        },
        {
          word: "IMMUNITE",
          clue: "Protection du président pendant son mandat",
          dir: "H",
          row: 6,
          col: 8,
          number: 10
        },
        {
          word: "CENSURE",
          clue: "Motion de ... pour renverser le gouvernement",
          dir: "H",
          row: 16,
          col: 0,
          number: 17
        },
        {
          word: "GRACIER",
          clue: "Pouvoir présidentiel d'annuler une peine",
          dir: "H",
          row: 18,
          col: 14,
          number: 19
        },
        {
          word: "COVID",
          clue: "Crise sanitaire du début du 2e mandat Macron",
          dir: "V",
          row: 16,
          col: 0,
          number: 17
        },
        {
          word: "POHER",
          clue: "Deux fois président par intérim (1969, 1974)",
          dir: "H",
          row: 7,
          col: 16,
          number: 12
        },
        {
          word: "OTAN",
          clue: "Alliance militaire réintégrée sous Sarkozy",
          dir: "V",
          row: 0,
          col: 17,
          number: 1
        }
      ]
    },
    fleches: {
      rows: 24,
      cols: 23,
      words: [
        {
          word: "QUATREVINGTNEUF",
          clue: "Article constitutionnel sur la révision",
          dir: "H",
          row: 12,
          col: 4,
          clueRow: 12,
          clueCol: 3
        },
        {
          word: "PRESIDENTIELLE",
          clue: "Élection au suffrage universel direct depuis 1962",
          dir: "V",
          row: 4,
          col: 7,
          clueRow: 3,
          clueCol: 7
        },
        {
          word: "BICAMERALISME",
          clue: "Système à deux chambres parlementaires",
          dir: "V",
          row: 7,
          col: 9,
          clueRow: 6,
          clueCol: 9
        },
        {
          word: "INELIGIBILITE",
          clue: "Sanction qui empêche de se présenter à une élection",
          dir: "V",
          row: 8,
          col: 11,
          clueRow: 7,
          clueCol: 11
        },
        {
          word: "TRIERWEILER",
          clue: "Compagne de Hollande à l'Élysée",
          dir: "V",
          row: 12,
          col: 14,
          clueRow: 11,
          clueCol: 14
        },
        {
          word: "PARRAINAGES",
          clue: "Signatures d'élus pour être candidat",
          dir: "V",
          row: 3,
          col: 16,
          clueRow: 2,
          clueCol: 16
        },
        {
          word: "DISSOLUTION",
          clue: "Pouvoir de mettre fin à l'Assemblée",
          dir: "V",
          row: 6,
          col: 5,
          clueRow: 5,
          clueCol: 5
        },
        {
          word: "INVESTITURE",
          clue: "Cérémonie d'entrée en fonction du président",
          dir: "H",
          row: 18,
          col: 11,
          clueRow: 18,
          clueCol: 10
        },
        {
          word: "REMANIEMENT",
          clue: "Changement de composition du gouvernement",
          dir: "H",
          row: 19,
          col: 1,
          clueRow: 19,
          clueCol: 0
        },
        {
          word: "ABROGATION",
          clue: "Annulation d'une loi ou réforme",
          dir: "H",
          row: 22,
          col: 12,
          clueRow: 22,
          clueCol: 11
        },
        {
          word: "EUROPEENNE",
          clue: "Convention présidée par Giscard",
          dir: "H",
          row: 4,
          col: 3,
          clueRow: 4,
          clueCol: 2
        },
        {
          word: "ANNEAYMONE",
          clue: "Épouse de Giscard d'Estaing",
          dir: "V",
          row: 9,
          col: 21,
          clueRow: 8,
          clueCol: 21
        },
        {
          word: "PLEBISCITE",
          clue: "Vote massif en faveur d'une personne ou d'une idée",
          dir: "H",
          row: 20,
          col: 13,
          clueRow: 20,
          clueCol: 12
        },
        {
          word: "NUCLEAIRE",
          clue: "Force de dissuasion, décision présidentielle seule",
          dir: "V",
          row: 12,
          col: 1,
          clueRow: 11,
          clueCol: 1
        },
        {
          word: "IMMUNITE",
          clue: "Protection du président pendant son mandat",
          dir: "H",
          row: 8,
          col: 11,
          clueRow: 8,
          clueCol: 10
        },
        {
          word: "AMNISTIE",
          clue: "Effacement légal d'une infraction, souvent décidé par le pouvoir",
          dir: "V",
          row: 1,
          col: 18,
          clueRow: 0,
          clueCol: 18
        },
        {
          word: "SEPTIEME",
          clue: "Rang du président occupé par Sarkozy",
          dir: "V",
          row: 3,
          col: 3,
          clueRow: 2,
          clueCol: 3
        },
        {
          word: "GRACIER",
          clue: "Pouvoir présidentiel d'annuler une peine",
          dir: "H",
          row: 16,
          col: 13,
          clueRow: 16,
          clueCol: 12
        },
        {
          word: "CENSURE",
          clue: "Motion de ... pour renverser le gouvernement",
          dir: "V",
          row: 4,
          col: 14,
          clueRow: 3,
          clueCol: 14
        },
        {
          word: "POHER",
          clue: "Deux fois président par intérim (1969, 1974)",
          dir: "V",
          row: 1,
          col: 9,
          clueRow: 0,
          clueCol: 9
        },
        {
          word: "COVID",
          clue: "Crise sanitaire du début du 2e mandat Macron",
          dir: "H",
          row: 2,
          col: 8,
          clueRow: 2,
          clueCol: 7
        },
        {
          word: "OTAN",
          clue: "Alliance militaire réintégrée sous Sarkozy",
          dir: "V",
          row: 17,
          col: 4,
          clueRow: 16,
          clueCol: 4
        }
      ]
    }
  }
};
