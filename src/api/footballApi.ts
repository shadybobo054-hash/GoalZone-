
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
  }[];

  home_team?: string;
  away_team?: string;
  home_logo?: string;
  away_logo?: string;
  match_date?: string;
  score_home?: number;
  score_away?: number;
};

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

const BASE_URL =
  "http://127.0.0.1:5000/api";

/* ================= SAFE FETCH ================= */

async function fetchJSON(
  url: string,
  options?: RequestInit
) {
  const response = await fetch(url, {
    ...options,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Server Error ${response.status}`
    );
  }

  const text = await response.text();

  if (!text) {
    throw new Error("Empty server response");
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      "Server returned invalid JSON"
    );
  }
}

/* ================= ESPN MATCHES ================= */

export async function getMatches(
  league: string = LEAGUES.premierLeague
): Promise<ApiEvent[]> {
  const data = await fetchJSON(
    `${ESPN_URL}/${league}/scoreboard`
  );

  if (!Array.isArray(data?.events)) {
    return [];
  }

  return data.events;
}

/* ================= FEATURED ================= */

export async function getFeaturedMatches(): Promise<
  ApiEvent[]
> {
  const leagues = [
    LEAGUES.premierLeague,
    LEAGUES.laLiga,
    LEAGUES.bundesliga,
    LEAGUES.serieA,
    LEAGUES.ligue1,
  ];

  const results = await Promise.allSettled(
    leagues.map((league) =>
      getMatches(league)
    )
  );

  const allMatches: ApiEvent[] = [];

  for (const result of results) {
    if (
      result.status === "fulfilled" &&
      Array.isArray(result.value)
    ) {
      allMatches.push(...result.value);
    }
  }

  return allMatches
    .filter((match) => match.date)
    .sort(
      (a, b) =>
        new Date(
          a.date || ""
        ).getTime() -
        new Date(
          b.date || ""
        ).getTime()
    )
    .slice(0, 6);
}

/* ================= BACKEND MATCHES ================= */

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

type MatchesResponse = {
  success?: boolean;
  matches?: BackendMatch[];
};

/*
 * ده المصدر المستخدم في Matches.tsx.
 *
 * مهم:
 * الدالة دي لا ترجع [] عند خطأ السيرفر.
 * بترمي Error عشان الصفحة تحتفظ بالبيانات
 * الموجودة بدل ما تمسحها.
 */
export async function getBackendMatches(): Promise<
  BackendMatch[]
> {
  const data: BackendMatch[] | MatchesResponse =
    await fetchJSON(
      `${BASE_URL}/matches`
    );

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.matches)) {
    return data.matches;
  }

  throw new Error(
    "Invalid matches response"
  );
}

/* ================= LEAGUES ================= */

export async function getLeagues(): Promise<
  League[]
> {
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
  return fetchJSON(
    `${BASE_URL}/news`
  );
}

/* ================= TRANSFERS ================= */

export async function getTransfers() {
  return fetchJSON(
    `${BASE_URL}/transfers`
  );
}

