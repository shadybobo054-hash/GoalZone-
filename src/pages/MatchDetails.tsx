
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import {
  getMatchDetails,
  getMatchStatus,
  getMatchTeams,
  type ApiEvent,
  type MatchDetails as ApiMatchDetails,
} from "../api/footballApi";

import "./MatchDetails.css";

type LocationState = {
  match?: ApiEvent;
  from?: "matches" | "live";
};

export default function MatchDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as LocationState | null;
  const match = state?.match;

  const [details, setDetails] = useState<ApiMatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const goBack = () => {
    navigate(state?.from === "matches" ? "/matches" : "/live");
  };

  const load = async () => {
    if (!id || !match) {
      setError("Match data is not available.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getMatchDetails(
        match.league?.id || "eng.1",
        id
      );

      if (!data) throw new Error("No data");

      setDetails(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load match details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();

    if (!match || !isLive(match)) return;

    const timer = setInterval(load, 30000);

    return () => clearInterval(timer);
  }, [id]);

  if (!match) {
    return (
      <main className="match-details-page">
        <section className="details-state">
          <div className="state-icon">⚽</div>
          <h3>Match Not Found</h3>
          <p>No match data was found.</p>
          <button onClick={goBack}>Back</button>
        </section>
      </main>
    );
  }

  const current = details?.event || match;
  const { home, away } = getMatchTeams(current);
  const status = getMatchStatus(current);
  const live = isLive(current);

  return (
    <main className="match-details-page">

      {/* HERO */}
      <section className="details-hero">

        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>

        <div className="details-league">
          {current.league?.name || "Football"}
        </div>

        <div className={`details-status ${live ? "live" : ""}`}>
          {live && <i />}
          {status}
        </div>

        <div className="details-match">

          {/* HOME */}
          <div className="details-team">
            <div className="details-logo">
              {home?.team.logo ? (
                <img
                  src={home.team.logo}
                  alt={home.team.displayName}
                />
              ) : (
                <span>⚽</span>
              )}
            </div>

            <h2>{home?.team.displayName || "Home Team"}</h2>

            <small>
              {home?.team.abbreviation || "HOME"}
            </small>
          </div>

          {/* SCORE */}
          <div className="details-score">
            <div>
              <strong>{home?.score ?? "0"}</strong>
              <span>:</span>
              <strong>{away?.score ?? "0"}</strong>
            </div>

            <small>
              {current.competitions?.[0]?.status?.type?.shortDetail ||
                "MATCH"}
            </small>
          </div>

          {/* AWAY */}
          <div className="details-team">
            <div className="details-logo">
              {away?.team.logo ? (
                <img
                  src={away.team.logo}
                  alt={away.team.displayName}
                />
              ) : (
                <span>⚽</span>
              )}
            </div>

            <h2>{away?.team.displayName || "Away Team"}</h2>

            <small>
              {away?.team.abbreviation || "AWAY"}
            </small>
          </div>

        </div>
      </section>

      {/* CONTENT */}
      <section className="details-content">

        {loading && (
          <section className="details-state">
            <div className="details-loader" />
            <h3>Loading Match Details</h3>
            <p>Getting the latest data from ESPN...</p>
          </section>
        )}

        {!loading && error && (
          <section className="details-state">
            <div className="state-icon">⚠</div>
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={load}>Try Again</button>
          </section>
        )}

        {!loading && !error && details && (
          <>
            <div className="details-grid">

              {/* TIMELINE */}
              <section className="details-panel">
                <div className="panel-title">
                  <span>LIVE TIMELINE</span>
                  <h3>Match Events</h3>
                </div>

                {details.plays.length === 0 ? (
                  <div className="empty-details">
                    No events available yet.
                  </div>
                ) : (
                  <div className="timeline">
                    {details.plays
                      .slice()
                      .reverse()
                      .map((play, index) => (
                        <div
                          className={`timeline-item ${
                            play.scoringPlay ? "goal" : ""
                          }`}
                          key={play.id || index}
                        >
                          <div className="timeline-time">
                            {play.clock?.displayValue ||
                              `${play.period?.number || ""}'`}
                          </div>

                          <div className="timeline-dot">
                            {play.scoringPlay ? "⚽" : "•"}
                          </div>

                          <div className="timeline-text">
                            <strong>
                              {play.shortText ||
                                play.text ||
                                "Match event"}
                            </strong>

                            {play.team?.displayName && (
                              <small>
                                {play.team.displayName}
                              </small>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              {/* INFO */}
              <section className="details-panel">
                <div className="panel-title">
                  <span>MATCH INFO</span>
                  <h3>Match Information</h3>
                </div>

                <div className="info-list">

                  <div>
                    <span>🏟 Stadium</span>
                    <strong>
                      {details.venue || "Not available"}
                    </strong>
                  </div>

                  <div>
                    <span>📅 Date</span>
                    <strong>
                      {new Date(current.date).toLocaleDateString(
                        "en-US"
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>🕐 Time</span>
                    <strong>
                      {new Date(current.date).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>🏆 League</span>
                    <strong>
                      {current.league?.name || "Football"}
                    </strong>
                  </div>

                  {details.attendance && (
                    <div>
                      <span>👥 Attendance</span>
                      <strong>
                        {details.attendance.toLocaleString()}
                      </strong>
                    </div>
                  )}

                </div>
              </section>

            </div>

            {/* STATS */}
            {details.statistics.length > 0 && (
              <section className="details-panel stats-panel">

                <div className="panel-title">
                  <span>MATCH STATS</span>
                  <h3>Match Statistics</h3>
                </div>

                <div className="stats-table">
                  {details.statistics.map((stat, index) => (
                    <div
                      className="stat-row"
                      key={`${stat.name}-${index}`}
                    >
                      <strong>{stat.home || "-"}</strong>

                      <span>
                        {stat.displayName ||
                          stat.name ||
                          "Stat"}
                      </span>

                      <strong>{stat.away || "-"}</strong>
                    </div>
                  ))}
                </div>

              </section>
            )}

            {/* PLAYERS */}
            {details.leaders.length > 0 && (
              <section className="details-panel">

                <div className="panel-title">
                  <span>TOP PLAYERS</span>
                  <h3>Top Players</h3>
                </div>

                <div className="leaders-grid">
                  {details.leaders.slice(0, 6).map(
                    (leader, index) => (
                      <div
                        className="leader-card"
                        key={index}
                      >
                        {leader.athlete?.headshot?.href && (
                          <img
                            src={
                              leader.athlete.headshot.href
                            }
                            alt=""
                          />
                        )}

                        <div>
                          <strong>
                            {leader.athlete?.displayName ||
                              leader.displayName ||
                              "Player"}
                          </strong>

                          <small>
                            {leader.name || "Performance"}
                          </small>
                        </div>

                        <b>{leader.value ?? "-"}</b>
                      </div>
                    )
                  )}
                </div>

              </section>
            )}

          </>
        )}

      </section>
    </main>
  );
}

function isLive(match: ApiEvent) {
  return (
    match.competitions?.[0]?.status?.type?.state === "in"
  );
}

