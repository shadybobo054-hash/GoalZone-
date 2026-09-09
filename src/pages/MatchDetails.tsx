import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getMatchDetails,
  type MatchDetails as MatchDetailsType,
  type Competitor,
} from "../api/footballApi";
import "./MatchDetails.css";

export default function MatchDetails() {
  const { league, id } = useParams<{
    league: string;
    id: string;
  }>();

  const [match, setMatch] =
    useState<MatchDetailsType | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!league || !id) return;

    const load = async () => {
      setLoading(true);

      const data = await getMatchDetails(
        league,
        id
      );

      setMatch(data);
      setLoading(false);
    };

    load();
  }, [league, id]);

  if (loading) {
    return (
      <main className="details-page">
        <div className="details-loading">
          <div className="details-loader" />
          <h2>Loading Match...</h2>
          <p>Fetching live match information</p>
        </div>
      </main>
    );
  }

  if (!match) {
    return (
      <main className="details-page">
        <div className="details-empty">
          <span>404</span>
          <h2>Match Not Found</h2>
          <p>We couldn't find this match.</p>
          <Link to="/matches">← Back to Matches</Link>
        </div>
      </main>
    );
  }

  const competition =
    match.competitions?.[0];

  const competitors =
    competition?.competitors || [];

  const home = competitors.find(
    (team: Competitor) => team.homeAway === "home"
  );

  const away = competitors.find(
    (team: Competitor) => team.homeAway === "away"
  );

  const status =
    competition?.status?.type;

  const isLive =
    status?.state === "in";

  const isFinished =
    status?.state === "post";

  const homeScore =
    home?.score ?? "-";

  const awayScore =
    away?.score ?? "-";

  const date = match.date
    ? new Date(match.date)
    : null;

  return (
    <main className="details-page">

      {/* BACK */}
      <div className="details-container">
        <Link
          to="/matches"
          className="back-button"
        >
          ← BACK TO MATCHES
        </Link>
      </div>

      {/* HERO */}
      <section className="details-hero">

        <div className="details-glow glow-a" />
        <div className="details-glow glow-b" />

        <div className="details-container">

          <div className="details-league">
            <span>⚽</span>
            {match.league?.name || "FOOTBALL"}
          </div>

          <div className="details-status">

            {isLive && (
              <span className="live-badge">
                <i />
                LIVE NOW
              </span>
            )}

            {isFinished && (
              <span className="finished-badge">
                FULL TIME
              </span>
            )}

            {!isLive && !isFinished && (
              <span className="upcoming-badge">
                UPCOMING
              </span>
            )}

          </div>

          <div className="scoreboard">

            {/* HOME */}
            <div className="details-team">

              {home?.team?.logo ? (
                <img
                  src={home.team.logo}
                  alt={
                    home.team.displayName ||
                    "Home"
                  }
                />
              ) : (
                <div className="details-team-fallback">
                  H
                </div>
              )}

              <h2>
                {home?.team?.displayName ||
                  "Home Team"}
              </h2>

              <span>HOME</span>

            </div>

            {/* SCORE */}
            <div className="main-score">

              <div className="score">
                <strong>{homeScore}</strong>
                <b>:</b>
                <strong>{awayScore}</strong>
              </div>

              <div className="match-state">
                {isLive
                  ? "MATCH IN PROGRESS"
                  : isFinished
                  ? "MATCH FINISHED"
                  : status?.detail ||
                    "MATCH NOT STARTED"}
              </div>

              {date && (
                <div className="match-date">
                  {date.toLocaleDateString(
                    "en-US",
                    {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }
                  )}
                  {" · "}
                  {date.toLocaleTimeString(
                    "en-US",
                    {
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </div>
              )}

            </div>

            {/* AWAY */}
            <div className="details-team">

              {away?.team?.logo ? (
                <img
                  src={away.team.logo}
                  alt={
                    away.team.displayName ||
                    "Away"
                  }
                />
              ) : (
                <div className="details-team-fallback">
                  A
                </div>
              )}

              <h2>
                {away?.team?.displayName ||
                  "Away Team"}
              </h2>

              <span>AWAY</span>

            </div>

          </div>
        </div>
      </section>

      {/* INFO */}
      <section className="details-container details-content">

        <div className="details-grid">

          {/* MATCH INFO */}
          <div className="info-card">

            <div className="card-heading">
              <span>MATCH INFO</span>
              <h3>Match Information</h3>
            </div>

            <div className="info-row">
              <span>🏟 Stadium</span>
              <strong>Not available</strong>
            </div>

            <div className="info-row">
              <span>📅 Date</span>
              <strong>
                {date
                  ? date.toLocaleDateString(
                      "en-US"
                    )
                  : "Not available"}
              </strong>
            </div>

            <div className="info-row">
              <span>🕐 Time</span>
              <strong>
                {date
                  ? date.toLocaleTimeString(
                      "en-US",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "--:--"}
              </strong>
            </div>

            <div className="info-row">
              <span>🏆 Competition</span>
              <strong>
                {match.league?.name ||
                  "Football"}
              </strong>
            </div>

          </div>

          {/* STATUS */}
          <div className="info-card status-card">

            <div className="card-heading">
              <span>MATCH STATUS</span>
              <h3>Game Status</h3>
            </div>

            <div className="status-big">

              <div
                className={
                  isLive
                    ? "status-dot live"
                    : "status-dot"
                }
              />

              <strong>
                {isLive
                  ? "LIVE"
                  : isFinished
                  ? "FULL TIME"
                  : "UPCOMING"}
              </strong>

            </div>

            <p>
              {status?.description ||
                status?.detail ||
                "Match information will appear here."}
            </p>

          </div>

        </div>

        {/* TIMELINE */}
        <section className="timeline-card">

          <div className="card-heading">
            <span>LIVE TIMELINE</span>
            <h3>Match Events</h3>
          </div>

          <div className="timeline-empty">
            <div>⚡</div>
            <strong>
              No events available
            </strong>
            <p>
              Match events will appear here
              when available.
            </p>
          </div>

        </section>

        {/* STATS */}
        <section className="stats-card">

          <div className="card-heading">
            <span>MATCH STATS</span>
            <h3>Game Statistics</h3>
          </div>

          <div className="stats-grid">

            <div>
              <strong>
                {Number(homeScore) -
                  Number(awayScore) || 0}
              </strong>
              <span>GOAL DIFFERENCE</span>
            </div>

            <div>
              <strong>
                {(Number(homeScore) || 0) +
                  (Number(awayScore) || 0)}
              </strong>
              <span>TOTAL GOALS</span>
            </div>

            <div>
              <strong>
                {competitors.length}
              </strong>
              <span>TEAMS</span>
            </div>

          </div>

        </section>

      </section>
    </main>
  );
}