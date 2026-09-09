// src/data/transfersData.ts

export type Transfer = {
  id: number;
  playerId: number;

  player: string;
  nationality: string;
  flag: string;
  photo: string;

  from: string;
  fromLogo: string;

  to: string;
  toLogo: string;

  fee: string;
  date: string;
  type: string;

  season: string;
};

export type CareerItem = {
  team: string;
  logo: string;
  from: string;
  to: string;
};

export type PlayerData = {
  id: number;

  name: string;
  nationality: string;
  flag: string;
  photo: string;

  position: string;

  currentTeam: string;
  currentLogo: string;

  career: CareerItem[];
};

const season = "2026/27";

/* =========================================================
   TEAM LOGOS
========================================================= */

const logos = {
  arsenal:
    "https://a.espncdn.com/i/teamlogos/soccer/500/359.png",

  astonVilla:
    "https://a.espncdn.com/i/teamlogos/soccer/500/362.png",

  bournemouth:
    "https://a.espncdn.com/i/teamlogos/soccer/500/8678.png",

  brighton:
    "https://a.espncdn.com/i/teamlogos/soccer/500/397.png",

  chelsea:
    "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",

  crystalPalace:
    "https://a.espncdn.com/i/teamlogos/soccer/500/384.png",

  everton:
    "https://a.espncdn.com/i/teamlogos/soccer/500/368.png",

  fulham:
    "https://a.espncdn.com/i/teamlogos/soccer/500/370.png",

  liverpool:
    "https://a.espncdn.com/i/teamlogos/soccer/500/364.png",

  manCity:
    "https://a.espncdn.com/i/teamlogos/soccer/500/382.png",

  manUnited:
    "https://a.espncdn.com/i/teamlogos/soccer/500/360.png",

  newcastle:
    "https://a.espncdn.com/i/teamlogos/soccer/500/361.png",

  nottingham:
    "https://a.espncdn.com/i/teamlogos/soccer/500/393.png",

  spurs:
    "https://a.espncdn.com/i/teamlogos/soccer/500/367.png",

  westHam:
    "https://a.espncdn.com/i/teamlogos/soccer/500/371.png",

  wolves:
    "https://a.espncdn.com/i/teamlogos/soccer/500/380.png",

  psg:
    "https://a.espncdn.com/i/teamlogos/soccer/500/160.png",

  palmeiras:
    "https://a.espncdn.com/i/teamlogos/soccer/500/2029.png",

  lille:
    "https://a.espncdn.com/i/teamlogos/soccer/500/166.png",

  atletico:
    "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png",

  rennes:
    "https://a.espncdn.com/i/teamlogos/soccer/500/169.png",

  astonVillaOld:
    "https://a.espncdn.com/i/teamlogos/soccer/500/362.png",

  newcastleOld:
    "https://a.espncdn.com/i/teamlogos/soccer/500/361.png",

  forest:
    "https://a.espncdn.com/i/teamlogos/soccer/500/393.png",
};

/* =========================================================
   TRANSFERS 2026/27
========================================================= */

export const transfers: Transfer[] = [

  {
    id: 1,
    playerId: 1,
    player: "Morgan Rogers",
    nationality: "England",
    flag: "🏴",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/276451.png",

    from: "Aston Villa",
    fromLogo: logos.astonVilla,

    to: "Chelsea",
    toLogo: logos.chelsea,

    fee: "£117M",
    date: "2026-08-15",
    type: "انتقال دائم",
    season,
  },

  {
    id: 2,
    playerId: 2,
    player: "Elliot Anderson",
    nationality: "Scotland",
    flag: "🏴",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Nottingham Forest",
    fromLogo: logos.nottingham,

    to: "Manchester City",
    toLogo: logos.manCity,

    fee: "£116M",
    date: "2026-07-15",
    type: "انتقال دائم",
    season,
  },

  {
    id: 3,
    playerId: 3,
    player: "Sandro Tonali",
    nationality: "Italy",
    flag: "🇮🇹",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/233629.png",

    from: "Newcastle United",
    fromLogo: logos.newcastle,

    to: "Tottenham Hotspur",
    toLogo: logos.spurs,

    fee: "£100M",
    date: "2026-07-20",
    type: "انتقال دائم",
    season,
  },

  {
    id: 4,
    playerId: 4,
    player: "Ayyoub Bouaddi",
    nationality: "France",
    flag: "🇫🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/315640.png",

    from: "Lille",
    fromLogo: logos.lille,

    to: "Manchester City",
    toLogo: logos.manCity,

    fee: "£86M",
    date: "2026-08-26",
    type: "انتقال دائم",
    season,
  },

  {
    id: 5,
    playerId: 5,
    player: "Mateus Fernandes",
    nationality: "Portugal",
    flag: "🇵🇹",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Southampton",
    fromLogo: "",

    to: "Tottenham Hotspur",
    toLogo: logos.spurs,

    fee: "£85M",
    date: "2026-07-30",
    type: "انتقال دائم",
    season,
  },

  {
    id: 6,
    playerId: 6,
    player: "Savinho",
    nationality: "Brazil",
    flag: "🇧🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Manchester City",
    fromLogo: logos.manCity,

    to: "Tottenham Hotspur",
    toLogo: logos.spurs,

    fee: "£85M",
    date: "2026-08-01",
    type: "انتقال دائم",
    season,
  },

  {
    id: 7,
    playerId: 7,
    player: "Bruno Guimarães",
    nationality: "Brazil",
    flag: "🇧🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/224343.png",

    from: "Newcastle United",
    fromLogo: logos.newcastle,

    to: "Arsenal",
    toLogo: logos.arsenal,

    fee: "£75M",
    date: "2026-08-05",
    type: "انتقال دائم",
    season,
  },

  {
    id: 8,
    playerId: 8,
    player: "Carlos Baleba",
    nationality: "Cameroon",
    flag: "🇨🇲",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/315640.png",

    from: "Brighton",
    fromLogo: logos.brighton,

    to: "Manchester United",
    toLogo: logos.manUnited,

    fee: "£70M",
    date: "2026-08-10",
    type: "انتقال دائم",
    season,
  },

  {
    id: 9,
    playerId: 9,
    player: "Jeremy Jacquet",
    nationality: "France",
    flag: "🇫🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/315640.png",

    from: "Rennes",
    fromLogo: logos.rennes,

    to: "Liverpool",
    toLogo: logos.liverpool,

    fee: "£60M",
    date: "2026-07-10",
    type: "انتقال دائم",
    season,
  },

  {
    id: 10,
    playerId: 10,
    player: "Nico González",
    nationality: "Spain",
    flag: "🇪🇸",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Manchester City",
    fromLogo: logos.manCity,

    to: "Newcastle United",
    toLogo: logos.newcastle,

    fee: "£52M",
    date: "2026-08-26",
    type: "انتقال دائم",
    season,
  },

  {
    id: 11,
    playerId: 11,
    player: "Johan Manzambi",
    nationality: "Switzerland",
    flag: "🇨🇭",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "SC Freiburg",
    fromLogo: "",

    to: "Aston Villa",
    toLogo: logos.astonVilla,

    fee: "£52M",
    date: "2026-08-01",
    type: "انتقال دائم",
    season,
  },

  {
    id: 12,
    playerId: 12,
    player: "Nicolas Jackson",
    nationality: "Senegal",
    flag: "🇸🇳",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Chelsea",
    fromLogo: logos.chelsea,

    to: "Aston Villa",
    toLogo: logos.astonVilla,

    fee: "£47.5M + £17.5M إضافات",
    date: "2026-08-28",
    type: "انتقال دائم",
    season,
  },

  {
    id: 13,
    playerId: 13,
    player: "Allan Elias",
    nationality: "Brazil",
    flag: "🇧🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Palmeiras",
    fromLogo: logos.palmeiras,

    to: "Manchester City",
    toLogo: logos.manCity,

    fee: "€40M",
    date: "2026-08-31",
    type: "انتقال دائم",
    season,
  },

  {
    id: 14,
    playerId: 14,
    player: "Omar Marmoush",
    nationality: "Egypt",
    flag: "🇪🇬",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Manchester City",
    fromLogo: logos.manCity,

    to: "Tottenham Hotspur",
    toLogo: logos.spurs,

    fee: "£50M + £10M إضافات",
    date: "2026-08-27",
    type: "إعارة مع إلزام شراء",
    season,
  },

  {
    id: 15,
    playerId: 15,
    player: "Emiliano Martínez",
    nationality: "Argentina",
    flag: "🇦🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/168438.png",

    from: "Aston Villa",
    fromLogo: logos.astonVilla,

    to: "Chelsea",
    toLogo: logos.chelsea,

    fee: "£7.5M",
    date: "2026-08-29",
    type: "انتقال دائم",
    season,
  },

  {
    id: 16,
    playerId: 16,
    player: "Leon Goretzka",
    nationality: "Germany",
    flag: "🇩🇪",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/159665.png",

    from: "Bayern Munich",
    fromLogo: "",

    to: "Aston Villa",
    toLogo: logos.astonVilla,

    fee: "غير معلن",
    date: "2026-08-20",
    type: "انتقال دائم",
    season,
  },

  {
    id: 17,
    playerId: 17,
    player: "Sávio",
    nationality: "Brazil",
    flag: "🇧🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Manchester City",
    fromLogo: logos.manCity,

    to: "Tottenham Hotspur",
    toLogo: logos.spurs,

    fee: "£75M + إضافات",
    date: "2026-08-05",
    type: "انتقال دائم",
    season,
  },

  {
    id: 18,
    playerId: 18,
    player: "Jan Paul van Hecke",
    nationality: "Netherlands",
    flag: "🇳🇱",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Brighton",
    fromLogo: logos.brighton,

    to: "Tottenham Hotspur",
    toLogo: logos.spurs,

    fee: "£52M",
    date: "2026-07-25",
    type: "انتقال دائم",
    season,
  },

  {
    id: 19,
    playerId: 19,
    player: "Malick Diouf",
    nationality: "Senegal",
    flag: "🇸🇳",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Slavia Prague",
    fromLogo: "",

    to: "West Ham United",
    toLogo: logos.westHam,

    fee: "غير معلن",
    date: "2026-07-15",
    type: "انتقال دائم",
    season,
  },

  {
    id: 20,
    playerId: 20,
    player: "Christos Tzolis",
    nationality: "Greece",
    flag: "🇬🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Club Brugge",
    fromLogo: "",

    to: "Arsenal",
    toLogo: logos.arsenal,

    fee: "غير معلن",
    date: "2026-08-01",
    type: "انتقال دائم",
    season,
  },

  {
    id: 21,
    playerId: 21,
    player: "Ezri Konsa",
    nationality: "England",
    flag: "🏴",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Aston Villa",
    fromLogo: logos.astonVilla,

    to: "Arsenal",
    toLogo: logos.arsenal,

    fee: "غير معلن",
    date: "2026-08-05",
    type: "انتقال دائم",
    season,
  },

  {
    id: 22,
    playerId: 22,
    player: "Jérémy Monga",
    nationality: "England",
    flag: "🏴",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Leicester City",
    fromLogo: "",

    to: "Manchester City",
    toLogo: logos.manCity,

    fee: "غير معلن",
    date: "2026-07-01",
    type: "انتقال دائم",
    season,
  },

  {
    id: 23,
    playerId: 23,
    player: "Pierce Charles",
    nationality: "Northern Ireland",
    flag: "🇬🇧",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    from: "Sunderland",
    fromLogo: "",

    to: "Manchester City",
    toLogo: logos.manCity,

    fee: "غير معلن",
    date: "2026-07-01",
    type: "انتقال دائم",
    season,
  },
];

/* =========================================================
   PLAYER CAREERS
========================================================= */

export const players: PlayerData[] = [

  {
    id: 1,
    name: "Morgan Rogers",
    nationality: "England",
    flag: "🏴",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/276451.png",

    position: "جناح / وسط هجومي",

    currentTeam: "Chelsea",
    currentLogo: logos.chelsea,

    career: [
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2021",
        to: "2023",
      },
      {
        team: "Middlesbrough",
        logo: "",
        from: "2023",
        to: "2024",
      },
      {
        team: "Aston Villa",
        logo: logos.astonVilla,
        from: "2024",
        to: "2026",
      },
      {
        team: "Chelsea",
        logo: logos.chelsea,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 2,
    name: "Elliot Anderson",
    nationality: "Scotland",
    flag: "🏴",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "وسط",

    currentTeam: "Manchester City",
    currentLogo: logos.manCity,

    career: [
      {
        team: "Newcastle United",
        logo: logos.newcastle,
        from: "2021",
        to: "2025",
      },
      {
        team: "Nottingham Forest",
        logo: logos.nottingham,
        from: "2025",
        to: "2026",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 3,
    name: "Sandro Tonali",
    nationality: "Italy",
    flag: "🇮🇹",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/233629.png",

    position: "وسط",

    currentTeam: "Tottenham Hotspur",
    currentLogo: logos.spurs,

    career: [
      {
        team: "Brescia",
        logo: "",
        from: "2017",
        to: "2020",
      },
      {
        team: "AC Milan",
        logo: "",
        from: "2020",
        to: "2023",
      },
      {
        team: "Newcastle United",
        logo: logos.newcastle,
        from: "2023",
        to: "2026",
      },
      {
        team: "Tottenham Hotspur",
        logo: logos.spurs,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 4,
    name: "Ayyoub Bouaddi",
    nationality: "France",
    flag: "🇫🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/315640.png",

    position: "وسط",

    currentTeam: "Manchester City",
    currentLogo: logos.manCity,

    career: [
      {
        team: "Lille",
        logo: logos.lille,
        from: "2024",
        to: "2026",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 5,
    name: "Mateus Fernandes",
    nationality: "Portugal",
    flag: "🇵🇹",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "وسط",

    currentTeam: "Tottenham Hotspur",
    currentLogo: logos.spurs,

    career: [
      {
        team: "Sporting CP",
        logo: "",
        from: "2022",
        to: "2025",
      },
      {
        team: "Southampton",
        logo: "",
        from: "2025",
        to: "2026",
      },
      {
        team: "Tottenham Hotspur",
        logo: logos.spurs,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 6,
    name: "Savinho",
    nationality: "Brazil",
    flag: "🇧🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "جناح",

    currentTeam: "Tottenham Hotspur",
    currentLogo: logos.spurs,

    career: [
      {
        team: "Girona",
        logo: "",
        from: "2023",
        to: "2024",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2024",
        to: "2026",
      },
      {
        team: "Tottenham Hotspur",
        logo: logos.spurs,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 7,
    name: "Bruno Guimarães",
    nationality: "Brazil",
    flag: "🇧🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/224343.png",

    position: "وسط",

    currentTeam: "Arsenal",
    currentLogo: logos.arsenal,

    career: [
      {
        team: "Athletico Paranaense",
        logo: "",
        from: "2017",
        to: "2019",
      },
      {
        team: "Lyon",
        logo: "",
        from: "2020",
        to: "2022",
      },
      {
        team: "Newcastle United",
        logo: logos.newcastle,
        from: "2022",
        to: "2026",
      },
      {
        team: "Arsenal",
        logo: logos.arsenal,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 8,
    name: "Carlos Baleba",
    nationality: "Cameroon",
    flag: "🇨🇲",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/315640.png",

    position: "وسط",

    currentTeam: "Manchester United",
    currentLogo: logos.manUnited,

    career: [
      {
        team: "Lille",
        logo: logos.lille,
        from: "2022",
        to: "2023",
      },
      {
        team: "Brighton",
        logo: logos.brighton,
        from: "2023",
        to: "2026",
      },
      {
        team: "Manchester United",
        logo: logos.manUnited,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 9,
    name: "Jeremy Jacquet",
    nationality: "France",
    flag: "🇫🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/315640.png",

    position: "قلب دفاع",

    currentTeam: "Liverpool",
    currentLogo: logos.liverpool,

    career: [
      {
        team: "Rennes",
        logo: logos.rennes,
        from: "2024",
        to: "2026",
      },
      {
        team: "Liverpool",
        logo: logos.liverpool,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 10,
    name: "Nico González",
    nationality: "Spain",
    flag: "🇪🇸",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "وسط",

    currentTeam: "Newcastle United",
    currentLogo: logos.newcastle,

    career: [
      {
        team: "Barcelona",
        logo: "",
        from: "2021",
        to: "2023",
      },
      {
        team: "Porto",
        logo: "",
        from: "2023",
        to: "2025",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2025",
        to: "2026",
      },
      {
        team: "Newcastle United",
        logo: logos.newcastle,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 11,
    name: "Johan Manzambi",
    nationality: "Switzerland",
    flag: "🇨🇭",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "وسط",

    currentTeam: "Aston Villa",
    currentLogo: logos.astonVilla,

    career: [
      {
        team: "SC Freiburg",
        logo: "",
        from: "2024",
        to: "2026",
      },
      {
        team: "Aston Villa",
        logo: logos.astonVilla,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 12,
    name: "Nicolas Jackson",
    nationality: "Senegal",
    flag: "🇸🇳",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "مهاجم",

    currentTeam: "Aston Villa",
    currentLogo: logos.astonVilla,

    career: [
      {
        team: "Villarreal",
        logo: "",
        from: "2021",
        to: "2023",
      },
      {
        team: "Chelsea",
        logo: logos.chelsea,
        from: "2023",
        to: "2026",
      },
      {
        team: "Bayern Munich",
        logo: "",
        from: "2025",
        to: "2026",
      },
      {
        team: "Aston Villa",
        logo: logos.astonVilla,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 13,
    name: "Allan Elias",
    nationality: "Brazil",
    flag: "🇧🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "جناح",

    currentTeam: "Manchester City",
    currentLogo: logos.manCity,

    career: [
      {
        team: "Palmeiras",
        logo: logos.palmeiras,
        from: "2023",
        to: "2026",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 14,
    name: "Omar Marmoush",
    nationality: "Egypt",
    flag: "🇪🇬",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "مهاجم / جناح",

    currentTeam: "Tottenham Hotspur",
    currentLogo: logos.spurs,

    career: [
      {
        team: "Wolfsburg",
        logo: "",
        from: "2020",
        to: "2023",
      },
      {
        team: "Eintracht Frankfurt",
        logo: "",
        from: "2023",
        to: "2025",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2025",
        to: "2026",
      },
      {
        team: "Tottenham Hotspur",
        logo: logos.spurs,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 15,
    name: "Emiliano Martínez",
    nationality: "Argentina",
    flag: "🇦🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/168438.png",

    position: "حارس مرمى",

    currentTeam: "Chelsea",
    currentLogo: logos.chelsea,

    career: [
      {
        team: "Arsenal",
        logo: logos.arsenal,
        from: "2010",
        to: "2020",
      },
      {
        team: "Aston Villa",
        logo: logos.astonVilla,
        from: "2020",
        to: "2026",
      },
      {
        team: "Chelsea",
        logo: logos.chelsea,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 16,
    name: "Leon Goretzka",
    nationality: "Germany",
    flag: "🇩🇪",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/159665.png",

    position: "وسط",

    currentTeam: "Aston Villa",
    currentLogo: logos.astonVilla,

    career: [
      {
        team: "VfL Bochum",
        logo: "",
        from: "2012",
        to: "2013",
      },
      {
        team: "Schalke 04",
        logo: "",
        from: "2013",
        to: "2018",
      },
      {
        team: "Bayern Munich",
        logo: "",
        from: "2018",
        to: "2026",
      },
      {
        team: "Aston Villa",
        logo: logos.astonVilla,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 17,
    name: "Sávio",
    nationality: "Brazil",
    flag: "🇧🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "جناح",

    currentTeam: "Tottenham Hotspur",
    currentLogo: logos.spurs,

    career: [
      {
        team: "Girona",
        logo: "",
        from: "2023",
        to: "2024",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2024",
        to: "2026",
      },
      {
        team: "Tottenham Hotspur",
        logo: logos.spurs,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 18,
    name: "Jan Paul van Hecke",
    nationality: "Netherlands",
    flag: "🇳🇱",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "قلب دفاع",

    currentTeam: "Tottenham Hotspur",
    currentLogo: logos.spurs,

    career: [
      {
        team: "NAC Breda",
        logo: "",
        from: "2019",
        to: "2020",
      },
      {
        team: "Brighton",
        logo: logos.brighton,
        from: "2020",
        to: "2026",
      },
      {
        team: "Tottenham Hotspur",
        logo: logos.spurs,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 19,
    name: "Malick Diouf",
    nationality: "Senegal",
    flag: "🇸🇳",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "ظهير أيسر",

    currentTeam: "West Ham United",
    currentLogo: logos.westHam,

    career: [
      {
        team: "Slavia Prague",
        logo: "",
        from: "2024",
        to: "2026",
      },
      {
        team: "West Ham United",
        logo: logos.westHam,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 20,
    name: "Christos Tzolis",
    nationality: "Greece",
    flag: "🇬🇷",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "جناح",

    currentTeam: "Arsenal",
    currentLogo: logos.arsenal,

    career: [
      {
        team: "PAOK",
        logo: "",
        from: "2020",
        to: "2021",
      },
      {
        team: "Club Brugge",
        logo: "",
        from: "2024",
        to: "2026",
      },
      {
        team: "Arsenal",
        logo: logos.arsenal,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 21,
    name: "Ezri Konsa",
    nationality: "England",
    flag: "🏴",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "قلب دفاع",

    currentTeam: "Arsenal",
    currentLogo: logos.arsenal,

    career: [
      {
        team: "Brentford",
        logo: "",
        from: "2016",
        to: "2019",
      },
      {
        team: "Aston Villa",
        logo: logos.astonVilla,
        from: "2019",
        to: "2026",
      },
      {
        team: "Arsenal",
        logo: logos.arsenal,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 22,
    name: "Jérémy Monga",
    nationality: "England",
    flag: "🏴",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "جناح",

    currentTeam: "Manchester City",
    currentLogo: logos.manCity,

    career: [
      {
        team: "Leicester City",
        logo: "",
        from: "2025",
        to: "2026",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2026",
        to: "الآن",
      },
    ],
  },

  {
    id: 23,
    name: "Pierce Charles",
    nationality: "Northern Ireland",
    flag: "🇬🇧",
    photo:
      "https://a.espncdn.com/i/headshots/soccer/players/full/280555.png",

    position: "حارس مرمى",

    currentTeam: "Manchester City",
    currentLogo: logos.manCity,

    career: [
      {
        team: "Sunderland",
        logo: "",
        from: "2024",
        to: "2026",
      },
      {
        team: "Manchester City",
        logo: logos.manCity,
        from: "2026",
        to: "الآن",
      },
    ],
  },
];

/* =========================================================
   HELPERS
========================================================= */

export function getPlayer(
  id: number
): PlayerData | undefined {
  return players.find(
    player => player.id === id
  );
}

export function getTransfer(
  id: number
): Transfer | undefined {
  return transfers.find(
    transfer => transfer.id === id
  );
}

export function searchPlayers(
  query: string
): PlayerData[] {
  const value =
    query.trim().toLowerCase();

  if (!value) {
    return players;
  }

  return players.filter(player =>
    player.name
      .toLowerCase()
      .includes(value)
  );
}

export function searchTransfers(
  query: string
): Transfer[] {
  const value =
    query.trim().toLowerCase();

  if (!value) {
    return transfers;
  }

  return transfers.filter(
    transfer =>
      transfer.player
        .toLowerCase()
        .includes(value) ||
      transfer.from
        .toLowerCase()
        .includes(value) ||
      transfer.to
        .toLowerCase()
        .includes(value)
  );
}