const BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

/* ================= LEAGUES ================= */

export const LEAGUES = {
  premierLeague: "eng.1",
  laLiga: "esp.1",
  bundesliga: "ger.1",
  serieA: "ita.1",
  ligue1: "fra.1",
  championsLeague: "uefa.champions",
} as const;

/* ================= TYPES ================= */

type Team = {
  id?: string;
  uid?: string;
  displayName?: string;
  shortDisplayName?: string;
  abbreviation?: string;
  logo?: string;
};

type Competitor = {
  homeAway?: "home" | "away";
  score?: string | number;
  team?: Team;
};

export type ApiEvent = {
  id: string;
  date: string;
  name?: string;
  shortName?: string;

  league?: {
    id?: string;
    name?: string;
  };

  competitions?: Array<{
    competitors?: Competitor[];

    status?: {
      type?: {
        state?: string;
        detail?: string;
        shortDetail?: string;
        description?: string;
      };
    };
  }>;
};

export type NewsArticle = {
  id?: string;
  headline: string;
  description?: string;
  published?: string;

  links?: {
    web?: {
      href?: string;
    };
  };

  images?: Array<{
    url?: string;
  }>;
};

export type MatchDetails = {
  id: string;
  name?: string;
  date?: string;
  competitions?: ApiEvent["competitions"];
  league?: ApiEvent["league"];
  news?: NewsArticle[];
  boxscore?: unknown;
};

/* ================= REQUEST ================= */

async function getJSON<T = any>(
  url: string
): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Request failed: ${response.status}`
    );
  }

  return response.json();
}

/* ================= MATCHES ================= */

const matchCache =
  new Map<string, ApiEvent[]>();

const matchPromises =
  new Map<string, Promise<ApiEvent[]>>();

function getMatchCacheKey(
  league: string,
  date?: Date
) {
  if (!date) return league;

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${league}-${year}${month}${day}`;
}

export async function getMatches(
  league: string,
  date?: Date
): Promise<ApiEvent[]> {
  const key =
    getMatchCacheKey(league, date);

  if (matchCache.has(key)) {
    return matchCache.get(key)!;
  }

  if (matchPromises.has(key)) {
    return matchPromises.get(key)!;
  }

  const promise = (async () => {
    try {
      let url =
        `${BASE_URL}/${league}/scoreboard`;

      if (date) {
        const year =
          date.getFullYear();

        const month = String(
          date.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
          date.getDate()
        ).padStart(2, "0");

        url +=
          `?dates=${year}${month}${day}`;
      }

      const data =
        await getJSON(url);

      const events =
        data?.events || [];

      matchCache.set(
        key,
        events
      );

      return events;
    } catch (error) {
      console.error(
        "Matches API error:",
        error
      );

      return [];
    } finally {
      matchPromises.delete(key);
    }
  })();

  matchPromises.set(
    key,
    promise
  );

  return promise;
}

/* ================= FEATURED ================= */

let featuredCache:
  | ApiEvent[]
  | null = null;

let featuredPromise:
  | Promise<ApiEvent[]>
  | null = null;

export async function getFeaturedMatches() {
  if (featuredCache !== null) {
    return featuredCache;
  }

  if (featuredPromise) {
    return featuredPromise;
  }

  featuredPromise = getMatches(
    LEAGUES.premierLeague
  ).then(matches => {
    featuredCache =
      matches.slice(0, 20);

    return featuredCache;
  });

  try {
    return await featuredPromise;
  } finally {
    featuredPromise = null;
  }
}

/* ================= LIVE ================= */

let liveCache:
  | ApiEvent[]
  | null = null;

let livePromise:
  | Promise<ApiEvent[]>
  | null = null;

export async function getLiveMatches() {
  if (liveCache !== null) {
    return liveCache;
  }

  if (livePromise) {
    return livePromise;
  }

  livePromise = getMatches(
    LEAGUES.premierLeague
  ).then(matches => {
    liveCache = matches.filter(
      match =>
        match.competitions?.[0]
          ?.status?.type?.state ===
        "in"
    );

    return liveCache;
  });

  try {
    return await livePromise;
  } finally {
    livePromise = null;
  }
}

/* ================= MATCH STATUS ================= */

export function getMatchStatus(
  match: ApiEvent
) {
  const status =
    match.competitions?.[0]
      ?.status?.type;

  if (!status) {
    return {
      state: "unknown",
      text: "UNKNOWN",
    };
  }

  if (status.state === "in") {
    return {
      state: "live",
      text:
        status.shortDetail ||
        status.detail ||
        "LIVE",
    };
  }

  if (status.state === "post") {
    return {
      state: "finished",
      text:
        status.shortDetail ||
        status.detail ||
        "FT",
    };
  }

  return {
    state: "upcoming",
    text:
      status.shortDetail ||
      status.detail ||
      status.description ||
      "UPCOMING",
  };
}

/* ================= TEAMS ================= */

export function getMatchTeams(
  match: ApiEvent
) {
  const competitors =
    match.competitions?.[0]
      ?.competitors || [];

  return {
    home: competitors.find(
      team =>
        team.homeAway === "home"
    ),

    away: competitors.find(
      team =>
        team.homeAway === "away"
    ),
  };
}

/* ================= NEWS ================= */
/*
   NEWS = REQUEST واحد فقط
*/

let newsCache:
  | NewsArticle[]
  | null = null;

let newsPromise:
  | Promise<NewsArticle[]>
  | null = null;

export async function getLatestNews() {
  if (newsCache !== null) {
    return newsCache;
  }

  if (newsPromise) {
    return newsPromise;
  }

  newsPromise = (async () => {
    try {
      const data =
        await getJSON(
          `${BASE_URL}/${LEAGUES.premierLeague}/news`
        );

      const articles: NewsArticle[] =
        data?.articles ||
        data?.news ||
        [];

      const unique =
        [
          ...new Map(
            articles
              .filter(
                article =>
                  article?.headline
              )
              .map(
                (article, index) => [
                  article.id ||
                    `${article.headline}-${index}`,
                  article,
                ]
              )
          ).values(),
        ];

      newsCache =
        unique.slice(0, 30);

      return newsCache;
    } catch (error) {
      console.error(
        "News API error:",
        error
      );

      newsCache = [];

      return [];
    } finally {
      newsPromise = null;
    }
  })();

  return newsPromise;
}

/*
   الكود القديم يقدر يستخدم
   getNews(league)
   وبرضه هيعمل Request واحد فقط.
*/

export async function getNews(
  _league?: string
) {
  return getLatestNews();
}

/* ================= MATCH DETAILS ================= */

const detailsCache =
  new Map<
    string,
    MatchDetails | null
  >();

const detailsPromises =
  new Map<
    string,
    Promise<MatchDetails | null>
  >();

export async function getMatchDetails(
  league: string,
  eventId: string
) {
  if (detailsCache.has(eventId)) {
    return detailsCache.get(eventId)!;
  }

  if (detailsPromises.has(eventId)) {
    return detailsPromises.get(eventId)!;
  }

  const promise =
    (async () => {
      try {
        const data =
          await getJSON<MatchDetails>(
            `${BASE_URL}/${league}/summary?event=${eventId}`
          );

        detailsCache.set(
          eventId,
          data
        );

        return data;
      } catch (error) {
        console.error(
          "Match details error:",
          error
        );

        detailsCache.set(
          eventId,
          null
        );

        return null;
      } finally {
        detailsPromises.delete(
          eventId
        );
      }
    })();

  detailsPromises.set(
    eventId,
    promise
  );

  return promise;
}

/* ================= TRANSFERS ================= */

export {
  getTransfers,
  getAllTransfers,
} from "./transferApi";