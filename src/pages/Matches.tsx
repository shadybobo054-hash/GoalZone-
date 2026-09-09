import { useEffect, useMemo, useState } from "react";
import "./Matches.css";

type Match = {
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

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  useEffect(() => {
    fetch("http://localhost:5000/api/matches")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          setMatches([]);
          return;
        }

        const unique = Array.from(
          new Map(
            data.map((match: Match) => [
              match.source_id ||
                `${match.home_team}-${match.away_team}-${match.match_date}`,
              match,
            ])
          ).values()
        );

        setMatches(unique);
      })
      .catch((err) => {
        console.error("Matches error:", err);
        setMatches([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() - 3 + i);
      return date;
    });
  }, [selectedDate]);

  function dateKey(date: Date) {
    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(
      date.getDate()
    ).padStart(2, "0")}`;
  }

  function matchDateKey(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return dateKey(date);
  }

  const selectedKey = dateKey(selectedDate);

  const dayMatches = matches.filter(
    (match) =>
      matchDateKey(match.match_date) === selectedKey
  );

  const leagues = Array.from(
    new Set(
      dayMatches.map(
        (match) => match.league_id || "other"
      )
    )
  );

  function changeDay(amount: number) {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + amount);
    setSelectedDate(next);
  }

  function goToday() {
    setSelectedDate(new Date());
  }

  function getTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "TBA";

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getDayName(date: Date) {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
    });
  }

  function getMonth(date: Date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
    });
  }

  function isLive(status: string) {
    const value = status.toUpperCase();

    return (
      value.includes("LIVE") ||
      value.includes("IN PROGRESS")
    );
  }

  function isScheduled(status: string) {
    const value = status.toUpperCase();

    return (
      value.includes("SCHEDULED") ||
      value.includes("UPCOMING")
    );
  }

  return (
    <main className="matches-page">

      {/* HERO */}

      <section className="matches-hero">
        <div className="matches-hero-content">
          <span>GOALZONE • MATCH CENTER</span>

          <h1>
            ALL <b>MATCHES</b>
          </h1>

          <p>
            Follow football matches, live scores and results.
          </p>
        </div>
      </section>

      {/* CONTENT */}

      <section className="matches-section">

        <div className="matches-heading">
          <div>
            <span>FOOTBALL CENTER</span>

            <h2>
              Football <b>Matches</b>
            </h2>
          </div>

          <strong>
            {dayMatches.length} MATCH
            {dayMatches.length !== 1 ? "ES" : ""}
          </strong>
        </div>

        {/* CALENDAR */}

        <div className="calendar">

          <button
            className="calendar-arrow"
            onClick={() => changeDay(-1)}
            aria-label="Previous day"
          >
            ‹
          </button>

          <div className="days">

            {days.map((date) => {
              const active =
                dateKey(date) === selectedKey;

              const count = matches.filter(
                (match) =>
                  matchDateKey(match.match_date) ===
                  dateKey(date)
              ).length;

              return (
                <button
                  key={dateKey(date)}
                  className={
                    active
                      ? "calendar-day active"
                      : "calendar-day"
                  }
                  onClick={() =>
                    setSelectedDate(date)
                  }
                >
                  <span>
                    {getDayName(date)}
                  </span>

                  <b>
                    {date.getDate()}
                  </b>

                  <small>
                    {getMonth(date)}
                  </small>

                  {count > 0 && (
                    <i>{count}</i>
                  )}
                </button>
              );
            })}

          </div>

          <button
            className="calendar-arrow"
            onClick={() => changeDay(1)}
            aria-label="Next day"
          >
            ›
          </button>

          <button
            className="today-btn"
            onClick={goToday}
          >
            TODAY
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="matches-state">
            <div className="loading-spinner" />
            <h3>Loading matches...</h3>
          </div>
        )}

        {/* EMPTY */}

        {!loading && dayMatches.length === 0 && (
          <div className="matches-state">
            <span>⚽</span>

            <h3>
              No matches today
            </h3>

            <p>
              Try another date using the calendar.
            </p>
          </div>
        )}

        {/* MATCHES */}

        {!loading && dayMatches.length > 0 && (
          <div className="league-groups">

            {leagues.map((leagueId) => {

              const leagueMatches =
                dayMatches.filter(
                  (match) =>
                    (match.league_id || "other") ===
                    leagueId
                );

              const league = leagueMatches[0];

              return (
                <section
                  className="league-group"
                  key={leagueId}
                >

                  {/* LEAGUE */}

                  <div className="league-header">

                    <div className="league-logo">

                      {league.league_logo ? (
                        <img
                          src={league.league_logo}
                          alt={
                            league.league_name ||
                            "League"
                          }
                        />
                      ) : (
                        <span>🏆</span>
                      )}

                    </div>

                    <div className="league-info">

                      <small>
                        COMPETITION
                      </small>

                      <h3>
                        {league.league_name ||
                          "Football"}
                      </h3>

                      <span>
                        {league.country ||
                          "International"}
                      </span>

                    </div>

                    <strong>
                      {leagueMatches.length} MATCH
                      {leagueMatches.length !== 1
                        ? "ES"
                        : ""}
                    </strong>

                  </div>

                  {/* CARDS */}

                  <div className="matches-grid">

                    {leagueMatches.map((match) => {

                      const live = isLive(
                        match.status
                      );

                      const scheduled =
                        isScheduled(
                          match.status
                        );

                      return (
                        <article
                          key={
                            match.source_id ||
                            match.id
                          }
                          className={
                            live
                              ? "match-card live"
                              : "match-card"
                          }
                        >

                          <div className="match-top">

                            <span>
                              {getTime(
                                match.match_date
                              )}
                            </span>

                            <b
                              className={
                                live
                                  ? "live-status"
                                  : ""
                              }
                            >
                              {live
                                ? "● LIVE"
                                : match.status}
                            </b>

                          </div>

                          <div className="match-teams">

                            {/* HOME */}

                            <div className="team">

                              <div className="team-logo">

                                {match.home_logo ? (
                                  <img
                                    src={
                                      match.home_logo
                                    }
                                    alt={
                                      match.home_team
                                    }
                                  />
                                ) : (
                                  <span>⚽</span>
                                )}

                              </div>

                              <strong>
                                {match.home_team}
                              </strong>

                              <small>
                                HOME
                              </small>

                            </div>

                            {/* CENTER */}

                            <div className="match-center">

                              {scheduled ? (
                                <>
                                  <strong className="time">
                                    {getTime(
                                      match.match_date
                                    )}
                                  </strong>

                                  <small>
                                    VS
                                  </small>
                                </>
                              ) : (
                                <div className="score">

                                  <b>
                                    {
                                      match.score_home
                                    }
                                  </b>

                                  <span>:</span>

                                  <b>
                                    {
                                      match.score_away
                                    }
                                  </b>

                                </div>
                              )}

                            </div>

                            {/* AWAY */}

                            <div className="team">

                              <div className="team-logo">

                                {match.away_logo ? (
                                  <img
                                    src={
                                      match.away_logo
                                    }
                                    alt={
                                      match.away_team
                                    }
                                  />
                                ) : (
                                  <span>⚽</span>
                                )}

                              </div>

                              <strong>
                                {match.away_team}
                              </strong>

                              <small>
                                AWAY
                              </small>

                            </div>

                          </div>

                          <div className="match-bottom">

                            <span>
                              {match.league_name ||
                                "Football"}
                            </span>

                            <span>
                              #{match.id}
                            </span>

                          </div>

                        </article>
                      );
                    })}

                  </div>

                </section>
              );
            })}

          </div>
        )}

      </section>
    </main>
  );
}