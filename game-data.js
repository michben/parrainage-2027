// ============================================================
// Grilles de mots croises/fleches - Presidents de la France
// Grilles figees (pre-generees et verifiees sans conflit de
// lettres) : le jeu ne calcule rien, il rejoue ces donnees.
// ============================================================

const GAME_GRIDS = {
  facile: {
    rows: 13,
    cols: 10,
    words: [
      {
        word: "HOLLANDE",
        clue: "Président de 2012 à 2017",
        dir: "H",
        row: 7,
        col: 0,
        number: 9
      },
      {
        word: "BRIGITTE",
        clue: "Épouse d'Emmanuel Macron",
        dir: "V",
        row: 0,
        col: 7,
        number: 1
      },
      {
        word: "MATIGNON",
        clue: "Résidence officielle du Premier ministre",
        dir: "V",
        row: 1,
        col: 1,
        number: 2
      },
      {
        word: "SARKOZY",
        clue: "Président de 2007 à 2012",
        dir: "V",
        row: 6,
        col: 4,
        number: 8
      },
      {
        word: "MACRON",
        clue: "Président élu en 2017 et réélu en 2022",
        dir: "V",
        row: 2,
        col: 5,
        number: 4
      },
      {
        word: "CHIRAC",
        clue: "Président de 1995 à 2007",
        dir: "V",
        row: 6,
        col: 0,
        number: 6
      },
      {
        word: "ELYSEE",
        clue: "Résidence officielle du président",
        dir: "V",
        row: 6,
        col: 2,
        number: 7
      },
      {
        word: "YVONNE",
        clue: "Épouse de Charles de Gaulle",
        dir: "H",
        row: 12,
        col: 4,
        number: 10
      },
      {
        word: "GAULLE",
        clue: "Fondateur de la Ve République (nom de famille)",
        dir: "V",
        row: 4,
        col: 3,
        number: 5
      },
      {
        word: "CARLA",
        clue: "Épouse de Nicolas Sarkozy",
        dir: "H",
        row: 1,
        col: 5,
        number: 3
      }
    ]
  },
  moyen: {
    rows: 19,
    cols: 15,
    words: [
      {
        word: "CONSTITUTIONNEL",
        clue: "Conseil qui valide les candidatures à la présidentielle",
        dir: "H",
        row: 8,
        col: 0,
        number: 11
      },
      {
        word: "COHABITATION",
        clue: "Situation d'un président avec un Premier ministre opposé",
        dir: "V",
        row: 7,
        col: 1,
        number: 10
      },
      {
        word: "QUINQUENNAT",
        clue: "Durée de 5 ans du mandat présidentiel depuis 2000",
        dir: "V",
        row: 5,
        col: 2,
        number: 6
      },
      {
        word: "MITTERRAND",
        clue: "Président ayant aboli la peine de mort",
        dir: "V",
        row: 6,
        col: 4,
        number: 8
      },
      {
        word: "REFERENDUM",
        clue: "Consultation directe des citoyens par vote",
        dir: "V",
        row: 0,
        col: 7,
        number: 2
      },
      {
        word: "BERNADETTE",
        clue: "Épouse de Jacques Chirac",
        dir: "V",
        row: 1,
        col: 6,
        number: 3
      },
      {
        word: "SEPTENNAT",
        clue: "Durée du mandat présidentiel avant la réforme de 2000 (7 ans)",
        dir: "V",
        row: 8,
        col: 3,
        number: 12
      },
      {
        word: "POMPIDOU",
        clue: "Président mort en fonction en 1974",
        dir: "V",
        row: 4,
        col: 5,
        number: 4
      },
      {
        word: "DANIELLE",
        clue: "Épouse de François Mitterrand",
        dir: "V",
        row: 5,
        col: 9,
        number: 7
      },
      {
        word: "RETRAITE",
        clue: "Réforme controversée repoussant l'âge à 64 ans",
        dir: "V",
        row: 6,
        col: 8,
        number: 9
      },
      {
        word: "TAUBIRA",
        clue: "Ministre à l'origine de la loi sur le mariage homosexuel (2013)",
        dir: "H",
        row: 0,
        col: 2,
        number: 1
      },
      {
        word: "GISCARD",
        clue: "Président de 1974 à 1981",
        dir: "V",
        row: 5,
        col: 0,
        number: 5
      }
    ]
  },
  difficile: {
    rows: 18,
    cols: 15,
    words: [
      {
        word: "QUATREVINGTNEUF",
        clue: "Article de la Constitution sur la révision (numéro en lettres)",
        dir: "H",
        row: 7,
        col: 0,
        number: 10
      },
      {
        word: "DISSOLUTION",
        clue: "Pouvoir présidentiel de mettre fin à l'Assemblée nationale",
        dir: "V",
        row: 1,
        col: 1,
        number: 2
      },
      {
        word: "TRIERWEILER",
        clue: "Compagne de François Hollande à l'Élysée (nom de famille)",
        dir: "V",
        row: 7,
        col: 3,
        number: 11
      },
      {
        word: "PARRAINAGES",
        clue: "Signatures d'élus nécessaires pour être candidat",
        dir: "V",
        row: 6,
        col: 2,
        number: 9
      },
      {
        word: "ANNEAYMONE",
        clue: "Épouse de Valéry Giscard d'Estaing (prénom composé)",
        dir: "V",
        row: 4,
        col: 5,
        number: 3
      },
      {
        word: "EUROPEENNE",
        clue: "Adjectif de l'Union dont Giscard présida la Convention",
        dir: "V",
        row: 5,
        col: 4,
        number: 7
      },
      {
        word: "ABROGATION",
        clue: "Action d'annuler une loi ou une réforme",
        dir: "V",
        row: 0,
        col: 7,
        number: 1
      },
      {
        word: "NUCLEAIRE",
        clue: "Force de dissuasion dont le président est le seul décideur",
        dir: "V",
        row: 7,
        col: 8,
        number: 12
      },
      {
        word: "SEPTIEME",
        clue: "Numéro d'ordre du président de la Ve République occupé par Sarkozy",
        dir: "V",
        row: 4,
        col: 10,
        number: 4
      },
      {
        word: "POHER",
        clue: "Président du Sénat, deux fois président par intérim (1969, 1974)",
        dir: "V",
        row: 4,
        col: 12,
        number: 6
      },
      {
        word: "COVID",
        clue: "Crise sanitaire mondiale du début du mandat 2020 de Macron",
        dir: "V",
        row: 5,
        col: 6,
        number: 8
      },
      {
        word: "OTAN",
        clue: "Alliance militaire dont la France a réintégré le commandement sous Sarkozy",
        dir: "V",
        row: 4,
        col: 11,
        number: 5
      }
    ]
  }
};
