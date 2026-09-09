
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getTeamNews, type Team, type TeamNews } from "../api/teamsApi";
import "./TeamDetails.css";

const BASE = "/api/espn/sports/soccer";

const LEAGUES = [
  ["eng.1", "Premier League"],
  ["esp.1", "La Liga"],
  ["ger.1", "Bundesliga"],
  ["ita.1", "Serie A"],
  ["fra.1", "Ligue 1"],
  ["uefa.champions", "Champions League"],
] as const;

function scoreValue(match: any, teamId: string) {
  const competitor = match?.competitions?.[0]?.competitors?.find(
    (item: any) => String(item?.team?.id) === String(teamId)
  );

  return competitor?.score ?? "-";
}

function MatchRow({ match }: { match: any }) {
  const competition = match?.competitions?.[0];
  const competitors = competition?.competitors || [];

  const home =
    competitors.find((item: any) => item.homeAway === "home") ||
    competitors[0];

  const away =
    competitors.find((item: any) => item.homeAway === "away") ||
    competitors[1];

  const status = competition?.status;
  const statusType = status?.type;

  const date = match?.date
    ? new Date(match.date)
    : null;

  const dateText = date
    ? date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })
    : "-";

  const timeText = date
    ? date.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "-";

  let middleText = timeText;

  if (statusType?.completed) {
    middleText = `${scoreValue(match, home?.team?.id)} - ${scoreValue(
      match,
      away?.team?.id
    )}`;
  } else if (statusType?.state === "in") {
    middleText = "LIVE";
  }

  return (
    <div className="team-match">
      <div className="match-date">
        <span>{dateText}</span>
      </div>

      <div className="match-team">
        <span>{home?.team?.displayName || "Unknown"}</span>

        {home?.team?.logos?.[0]?.href ? (
          <img
            src={home.team.logos[0].href}
            alt={home.team.displayName || ""}
          />
        ) : (
          <span>⚽</span>
        )}
      </div>

      <div className="match-score">
        <strong>{middleText}</strong>

        <small>
          {statusType?.completed
            ? "FT"
            : statusType?.state === "in"
            ? "LIVE"
            : timeText}
        </small>
      </div>

      <div className="match-team away">
        {away?.team?.logos?.[0]?.href ? (
          <img
            src={away.team.logos[0].href}
            alt={away.team.displayName || ""}
          />
        ) : (
          <span>⚽</span>
        )}

        <span>{away?.team?.displayName || "Unknown"}</span>
      </div>
    </div>
  );
}

export default function TeamDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [team, setTeam] = useState<Team | null>(null);
  const [pastMatches, setPastMatches] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [news, setNews] = useState<TeamNews[]>([]);
  const [showAllUpcoming, setShowAllUpcoming] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const teamId = id;

    async function loadTeam() {
      setLoading(true);

      try {
        let foundTeam: Team | null = null;

        for (const [league, leagueName] of LEAGUES) {
          try {
            const response = await fetch(
              `${BASE}/${league}/teams/${teamId}`
            );

            if (!response.ok) continue;

            const data = await response.json();

            const t =
              data?.team ||
              data?.sports?.[0]?.leagues?.[0]?.teams?.[0]?.team;

            if (t?.id) {
              foundTeam = {
                id: String(t.id),
                name: t.displayName || t.name || "Unknown",
                abbreviation: t.abbreviation || "",
                logo: t.logos?.[0]?.href || "",
                league: leagueName,
              };

              break;
            }
          } catch {
            continue;
          }
        }

        setTeam(foundTeam);

        /*
         * ================================
         * GET ALL TEAM MATCHES
         * ================================
         */

        const allMatches: any[] = [];

        try {
          const response = await fetch(
            `${BASE}/all/teams/${teamId}/schedule?limit=200`
          );

          if (response.ok) {
            const data = await response.json();

            if (Array.isArray(data?.events)) {
              allMatches.push(...data.events);
            }
          }
        } catch (error) {
          console.error("Team schedule error:", error);
        }

        /*
         * لو all لم يرجع البيانات بشكل كافي،
         * نجرب الدوريات واحدًا واحدًا.
         */

        if (allMatches.length < 3) {
          for (const [league] of LEAGUES) {
            try {
              const response = await fetch(
                `${BASE}/${league}/teams/${teamId}/schedule?limit=200`
              );

              if (!response.ok) continue;

              const data = await response.json();

              if (Array.isArray(data?.events)) {
                allMatches.push(...data.events);
              }
            } catch {
              continue;
            }
          }
        }

        /*
         * إزالة المباريات المكررة
         */

        const uniqueMatches = Array.from(
          new Map(
            allMatches
              .filter((match: any) => match?.id)
              .map((match: any) => [
                String(match.id),
                match,
              ])
          ).values()
        );

        /*
         * نتأكد إن المباراة تخص الفريق
         */

        const teamMatches = uniqueMatches.filter(
          (match: any) => {
            const competitors =
              match?.competitions?.[0]?.competitors || [];

            return competitors.some(
              (competitor: any) =>
                String(competitor?.team?.id) ===
                String(teamId)
            );
          }
        );

        /*
         * ================================
         * PAST MATCHES
         * آخر 3 مباريات انتهت فعليًا
         * ================================
         */

        const past = teamMatches
          .filter((match: any) => {
            const status =
              match?.competitions?.[0]?.status?.type;

            return (
              status?.completed === true ||
              status?.state === "post"
            );
          })
          .sort(
            (a: any, b: any) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime()
          );

        /*
         * ================================
         * UPCOMING MATCHES
         * ================================
         */

        const upcoming = teamMatches
          .filter((match: any) => {
            const status =
              match?.competitions?.[0]?.status?.type;

            return (
              status?.completed !== true &&
              status?.state !== "post" &&
              new Date(match.date).getTime() >=
                Date.now()
            );
          })
          .sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() -
              new Date(b.date).getTime()
          );

        setPastMatches(past.slice(0, 3));
        setUpcomingMatches(upcoming);

        /*
         * ================================
         * NEWS
         * ================================
         */

        try {
          const teamNews = await getTeamNews(teamId);
          setNews(teamNews || []);
        } catch (error) {
          console.error("Team news error:", error);
          setNews([]);
        }
      } catch (error) {
        console.error("Team details error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadTeam();
  }, [id]);

  if (loading) {
    return (
      <div className="team-details-page">
        <div className="team-container">
          <div className="team-loading">
            <div />
            <p>Loading team...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="team-details-page">
        <div className="team-container">
          <div className="team-loading">
            <p>Team not found.</p>

            <button onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const visibleUpcoming = showAllUpcoming
    ? upcomingMatches
    : upcomingMatches.slice(0, 3);

  return (
    <div className="team-details-page">
      <div className="team-container">

        {/* HERO */}

        <section className="team-hero">
          <button
            className="team-back"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <div className="team-hero-content">
            <div className="big-team-logo">
              {team.logo ? (
                <img
                  src={team.logo}
                  alt={team.name}
                />
              ) : (
                <span>⚽</span>
              )}
            </div>

            <div>
              <span>TEAM PROFILE</span>

              <h1>{team.name}</h1>

              <p>
                {team.league}
                {team.abbreviation
                  ? ` • ${team.abbreviation}`
                  : ""}
              </p>
            </div>
          </div>
        </section>

        <main className="team-content">

          {/* PAST MATCHES */}

          <section className="team-section">
            <div className="team-section-title">
              <div>
                <span>RESULTS</span>
                <h2>Past Matches</h2>
              </div>

              <b>{pastMatches.length}</b>
            </div>

            {pastMatches.length === 0 ? (
              <div className="team-empty">
                No past matches available.
              </div>
            ) : (
              <div className="team-matches">
                {pastMatches.map((match) => (
                  <MatchRow
                    key={match.id}
                    match={match}
                  />
                ))}
              </div>
            )}
          </section>

          {/* UPCOMING MATCHES */}

          <section className="team-section">
            <div className="team-section-title">
              <div>
                <span>FIXTURES</span>
                <h2>Upcoming Matches</h2>
              </div>

              <b>{upcomingMatches.length}</b>
            </div>

            {upcomingMatches.length === 0 ? (
              <div className="team-empty">
                No upcoming matches available.
              </div>
            ) : (
              <>
                <div className="team-matches">
                  {visibleUpcoming.map((match) => (
                    <MatchRow
                      key={match.id}
                      match={match}
                    />
                  ))}
                </div>

                {upcomingMatches.length > 3 && (
                  <button
                    className="show-more-btn"
                    onClick={() =>
                      setShowAllUpcoming(
                        !showAllUpcoming
                      )
                    }
                  >
                    {showAllUpcoming
                      ? "عرض أقل"
                      : "عرض المزيد"}
                  </button>
                )}
              </>
            )}
          </section>

          {/* NEWS */}

          <section className="team-section">
            <div className="team-section-title">
              <div>
                <span>LATEST</span>
                <h2>Team News</h2>
              </div>

              <b>{news.length}</b>
            </div>

            {news.length === 0 ? (
              <div className="team-empty">
                No news available.
              </div>
            ) : (
              <div className="team-news">
                {news.slice(0, 6).map((article, index) => (
                  <article
                    className="news-card"
                    key={article.id || index}
                  >
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.headline}
                      />
                    )}

                    <div>
                      <span>TEAM NEWS</span>

                      <h3>{article.headline}</h3>

                      {article.description && (
                        <p>
                          {article.description}
                        </p>
                      )}

                      {article.link && (
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Read More →
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

        </main>
      </div>
    </div>
  );
}

