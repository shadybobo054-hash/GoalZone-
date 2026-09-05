import { useEffect, useMemo, useState } from "react";
import {
  getMatches,
  LEAGUES,
  type ApiEvent,
} from "../api/footballApi";
import "./Matches.css";

const LEAGUES_LIST = Object.values(LEAGUES);

type TeamCompetitor = {
  homeAway?: "home" | "away";
  score?: string | number;
  team?: {
    displayName?: string;
    logo?: string;
  };
};

const getTeam = (
  match: ApiEvent,
  side: "home" | "away"
): TeamCompetitor | undefined => {
  const competitors =
    (match.competitions?.[0]?.competitors ||
      []) as TeamCompetitor[];

  return competitors.find(
    team => team.homeAway === side
  );
};

const getLeagueName = (match: ApiEvent) =>
  match.league?.name || "Football";

const dateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(date);

const getStatus = (match: ApiEvent) => {
  const status =
    match.competitions?.[0]?.status?.type;

  if (status?.state === "in") {
    return "LIVE";
  }

  if (status?.state === "post") {
    return "FT";
  }

  return (
    status?.shortDetail ||
    status?.detail ||
    "UPCOMING"
  );
};

const getTime = (match: ApiEvent) => {
  if (!match.date) return "--:--";

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(match.date));
};

export default function Matches() {
  const [selectedDate, setSelectedDate] =
    useState(new Date());

  const [matches, setMatches] =
    useState<ApiEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState(false);

  const dates = useMemo(() => {
    const list: Date[] = [];

    for (let i = -2; i <= 4; i++) {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(
        date.getDate() + i
      );
      list.push(date);
    }

    return list;
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    setError(false);

    try {
      const result =
        await Promise.all(
          LEAGUES_LIST.map(league =>
            getMatches(
              league,
              selectedDate
            ).catch(() => [])
          )
        );

      const allMatches =
        result
          .flat()
          .filter(
            (match: ApiEvent) =>
              match?.id
          );

      const unique = [
        ...new Map(
          allMatches.map(match => [
            match.id,
            match,
          ])
        ).values(),
      ];

      setMatches(unique);
    } catch (err) {
      console.error(err);
      setError(true);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, [selectedDate]);

  const groupedMatches = useMemo(() => {
    const groups: Record<
      string,
      ApiEvent[]
    > = {};

    matches.forEach(match => {
      const league =
        getLeagueName(match);

      if (!groups[league]) {
        groups[league] = [];
      }

      groups[league].push(match);
    });

    return groups;
  }, [matches]);

  const changeDate = (days: number) => {
    const newDate =
      new Date(selectedDate);

    newDate.setDate(
      newDate.getDate() + days
    );

    setSelectedDate(newDate);
  };

  return (
    <main className="matches-page">

      {/* ================= HERO ================= */}

      <section className="matches-hero">

        <div className="matches-hero-grid" />

        <div className="matches-glow glow-one" />
        <div className="matches-glow glow-two" />

        <div className="matches-container matches-hero-content">

          <div className="matches-hero-copy">

            <div className="matches-eyebrow">
              <i />
              GOALZONE · MATCH CENTER
            </div>

            <h1>
              EVERY MATCH.
              <strong>
                ONE PLACE.
              </strong>
            </h1>

            <p>
              Browse today's football
              fixtures, upcoming games
              and live results from the
              world's biggest leagues.
            </p>

            <div className="matches-hero-stats">

              <div>
                <strong>
                  {matches.length}
                </strong>
                <span>MATCHES</span>
              </div>

              <div>
                <strong>
                  {
                    Object.keys(
                      groupedMatches
                    ).length
                  }
                </strong>
                <span>LEAGUES</span>
              </div>

              <div>
                <strong>LIVE</strong>
                <span>UPDATES</span>
              </div>

            </div>

          </div>

          <div className="matches-hero-card">

            <div className="hero-card-top">

              <span>
                MATCH CENTER
              </span>

              <b>
                <i />
                LIVE DATA
              </b>

            </div>

            <div className="hero-card-date">
              {formatDate(selectedDate)}
            </div>

            <div className="hero-card-line">
              <span />
              <i />
              <span />
            </div>

            <div className="hero-card-bottom">

              <span>GOALZONE</span>

              <strong>
                FIXTURES
              </strong>

            </div>

          </div>

        </div>
      </section>

      {/* ================= CALENDAR ================= */}

      <section className="matches-container calendar-section">

        <div className="calendar-top">

          <span className="section-label">
            MATCH CALENDAR
          </span>

          <h2>
            Choose your{" "}
            <strong>
              matchday
            </strong>
          </h2>

          <p>
            Select a date to explore all
            available fixtures.
          </p>

        </div>

        {/* DATE NAVIGATION */}

        <div className="date-strip-wrapper">

          <button
            type="button"
            className="date-arrow"
            onClick={() =>
              changeDate(-1)
            }
            aria-label="Previous day"
          >
            ‹
          </button>

          <div className="date-strip">

            {dates.map(date => {

              const active =
                dateKey(date) ===
                dateKey(selectedDate);

              return (
                <button
                  key={dateKey(date)}
                  className={
                    active
                      ? "date-btn active"
                      : "date-btn"
                  }
                  onClick={() =>
                    setSelectedDate(
                      new Date(date)
                    )
                  }
                >

                  <span>
                    {date.toLocaleDateString(
                      "en-US",
                      {
                        weekday: "short",
                      }
                    )}
                  </span>

                  <strong>
                    {date.getDate()}
                  </strong>

                  <small>
                    {date.toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                      }
                    )}
                  </small>

                </button>
              );
            })}

          </div>

          <button
            type="button"
            className="date-arrow"
            onClick={() =>
              changeDate(1)
            }
            aria-label="Next day"
          >
            ›
          </button>

        </div>

      </section>

      {/* ================= MATCHES ================= */}

      <section className="matches-container matches-list-section">

        <div className="matches-section-head">

          <div>

            <span className="section-label">
              FOOTBALL FIXTURES
            </span>

            <h2>
              Today's{" "}
              <strong>
                Matches
              </strong>
            </h2>

          </div>

          <div className="matches-total">

            <strong>
              {matches.length}
            </strong>

            <span>
              MATCHES
            </span>

          </div>

        </div>

        {/* LOADING */}

        {loading && (

          <div className="matches-state">

            <div className="matches-loader" />

            <h3>
              Loading matches...
            </h3>

            <p>
              Fetching the latest football
              fixtures.
            </p>

          </div>

        )}

        {/* ERROR */}

        {!loading && error && (

          <div className="matches-state">

            <strong>
              SOMETHING WENT WRONG
            </strong>

            <p>
              We couldn't load the matches
              right now.
            </p>

            <button
              onClick={loadMatches}
            >
              TRY AGAIN
            </button>

          </div>

        )}

        {/* NO MATCHES */}

        {!loading &&
          !error &&
          !matches.length && (

            <div className="matches-state">

              <strong>
                NO MATCHES FOUND
              </strong>

              <p>
                There are no fixtures
                available for this date.
              </p>

            </div>

          )}

        {/* MATCHES */}

        {!loading &&
          !error &&
          matches.length > 0 && (

            <div className="league-groups">

              {Object.entries(
                groupedMatches
              ).map(
                ([leagueName, leagueMatches]) => (

                  <section
                    className="league-group"
                    key={leagueName}
                  >

                    <div className="league-header">

                      <div className="league-title">

                        <div className="league-icon">
                          ⚽
                        </div>

                        <div>

                          <span>
                            COMPETITION
                          </span>

                          <h3>
                            {leagueName}
                          </h3>

                        </div>

                      </div>

                      <span className="league-count">
                        {leagueMatches.length} MATCHES
                      </span>

                    </div>

                    <div className="matches-grid">

                      {leagueMatches.map(
                        match => {

                          const home =
                            getTeam(
                              match,
                              "home"
                            );

                          const away =
                            getTeam(
                              match,
                              "away"
                            );

                          const isLive =
                            match
                              .competitions?.[0]
                              ?.status?.type
                              ?.state === "in";

                          const status =
                            getStatus(match);

                          return (
                            <article
                              className={
                                isLive
                                  ? "match-card live"
                                  : "match-card"
                              }
                              key={match.id}
                            >

                              <div className="match-card-top">

                                <span>

                                  {isLive ? (
                                    <>
                                      <i />
                                      LIVE
                                    </>
                                  ) : (
                                    status
                                  )}

                                </span>

                                <small>
                                  {getTime(match)}
                                </small>

                              </div>

                              <div className="match-teams">

                                {/* HOME */}

                                <div className="match-team">

                                  {home?.team?.logo ? (

                                    <img
                                      src={
                                        home.team.logo
                                      }
                                      alt={
                                        home.team
                                          .displayName ||
                                        "Home"
                                      }
                                    />

                                  ) : (

                                    <div className="team-fallback">
                                      H
                                    </div>

                                  )}

                                  <strong>
                                    {home?.team
                                      ?.displayName ||
                                      "Home"}
                                  </strong>

                                  <b>
                                    {home?.score ??
                                      "-"}
                                  </b>

                                </div>

                                {/* VS */}

                                <div className="match-vs">

                                  <span>
                                    {isLive
                                      ? "LIVE"
                                      : "VS"}
                                  </span>

                                  <small>
                                    {isLive
                                      ? "NOW"
                                      : "MATCH"}
                                  </small>

                                </div>

                                {/* AWAY */}

                                <div className="match-team">

                                  {away?.team?.logo ? (

                                    <img
                                      src={
                                        away.team.logo
                                      }
                                      alt={
                                        away.team
                                          .displayName ||
                                        "Away"
                                      }
                                    />

                                  ) : (

                                    <div className="team-fallback">
                                      A
                                    </div>

                                  )}

                                  <strong>
                                    {away?.team
                                      ?.displayName ||
                                      "Away"}
                                  </strong>

                                  <b>
                                    {away?.score ??
                                      "-"}
                                  </b>

                                </div>

                              </div>

                              <div className="match-card-footer">

                                <span>
                                  {isLive
                                    ? "LIVE SCORE"
                                    : "MATCH CENTER"}
                                </span>

                                <button
                                  type="button"
                                >
                                  VIEW MATCH →
                                </button>

                              </div>

                            </article>
                          );
                        }
                      )}

                    </div>

                  </section>
                )
              )}

            </div>

          )}

      </section>

    </main>
  );
}