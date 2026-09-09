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

type ApiResponse = {
  success?: boolean;
  matches?: Match[];
};

const API_URL = "http://127.0.0.1:5000/api/matches";

function dateKey(date: Date) {
  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function matchDateKey(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return dateKey(date);
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
    value.includes("UPCOMING") ||
    value.includes("TBA")
  );
}

function normalizeMatches(list: Match[]) {
  return Array.from(
    new Map(
      list.map((match) => [
        match.source_id ||
          `${match.home_team}-${match.away_team}-${match.match_date}`,
        match,
      ])
    ).values()
  );
}

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const controller = new AbortController();

    async function loadMatches() {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(API_URL, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Server Error ${res.status}`);
        }

        const data: Match[] | ApiResponse = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.matches)
            ? data.matches
            : [];

        const unique = normalizeMatches(list);

        /*
         * مهم:
         * لا نمسح البيانات القديمة لو السيرفر رجع
         * مصفوفة فاضية مؤقتًا.
         */
        if (unique.length > 0) {
          setMatches(unique);

          const todayKey = dateKey(new Date());

          const todayMatches = unique.filter(
            (match) =>
              matchDateKey(match.match_date) === todayKey
          );

          if (todayMatches.length > 0) {
            setSelectedDate(new Date());
          } else {
            const future = unique
              .map((match) => new Date(match.match_date))
              .filter(
                (date) =>
                  !Number.isNaN(date.getTime()) &&
                  date.getTime() >= Date.now()
              )
              .sort(
                (a, b) =>
                  a.getTime() - b.getTime()
              );

            if (future[0]) {
              setSelectedDate(future[0]);
            } else {
              const nearest = unique
                .map(
                  (match) =>
                    new Date(match.match_date)
                )
                .filter(
                  (date) =>
                    !Number.isNaN(date.getTime())
                )
                .sort(
                  (a, b) =>
                    Math.abs(
                      a.getTime() - Date.now()
                    ) -
                    Math.abs(
                      b.getTime() - Date.now()
                    )
                );

              if (nearest[0]) {
                setSelectedDate(nearest[0]);
              }
            }
          }
        } else {
          /*
           * لو مفيش بيانات جديدة، نحتفظ بالقديمة.
           */
          if (matches.length === 0) {
            setError("No matches available right now.");
          }
        }
      } catch (err) {
        if (
          err instanceof DOMException &&
          err.name === "AbortError"
        ) {
          return;
        }

        console.error("❌ Matches error:", err);

        /*
         * أهم تعديل:
         * ممنوع setMatches([]) هنا.
         */
        setError(
          "Unable to refresh matches. Showing saved data."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMatches();

    return () => {
      controller.abort();
    };
  }, []);

  const selectedKey = dateKey(selectedDate);

  const days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(selectedDate);

      date.setDate(
        selectedDate.getDate() - 3 + i
      );

      return date;
    });
  }, [selectedDate]);

  const dayMatches = useMemo(
    () =>
      matches.filter(
        (match) =>
          matchDateKey(match.match_date) ===
          selectedKey
      ),
    [matches, selectedKey]
  );

  const leagues = useMemo(
    () =>
      Array.from(
        new Set(
          dayMatches.map(
            (match) => match.league_id || "other"
          )
        )
      ),
    [dayMatches]
  );

  function changeDay(amount: number) {
    const next = new Date(selectedDate);

    next.setDate(
      next.getDate() + amount
    );

    setSelectedDate(next);
  }

  function goToday() {
    const today = new Date();

    const hasToday = matches.some(
      (match) =>
        matchDateKey(match.match_date) ===
        dateKey(today)
    );

    if (hasToday) {
      setSelectedDate(today);
      return;
    }

    const future = matches
      .map(
        (match) =>
          new Date(match.match_date)
      )
      .filter(
        (date) =>
          !Number.isNaN(date.getTime()) &&
          date.getTime() >= Date.now()
      )
      .sort(
        (a, b) =>
          a.getTime() - b.getTime()
      );

    setSelectedDate(future[0] || today);
  }

  return (
    <main className="matches-page">
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

        <div className="calendar">
          <button
            className="calendar-arrow"
            onClick={() => changeDay(-1)}
          >
            ‹
          </button>

          <div className="days">
            {days.map((date) => {
              const key = dateKey(date);
              const active = key === selectedKey;

              const count = matches.filter(
                (match) =>
                  matchDateKey(match.match_date) ===
                  key
              ).length;

              return (
                <button
                  key={key}
                  className={
                    active
                      ? "calendar-day active"
                      : "calendar-day"
                  }
                  onClick={() =>
                    setSelectedDate(date)
                  }
                >
                  <span>{getDayName(date)}</span>

                  <b>{date.getDate()}</b>

                  <small>{getMonth(date)}</small>

                  {count > 0 && <i>{count}</i>}
                </button>
              );
            })}
          </div>

          <button
            className="calendar-arrow"
            onClick={() => changeDay(1)}
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

        {error && matches.length > 0 && (
          <div className="matches-refresh-message">
            ⚠ {error}
          </div>
        )}

        {loading && matches.length === 0 && (
          <div className="matches-state">
            <div className="loading-spinner" />
            <h3>Loading matches...</h3>
          </div>
        )}

        {!loading &&
          matches.length === 0 && (
            <div className="matches-state">
              <span>⚽</span>

              <h3>No matches available</h3>

              <p>
                The football server is currently unavailable.
              </p>
            </div>
          )}

        {dayMatches.length === 0 &&
          matches.length > 0 &&
          !loading && (
            <div className="matches-state">
              <span>⚽</span>

              <h3>No matches on this date</h3>

              <p>
                Choose another date from the calendar.
              </p>
            </div>
          )}

        {dayMatches.length > 0 && (
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
                      <small>COMPETITION</small>

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

                              <small>HOME</small>
                            </div>

                            <div className="match-center">
                              {scheduled ? (
                                <>
                                  <strong className="time">
                                    {getTime(
                                      match.match_date
                                    )}
                                  </strong>

                                  <small>VS</small>
                                </>
                              ) : (
                                <div className="score">
                                  <b>
                                    {match.score_home}
                                  </b>

                                  <span>:</span>

                                  <b>
                                    {match.score_away}
                                  </b>
                                </div>
                              )}
                            </div>

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

                              <small>AWAY</small>
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