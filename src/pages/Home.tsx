
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getFeaturedMatches,
  type ApiEvent,
} from "../api/footballApi";
import HeroLogo from "../components/Logo";
import "./Home.css";

export default function Home() {
  const [matches, setMatches] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedMatches()
      .then(setMatches)
      .catch((error) => {
        console.error("Featured matches error:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">

      {/* ================= HERO ================= */}
      <section className="hero">

        {/* CSS Stadium */}
        <div className="stadium-lights" />

        <div className="hero-glow glow-1" />
        <div className="hero-glow glow-2" />
        <div className="hero-grid" />

        <div className="hero-content">

          {/* LEFT */}
          <div className="hero-copy">

            <div className="badge">
              <span className="badge-dot" />
              FOOTBALL • LIVE • 24/7
            </div>

            <h1>
              EVERY MATCH.
              <strong>EVERY MOMENT.</strong>
            </h1>

            <p>
              Follow live scores, upcoming fixtures, transfers
              and the biggest football moments — all in one place.
            </p>

            <div className="hero-buttons">

              <Link
                to="/matches"
                className="primary-btn"
              >
                <span>⚽</span>
                Explore Matches
                <b>→</b>
              </Link>

              <Link
                to="/live"
                className="live-btn"
              >
                <i />
                Watch Live
              </Link>

            </div>

            <div className="hero-mini-stats">

              <div className="mini-stat">
                <b>LIVE</b>
                <span>Scores</span>
              </div>

              <div className="mini-stat">
                <b>85+</b>
                <span>Leagues</span>
              </div>

              <div className="mini-stat">
                <b>24/7</b>
                <span>Updates</span>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="hero-brand">
            <HeroLogo />
          </div>

        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="featured-section">

        <div className="section-heading">

          <div>
            <span className="section-kicker">
              MATCH CENTER
            </span>

            <h2>
              Featured <strong>Matches</strong>
            </h2>
          </div>

          <Link
            to="/matches"
            className="view-all"
          >
            View All
            <span>→</span>
          </Link>

        </div>

        {loading ? (

          <div className="matches-loading">
            <div className="loading-spinner" />
            <span>Loading matches...</span>
          </div>

        ) : matches.length > 0 ? (

          <div className="home-matches-grid">

            {matches.slice(0, 6).map((match) => {

              const competitors =
                match.competitions?.[0]?.competitors || [];

              const homeTeam =
                competitors.find(
                  (team) => team.homeAway === "home"
                );

              const awayTeam =
                competitors.find(
                  (team) => team.homeAway === "away"
                );

              return (
                <div
                  className="home-match-card"
                  key={match.id}
                >

                  <div className="match-card-top">

                    <span>
                      {match.league?.name || "Football"}
                    </span>

                    <span className="match-status">
  UPCOMING
</span>

                  </div>

                  <div className="teams">

                    <div className="team">

                      <div className="team-logo">

                        {homeTeam?.team?.logo ? (

                          <img
                            src={homeTeam.team.logo}
                            alt={
                              homeTeam.team.displayName
                            }
                          />

                        ) : (
                          "⚽"
                        )}

                      </div>

                      <strong>
                        {homeTeam?.team?.shortDisplayName ||
                          "Home"}
                      </strong>

                    </div>

                    <div className="match-time">
                      <span>VS</span>
                    </div>

                    <div className="team">

                      <div className="team-logo">

                        {awayTeam?.team?.logo ? (

                          <img
                            src={awayTeam.team.logo}
                            alt={
                              awayTeam.team.displayName
                            }
                          />

                        ) : (
                          "⚽"
                        )}

                      </div>

                      <strong>
                        {awayTeam?.team?.shortDisplayName ||
                          "Away"}
                      </strong>

                    </div>

                  </div>

                  <div className="match-card-bottom">

                    <span>
                      {match.date
                        ? new Date(
                            match.date
                          ).toLocaleDateString()
                        : "TBA"}
                    </span>

                    <Link to="/matches">
                      Details →
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        ) : (

          <div className="empty-matches">

            <span>⚽</span>

            <h3>
              No featured matches
            </h3>

            <p>
              Check the matches page for the latest fixtures.
            </p>

            <Link to="/matches">
              View Matches →
            </Link>

          </div>

        )}

      </section>

      {/* ================= FEATURES ================= */}
      <section className="features-section">

        <div className="feature-card">

          <span className="feature-icon">
            ⚡
          </span>

          <h3>
            Live Scores
          </h3>

          <p>
            Follow matches and scores as they happen.
          </p>

        </div>

        <div className="feature-card">

          <span className="feature-icon">
            🔄
          </span>

          <h3>
            Transfers
          </h3>

          <p>
            Stay updated with the latest football transfers.
          </p>

        </div>

        <div className="feature-card">

          <span className="feature-icon">
            📰
          </span>

          <h3>
            Football News
          </h3>

          <p>
            Get the biggest football stories in one place.
          </p>

        </div>

      </section>

      {/* ================= CTA ================= */}
      <section className="home-cta">

        <div className="cta-glow" />

        <div className="cta-content">

          <span>
            GOALZONE
          </span>

          <h2>
            Football Never Stops.
          </h2>

          <p>
            Every match. Every goal. Every moment.
          </p>

          <Link
            to="/matches"
            className="cta-button"
          >
            Explore Matches
            <b>→</b>
          </Link>

        </div>

      </section>

    </main>
  );
}

