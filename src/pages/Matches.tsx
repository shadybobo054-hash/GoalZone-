import { useEffect, useMemo, useState } from "react";
import { getMatches, LEAGUES, type ApiEvent } from "../api/footballApi";
import "./Matches.css";

type Props = { onDetails: (match: ApiEvent) => void };

const LEAGUES_LIST = [
  LEAGUES.premierLeague,
  LEAGUES.laLiga,
  LEAGUES.bundesliga,
  LEAGUES.serieA,
  LEAGUES.ligue1,
  LEAGUES.championsLeague,
];

const LEAGUE_NAMES: Record<string, string> = {
  [LEAGUES.premierLeague]: "Premier League",
  [LEAGUES.laLiga]: "La Liga",
  [LEAGUES.bundesliga]: "Bundesliga",
  [LEAGUES.serieA]: "Serie A",
  [LEAGUES.ligue1]: "Ligue 1",
  [LEAGUES.championsLeague]: "Champions League",
};

const dateKey = (date: Date) =>
  `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;

const displayDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);

const getMatchDate = (m: ApiEvent) =>
  dateKey(new Date(m.date));

const getStatus = (m: ApiEvent) => {
  const s = m.competitions?.[0]?.status?.type;
  if (s?.state === "in") return "LIVE";
  if (s?.state === "post") return "FT";
  return s?.shortDetail || s?.detail || "Upcoming";
};

const getTeam = (m: ApiEvent, side: "home" | "away") => {
  const t = m.competitions?.[0]?.competitors.find(
    x => x.homeAway === side
  );

  return {
    name: t?.team?.displayName || "Unknown",
    logo: t?.team?.logo || "",
    score: t?.score ?? null,
  };
};

const getTime = (m: ApiEvent) =>
  new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(m.date));

export default function Matches({ onDetails }: Props) {
  const today = useMemo(() => new Date(), []);
  const [selectedDate, setSelectedDate] = useState(today);
  const [matches, setMatches] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const days = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(selectedDate);
      d.setDate(d.getDate() + i - 3);
      return d;
    }), [selectedDate]);

  const loadMatches = async () => {
    setLoading(true);

    const result = await Promise.all(
      LEAGUES_LIST.map(league =>
        getMatches(league, dateKey(selectedDate)).catch(() => [])
      )
    );

    setMatches(
      Array.from(
        new Map(
          result.flat()
            .filter(m => getMatchDate(m) === dateKey(selectedDate))
            .map(m => [m.id, m])
        ).values()
      )
    );

    setLoading(false);
  };

  useEffect(() => {
    loadMatches();
  }, [selectedDate]);

  const changeDate = (amount: number) => {
    setSelectedDate(current => {
      const next = new Date(current);
      next.setDate(next.getDate() + amount);
      return next;
    });
  };

  const grouped = useMemo(() => {
    const groups: Record<string, ApiEvent[]> = {};

    matches.forEach(match => {
      const id = match.league?.id || "other";
      (groups[id] ||= []).push(match);
    });

    return Object.entries(groups);
  }, [matches]);

  return (
    <main className="matches-page">

      <section className="matches-hero">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />

        <div className="matches-container">
          <div className="matches-hero-content">
            <div className="matches-eyebrow">
              <span /> FOOTBALL FIXTURES
            </div>

            <h1>Match<strong>Center</strong></h1>

            <p>
              Browse football matches by day and follow every
              fixture from your favorite leagues.
            </p>

            <div className="selected-date-info">
              <span>SELECTED DATE</span>
              <strong>{displayDate(selectedDate)}</strong>
            </div>
          </div>

          <div className="hero-ball">⚽</div>
        </div>
      </section>

      <section className="matches-container calendar-section">
        <div className="calendar-top">
          <div>
            <span className="section-label">MATCH CALENDAR</span>
            <h2>Choose your <strong>matchday</strong></h2>
          </div>

          <button
            className="today-button"
            onClick={() => setSelectedDate(new Date(today))}
          >
            TODAY
          </button>
        </div>

        <div className="calendar">
          <button
            className="calendar-arrow"
            onClick={() => changeDate(-1)}
          >
            ‹
          </button>

          <div className="days">
            {days.map(day => {
              const active =
                dateKey(day) === dateKey(selectedDate);

              return (
                <button
                  key={dateKey(day)}
                  className={`day-card ${active ? "active" : ""}`}
                  onClick={() => setSelectedDate(new Date(day))}
                >
                  {dateKey(day) === dateKey(today) && (
                    <span className="today-tag">TODAY</span>
                  )}

                  <span className="day-name">
                    {new Intl.DateTimeFormat("en-US", {
                      weekday: "short",
                    }).format(day)}
                  </span>

                  <strong>{day.getDate()}</strong>

                  <span className="month">
                    {new Intl.DateTimeFormat("en-US", {
                      month: "short",
                    }).format(day)}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            className="calendar-arrow"
            onClick={() => changeDate(1)}
          >
            ›
          </button>
        </div>
      </section>

      <section className="matches-container fixtures-section">
        <div className="fixtures-heading">
          <div>
            <span className="section-label">FIXTURES</span>
            <h2>Matches on <strong>{displayDate(selectedDate)}</strong></h2>
          </div>

          <div className="matches-count">
            <strong>{matches.length}</strong>
            <span>MATCHES</span>
          </div>
        </div>

        {loading ? (
          <div className="matches-state">
            <div className="loading-spinner" />
            <h3>Loading matches</h3>
          </div>
        ) : matches.length === 0 ? (
          <div className="matches-state">
            <div className="state-icon">⚽</div>
            <h3>No matches</h3>
            <p>There are no matches scheduled for this date.</p>
          </div>
        ) : (
          grouped.map(([leagueId, leagueMatches]) => (
            <div className="league-block" key={leagueId}>

              <div className="league-header">
                <div className="league-icon">🏆</div>

                <div>
                  <span>COMPETITION</span>
                  <h3>
                    {LEAGUE_NAMES[leagueId] || "Football"}
                  </h3>
                </div>

                <div className="league-total">
                  {leagueMatches.length} MATCH
                  {leagueMatches.length !== 1 ? "ES" : ""}
                </div>
              </div>

              <div className="match-list">
                {leagueMatches.map(match => {
                  const home = getTeam(match, "home");
                  const away = getTeam(match, "away");
                  const live = getStatus(match) === "LIVE";

                  return (
                    <article
                      className={`match-card ${live ? "live" : ""}`}
                      key={match.id}
                    >
                      <div className="match-status">
                        {live ? (
                          <span className="live-status">
                            <i /> LIVE
                          </span>
                        ) : (
                          <span>{getStatus(match)}</span>
                        )}

                        <strong>{getTime(match)}</strong>
                      </div>

                      <div className="teams">
                        <div className="team">
                          <span>{home.name}</span>

                          {home.logo ? (
                            <img src={home.logo} alt="" />
                          ) : (
                            <div className="team-placeholder">⚽</div>
                          )}

                          {home.score !== null && (
                            <strong className="score">
                              {home.score}
                            </strong>
                          )}
                        </div>

                        <div className="vs">
                          <span>VS</span>
                        </div>

                        <div className="team away">
                          {away.score !== null && (
                            <strong className="score">
                              {away.score}
                            </strong>
                          )}

                          {away.logo ? (
                            <img src={away.logo} alt="" />
                          ) : (
                            <div className="team-placeholder">⚽</div>
                          )}

                          <span>{away.name}</span>
                        </div>
                      </div>

                      <button
                        className="details-button"
                        onClick={() => onDetails(match)}
                      >
                        DETAILS <span>→</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </section>
    </main>
  );
}