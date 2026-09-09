
const BASE = "/api/espn/sports/soccer";

export type Team = {
  id: string;
  name: string;
  abbreviation: string;
  logo: string;
  league: string;
};

export type TeamNews = {
  id?: string;
  headline: string;
  description?: string;
  published?: string;
  image?: string;
  link?: string;
};

const LEAGUES = [
  ["eng.1", "Premier League"],
  ["esp.1", "La Liga"],
  ["ger.1", "Bundesliga"],
  ["ita.1", "Serie A"],
  ["fra.1", "Ligue 1"],
  ["uefa.champions", "Champions League"],
] as const;

async function getJSON(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`${res.status}: ${url}`);
  }

  return res.json();
}

/* =========================
   TEAMS
========================= */

export async function getTeams(): Promise<Team[]> {
  const all: Team[] = [];

  for (const [league, leagueName] of LEAGUES) {
    try {
      const data = await getJSON(
        `${BASE}/${league}/teams?limit=100`
      );

      const teams =
        data?.sports?.[0]?.leagues?.[0]?.teams ||
        data?.teams ||
        [];

      teams.forEach((item: any) => {
        const t = item?.team || item;

        if (!t?.id) return;

        all.push({
          id: String(t.id),
          name:
            t.displayName ||
            t.name ||
            "Unknown",
          abbreviation:
            t.abbreviation || "",
          logo:
            t.logos?.[0]?.href ||
            t.logo ||
            "",
          league: leagueName,
        });
      });
    } catch (error) {
      console.error(
        "Teams:",
        league,
        error
      );
    }
  }

  return Array.from(
    new Map(
      all.map((team) => [
        team.id,
        team,
      ])
    ).values()
  );
}

/* =========================
   SINGLE TEAM
========================= */

export async function getTeam(
  id: string,
  league = "eng.1"
) {
  return getJSON(
    `${BASE}/${league}/teams/${id}`
  );
}

/* =========================
   TEAM MATCHES
   آخر المباريات + القادمة
========================= */

export async function getTeamMatches(
  id: string
) {
  const all: any[] = [];

  /*
   * أولاً:
   * ESPN Team Schedule عبر كل المسابقات
   */

  try {
    const data = await getJSON(
      `${BASE}/all/teams/${id}/schedule?limit=200`
    );

    if (Array.isArray(data?.events)) {
      all.push(...data.events);
    }
  } catch (error) {
    console.error(
      "All team schedule:",
      error
    );
  }

  /*
   * احتياطي:
   * نجرب الدوريات المعروفة
   */

  if (all.length < 6) {
    for (const [league] of LEAGUES) {
      try {
        const data = await getJSON(
          `${BASE}/${league}/teams/${id}/schedule?limit=200`
        );

        if (Array.isArray(data?.events)) {
          all.push(...data.events);
        }
      } catch {
        // تجاهل الدوري لو مفيش بيانات
      }
    }
  }

  /*
   * إزالة التكرار
   */

  const unique = Array.from(
    new Map(
      all
        .filter(
          (match: any) => match?.id
        )
        .map(
          (match: any) => [
            String(match.id),
            match,
          ]
        )
    ).values()
  );

  /*
   * التأكد أن المباراة تخص الفريق
   */

  const teamMatches = unique.filter(
    (match: any) => {
      const competitors =
        match?.competitions?.[0]
          ?.competitors || [];

      return competitors.some(
        (competitor: any) =>
          String(
            competitor?.team?.id
          ) === String(id)
      );
    }
  );

  /*
   * ترتيب الأحدث أولاً
   */

  return teamMatches.sort(
    (a: any, b: any) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  );
}

/* =========================
   TEAM NEWS
========================= */

export async function getTeamNews(
  id: string
): Promise<TeamNews[]> {
  const all: any[] = [];

  for (const [league] of LEAGUES) {
    try {
      const data = await getJSON(
        `${BASE}/${league}/teams/${id}/news`
      );

      const articles =
        data?.articles ||
        data?.items ||
        [];

      if (Array.isArray(articles)) {
        all.push(...articles);
      }
    } catch (error) {
      console.error(
        "News:",
        league,
        error
      );
    }
  }

  /*
   * إزالة الأخبار المكررة
   */

  const unique = Array.from(
    new Map(
      all
        .filter(
          (item: any) =>
            item?.id ||
            item?.headline ||
            item?.title
        )
        .map(
          (item: any, index: number) => [
            String(
              item.id ||
                item.headline ||
                item.title ||
                index
            ),
            item,
          ]
        )
    ).values()
  );

  return unique.map(
    (item: any) => ({
      id: item.id,

      headline:
        item.headline ||
        item.title ||
        "Football News",

      description:
        item.description ||
        "",

      published:
        item.published ||
        "",

      image:
        item.images?.[0]?.url ||
        item.image?.url ||
        "",

      link:
        item.links?.web?.href ||
        "",
    })
  );
}

