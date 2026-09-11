
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
  league?: { id?: string; name?: string };
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

const ESPN_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

const BASE_URL = "http://127.0.0.1:5000/api";

async function fetchJSON(url: string) {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok)
    throw new Error(`Server Error ${response.status}`);

  const data = await response.json();

  return data;
}

/* MATCHES */

export async function getMatches(
  league: string = LEAGUES.premierLeague
): Promise<ApiEvent[]> {
  const data = await fetchJSON(
    `${ESPN_URL}/${league}/scoreboard`
  );

  return Array.isArray(data?.events)
    ? data.events
    : [];
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
  const leagues = Object.values(LEAGUES);

  const results = await Promise.allSettled(
    leagues.map(getMatches)
  );

  const matches: ApiEvent[] = [];

  results.forEach((result) => {
    if (result.status === "fulfilled")
      matches.push(...result.value);
  });

  return matches
    .filter((m) => m.date)
    .sort(
      (a, b) =>
        new Date(a.date!).getTime() -
        new Date(b.date!).getTime()
    )
    .slice(0, 6);
}

/* BACKEND MATCHES */

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

  if (Array.isArray(data))
    return data;

  if (Array.isArray(data?.matches))
    return data.matches;

  throw new Error("Invalid matches response");
}

/* LEAGUES */

export async function getLeagues(): Promise<League[]> {
  return [
    { id: "eng.1", name: "Premier League", country: "England" },
    { id: "esp.1", name: "La Liga", country: "Spain" },
    { id: "ger.1", name: "Bundesliga", country: "Germany" },
    { id: "ita.1", name: "Serie A", country: "Italy" },
    { id: "fra.1", name: "Ligue 1", country: "France" },
    { id: "uefa.champions", name: "Champions League", country: "Europe" },
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

