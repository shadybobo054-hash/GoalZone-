
export type Team = {
  id?: string | number;
  name?: string;
  displayName?: string;
  shortDisplayName?: string;
  logo?: string;
};

export type Competitor = {
  homeAway?: "home" | "away";
  team?: Team;
  score?: string;
};

export type ApiEvent = {
  id: string | number;
  name?: string;
  date?: string;
  status?: string;

  league?: {
    id?: string;
    name?: string;
  };

  competitions?: {
    competitors?: Competitor[];
    status?: {
      type?: {
        state?: string;
        detail?: string;
        description?: string;
      };
    };
  }[];

  home_team?: string;
  away_team?: string;
  home_logo?: string;
  away_logo?: string;
  match_date?: string;
  score_home?: number;
  score_away?: number;
};

export type MatchDetails = ApiEvent;

export type League = {
  id: string;
  name: string;
  country?: string;
  logo?: string;
};

export const LEAGUES = {
  premierLeague: "eng.1",
  laLiga: "esp.1",
  bundesliga: "ger.1",
  serieA: "ita.1",
  ligue1: "fra.1",
  championsLeague: "uefa.champions",
};

const BASE_URL = "http://127.0.0.1:5174/api";

async function fetchJSON(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Server Error ${response.status}`);
  }

  return response.json();
}

/* تحويل بيانات MySQL إلى الشكل الذي تستخدمه الواجهة */

function convertMatch(match: any): ApiEvent {
  let state = "pre";

  const status = String(match.status || "").toUpperCase();

  if (
    status.includes("LIVE") ||
    status.includes("IN_PROGRESS")
  ) {
    state = "in";
  }

  if (
    status.includes("FULL_TIME") ||
    status.includes("FINISHED") ||
    status.includes("FINAL")
  ) {
    state = "post";
  }

  return {
    id: match.source_id || match.id,

    name: `${match.home_team} vs ${match.away_team}`,

    date: match.match_date,

    status: match.status,

    league: {
      id: match.league_id || "",
      name: match.league_name || "",
    },

    home_team: match.home_team,
    away_team: match.away_team,

    home_logo: match.home_logo,
    away_logo: match.away_logo,

    match_date: match.match_date,

    score_home: Number(match.score_home || 0),
    score_away: Number(match.score_away || 0),

    competitions: [
      {
        competitors: [
          {
            homeAway: "home",
            team: {
              displayName: match.home_team,
              logo: match.home_logo || "",
            },
            score: String(match.score_home ?? 0),
          },
          {
            homeAway: "away",
            team: {
              displayName: match.away_team,
              logo: match.away_logo || "",
            },
            score: String(match.score_away ?? 0),
          },
        ],

        status: {
          type: {
            state,
            detail: match.status || "",
            description: match.status || "",
          },
        },
      },
    ],
  };
}

/* MATCHES - من السيرفر فقط */

export async function getMatches(
  league?: string,
  date?: string
): Promise<ApiEvent[]> {
  const data = await fetchJSON(`${BASE_URL}/matches`);

  let matches = Array.isArray(data)
    ? data
    : data?.matches || [];

  if (league) {
    matches = matches.filter(
      (m: any) =>
        m.league_id === league
    );
  }

  if (date) {
    matches = matches.filter(
      (m: any) =>
        String(m.match_date).slice(0, 10) === date
    );
  }

  return matches.map(convertMatch);
}

/* MATCH DETAILS */

export async function getMatchDetails(
  league: string,
  eventId: string
): Promise<MatchDetails | null> {
  const matches = await getMatches(league);

  return (
    matches.find(
      (m) => String(m.id) === String(eventId)
    ) ?? null
  );
}

/* FEATURED */

export async function getFeaturedMatches(): Promise<ApiEvent[]> {
  const matches = await getMatches();

  return matches
    .filter((m) => m.date)
    .sort(
      (a, b) =>
        new Date(a.date!).getTime() -
        new Date(b.date!).getTime()
    )
    .slice(0, 6);
}

/* BACKEND MATCH */

export type BackendMatch = {
  id: number;
  source_id?: string | null;
  home_team: string;
  away_team: string;
  home_logo: string | null;
  away_logo: string | null;
  match_date: string;
  status: string;
  score_home: number;
  score_away: number;
  league_id: string | null;
  league_name: string | null;
  country: string | null;
  league_logo: string | null;
};

export async function getBackendMatches(): Promise<BackendMatch[]> {
  const data = await fetchJSON(`${BASE_URL}/matches`);

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.matches)) {
    return data.matches;
  }

  throw new Error("Invalid matches response");
}

/* LEAGUES */

export async function getLeagues(): Promise<League[]> {
  return [
    {
      id: "eng.1",
      name: "Premier League",
      country: "England",
    },
    {
      id: "esp.1",
      name: "La Liga",
      country: "Spain",
    },
    {
      id: "ger.1",
      name: "Bundesliga",
      country: "Germany",
    },
    {
      id: "ita.1",
      name: "Serie A",
      country: "Italy",
    },
    {
      id: "fra.1",
      name: "Ligue 1",
      country: "France",
    },
    {
      id: "uefa.champions",
      name: "Champions League",
      country: "Europe",
    },
  ];
}

/* NEWS */

export async function getNews() {
  const data = await fetchJSON(`${BASE_URL}/news`);
  return data?.news ?? [];
}

/* TRANSFERS */

export async function getTransfers() {
  const data = await fetchJSON(`${BASE_URL}/transfers`);
  return data?.transfers ?? [];
}

