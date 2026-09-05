
const BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

const TRANSFER_BASE =
  "https://raw.githubusercontent.com/eordo/transfermarkt-data/master";

export const LEAGUES = {
  premierLeague: "eng.1",
  laLiga: "esp.1",
  bundesliga: "ger.1",
  serieA: "ita.1",
  ligue1: "fra.1",
  championsLeague: "uefa.champions",
} as const;

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

export type Transfer = {
  id: string;
  player: string;
  from: string;
  to: string;
  date: string;
  type: string;
  fee: string;
  playerImage: string;
  fromLogo: string;
  toLogo: string;
  marketValue?: string;
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

export async function getMatches(
  league: string,
  date?: Date
): Promise<ApiEvent[]> {
  try {
    let url =
      `${BASE_URL}/${league}/scoreboard`;

    if (date) {
      const year =
        date.getFullYear();

      const month =
        String(
          date.getMonth() + 1
        ).padStart(2, "0");

      const day =
        String(
          date.getDate()
        ).padStart(2, "0");

      const dateString =
        `${year}${month}${day}`;

      url += `?dates=${dateString}`;
    }

    const data =
      await getJSON(url);

    return data?.events || [];
  } catch (error) {
    console.error(
      "Matches API error:",
      error
    );

    return [];
  }
}

export async function getFeaturedMatches(): Promise<ApiEvent[]> {
  try {
    const results =
      await Promise.all(
        Object.values(LEAGUES).map(
          league => getMatches(league)
        )
      );

    return results
      .flat()
      .slice(0, 20);
  } catch (error) {
    console.error(
      "Featured matches error:",
      error
    );

    return [];
  }
}

export async function getLiveMatches(): Promise<ApiEvent[]> {
  try {
    const results =
      await Promise.all(
        Object.values(LEAGUES).map(
          league => getMatches(league)
        )
      );

    return results
      .flat()
      .filter(
        match =>
          match.competitions?.[0]
            ?.status?.type?.state === "in"
      );
  } catch (error) {
    console.error(
      "Live matches error:",
      error
    );

    return [];
  }
}

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

export async function getNews(
  league: string
): Promise<NewsArticle[]> {
  try {
    const data =
      await getJSON(
        `${BASE_URL}/${league}/news`
      );

    return (
      data?.articles ||
      data?.news ||
      []
    );
  } catch (error) {
    console.error(
      "News API error:",
      error
    );

    return [];
  }
}

export async function getLatestNews(): Promise<
  NewsArticle[]
> {
  try {
    const results =
      await Promise.all(
        Object.values(LEAGUES).map(
          getNews
        )
      );

    const news =
      results
        .flat()
        .filter(
          item => item?.headline
        );

    return [
      ...new Map(
        news.map(
          (item, index) => [
            item.id ||
              `${item.headline}-${index}`,
            item,
          ]
        )
      ).values(),
    ].slice(0, 30);
  } catch (error) {
    console.error(
      "Latest news error:",
      error
    );

    return [];
  }
}

/* ================= TRANSFERS ================= */

const TRANSFER_FILES: Record<
  string,
  string
> = {
  "eng.1":
    "premier_league/2025.csv",

  "esp.1":
    "laliga/2025.csv",

  "ger.1":
    "bundesliga/2025.csv",

  "ita.1":
    "serie_a/2025.csv",

  "fra.1":
    "ligue_1/2025.csv",
};

function parseCSVLine(
  line: string
): string[] {
  const result: string[] = [];

  let value = "";
  let quoted = false;

  for (
    let i = 0;
    i < line.length;
    i++
  ) {
    const char = line[i];

    if (char === '"') {
      if (
        quoted &&
        line[i + 1] === '"'
      ) {
        value += '"';
        i++;
      } else {
        quoted = !quoted;
      }

      continue;
    }

    if (
      char === "," &&
      !quoted
    ) {
      result.push(
        value.trim()
      );

      value = "";
    } else {
      value += char;
    }
  }

  result.push(value.trim());

  return result;
}

function parseCSV(
  text: string
): Record<string, string>[] {
  const lines =
    text
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers =
    parseCSVLine(lines[0]);

  return lines
    .slice(1)
    .map(line => {
      const values =
        parseCSVLine(line);

      const row: Record<
        string,
        string
      > = {};

      headers.forEach(
        (header, index) => {
          row[header] =
            values[index] || "";
        }
      );

      return row;
    });
}

/* ================= IMAGES ================= */

const imageCache =
  new Map<string, string>();

async function wikipediaImage(
  name: string
): Promise<string> {
  if (!name) return "";

  if (imageCache.has(name)) {
    return imageCache.get(name)!;
  }

  try {
    const url =
      `https://en.wikipedia.org/w/api.php?` +
      `action=query&generator=search` +
      `&gsrsearch=${encodeURIComponent(name)}` +
      `&gsrnamespace=0` +
      `&gsrlimit=1` +
      `&prop=pageimages` +
      `&piprop=thumbnail` +
      `&pithumbsize=300` +
      `&format=json&origin=*`;

    const data =
      await getJSON(url);

    const pages =
      data?.query?.pages;

    const first =
      pages
        ? Object.values(
            pages
          )[0] as any
        : null;

    const image =
      first?.thumbnail?.source ||
      "";

    imageCache.set(
      name,
      image
    );

    return image;
  } catch {
    return "";
  }
}

function formatFee(
  fee: string
): string {
  if (
    !fee ||
    fee === "-" ||
    fee === "0"
  ) {
    return "FREE";
  }

  const value =
    Number(
      fee.replace(
        /[^\d.-]/g,
        ""
      )
    );

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return "UNDISCLOSED";
  }

  if (
    value >= 1_000_000_000
  ) {
    return `€${(
      value /
      1_000_000_000
    ).toFixed(2)}B`;
  }

  if (
    value >= 1_000_000
  ) {
    const m =
      value / 1_000_000;

    return `€${m
      .toFixed(
        m >= 10 ? 0 : 1
      )}M`;
  }

  if (
    value >= 1_000
  ) {
    return `€${(
      value / 1_000
    ).toFixed(0)}K`;
  }

  return `€${value}`;
}

async function createTransfer(
  row: Record<string, string>,
  league: string,
  index: number
): Promise<Transfer | null> {
  const player =
    row.player_name?.trim();

  const club =
    row.club?.trim();

  const dealingClub =
    row.dealing_club?.trim();

  if (!player || !club) {
    return null;
  }

  const movement =
    row.movement
      ?.trim()
      .toLowerCase();

  let from =
    dealingClub || "—";

  let to = club;

  if (movement === "out") {
    from = club;
    to =
      dealingClub || "—";
  }

  const playerId =
    row.player_id || "";

  const playerImage =
    await wikipediaImage(
      player
    );

  const fromLogo =
    await wikipediaImage(
      from
    );

  const toLogo =
    await wikipediaImage(
      to
    );

  const fee =
    formatFee(row.fee);

  const type =
    row.is_loan === "1"
      ? "LOAN"
      : "TRANSFER";

  return {
    id:
      playerId ||
      `${league}-${player}-${index}`,

    player,

    from,

    to,

    date:
      row.season || "2025",

    type,

    fee,

    playerImage,

    fromLogo,

    toLogo,

    marketValue:
      row.market_value
        ? formatFee(
            row.market_value
          )
        : undefined,
  };
}

async function getTransferFile(
  league: string
): Promise<Transfer[]> {
  const file =
    TRANSFER_FILES[league];

  if (!file) return [];

  try {
    const response =
      await fetch(
        `${TRANSFER_BASE}/${file}`
      );

    if (!response.ok) {
      throw new Error(
        `CSV ${response.status}`
      );
    }

    const csv =
      await response.text();

    const rows =
      parseCSV(csv);

    const incoming =
      rows.filter(
        row =>
          row.movement
            ?.toLowerCase() ===
          "in"
      );

    const transfers =
      await Promise.all(
        incoming.map(
          (row, index) =>
            createTransfer(
              row,
              league,
              index
            )
        )
      );

    return transfers.filter(
      (
        item
      ): item is Transfer =>
        item !== null
    );
  } catch (error) {
    console.error(
      `Transfer file error ${league}:`,
      error
    );

    return [];
  }
}

export async function getTransfers(
  league?: string
): Promise<Transfer[]> {
  try {
    const leagues =
      league &&
      league !== "all"
        ? [league]
        : Object.keys(
            TRANSFER_FILES
          );

    const results =
      await Promise.all(
        leagues.map(
          getTransferFile
        )
      );

    const all =
      results.flat();

    const unique = [
      ...new Map(
        all.map(item => [
          `${item.player}-${item.from}-${item.to}`,
          item,
        ])
      ).values(),
    ];

    return unique.slice(0, 100);
  } catch (error) {
    console.error(
      "Transfers error:",
      error
    );

    return [];
  }
}

export async function getAllTransfers(): Promise<
  Transfer[]
> {
  return getTransfers("all");
}

/* ================= MATCH DETAILS ================= */

export async function getMatchDetails(
  league: string,
  eventId: string
): Promise<MatchDetails | null> {
  try {
    return await getJSON<MatchDetails>(
      `${BASE_URL}/${league}/summary?event=${eventId}`
    );
  } catch (error) {
    console.error(
      "Match details error:",
      error
    );

    return null;
  }
}

