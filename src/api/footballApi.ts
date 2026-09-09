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

export type CompetitionStatus = {
  type?: {
    state?: string;
    detail?: string;
    description?: string;
  };
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
    status?: CompetitionStatus;
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

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

const BASE_URL = "http://localhost:5000/api";

/* ================= MATCHES ================= */

export async function getMatches(
  league: string = LEAGUES.premierLeague
): Promise<ApiEvent[]> {
  const res = await fetch(
    `${ESPN_URL}/${league}/scoreboard`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch real matches");
  }

  const data = await res.json();

  return data.events || [];
}

/* ================= MATCH DETAILS ================= */

export async function getMatchDetails(
  league: string,
  eventId: string
): Promise<MatchDetails | null> {
  try {
    const events = await getMatches(league);
    return (
      events.find(
        (e) => String(e.id) === String(eventId)
      ) ?? null
    );
  } catch {
    return null;
  }
}

/* ================= FEATURED ================= */

export async function getFeaturedMatches(): Promise<ApiEvent[]> {
  const leagues = [
    LEAGUES.premierLeague,
    LEAGUES.laLiga,
    LEAGUES.bundesliga,
    LEAGUES.serieA,
    LEAGUES.ligue1,
  ];

  const results = await Promise.all(
    leagues.map((league) => getMatches(league))
  );

  return results
    .flat()
    .sort(
      (a, b) =>
        new Date(a.date || "").getTime() -
        new Date(b.date || "").getTime()
    )
    .slice(0, 6);
}

/* ================= LEAGUES ================= */

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

/* ================= NEWS ================= */

export async function getNews() {
  const res = await fetch(`${BASE_URL}/news`);

  if (!res.ok) {
    throw new Error("Failed to fetch news");
  }

  return res.json();
}

/* ================= TRANSFERS ================= */

export async function getTransfers() {
  const res = await fetch(`${BASE_URL}/transfers`);

  if (!res.ok) {
    throw new Error("Failed to fetch transfers");
  }

  return res.json();
}