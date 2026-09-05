import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedMatches } from "../api/footballApi";
import type { Match } from "../api/footballApi";
import Logo from "../components/Logo";
import "./Home.css";

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeaturedMatches()
      .then(setMatches)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home">

      {/* HERO */}
      <section className="hero">
        <div className="flying-balls">
          <span>⚽</span>
          <span>⚽</span>
          <span>⚽</span>
        </div>

        <div className="hero-content">
          <div className="hero-brand">
            <Logo />
          </div>

          <div className="badge">
            ● FOOTBALL • LIVE • 24/7
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
            <Link to="/matches">
              ⚽ Explore Matches
            </Link>

            <Link to="/live" className="live">
              <span>●</span> Watch Live
            </Link>
          </div>

          <div className="hero-mini-stats">
            <div>
              <b>LIVE</b>
              <span>Scores</span>
            </div>

            <div>
              <b>85+</b>
              <span>Leagues</span>
            </div>

            <div>
              <b>24/7</b>
              <span>Updates</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED MATCHES */}
      <section className="section">

        <div className="section-head">
          <div>
            <small>⚡ MATCH CENTER</small>
            <h2>Featured Matches</h2>
            <p>Follow the action from around the world.</p>
          </div>

          <Link to="/matches">
            View All Matches →
          </Link>
        </div>

        {loading ? (
          <div className="loading">
            <span>⚽</span>
            Loading matches...
          </div>
        ) : (
          <div className="matches-grid">

            {matches.map((match) => {
              const home = match.home;
              const away = match.away;

              /* LEAGUE SAFE */
              const league =
                typeof match.league === "object"
                  ? match.league?.name
                  : match.league;

              /* STATUS SAFE */
              const status =
                typeof match.status === "object"
                  ? match.status?.displayClock ||
                    match.status?.type ||
                    "Upcoming"
                  : match.status || "Upcoming";

              return (
                <article
                  className="match-card"
                  key={match.id}
                >

                  {/* TOP */}
                  <div className="match-top">

                    <span className="league">
                      {league || "Football"}
                    </span>

                    <span className="match-time">
                      {match.time || "--:--"}
                    </span>

                  </div>

                  {/* TEAMS */}
                  <div className="teams">

                    {/* HOME */}
                    <div className="team">

                      <div className="team-logo">
                        {home?.logo ? (
                          <img
                            src={home.logo}
                            alt={home.name || "Home team"}
                          />
                        ) : (
                          <span>⚽</span>
                        )}
                      </div>

                      <strong>
                        {home?.name || "Home Team"}
                      </strong>

                      <small>
                        HOME
                      </small>

                    </div>

                    {/* VS */}
                    <div className="vs">
                      <span>VS</span>
                      <i></i>
                    </div>

                    {/* AWAY */}
                    <div className="team">

                      <div className="team-logo">
                        {away?.logo ? (
                          <img
                            src={away.logo}
                            alt={away.name || "Away team"}
                          />
                        ) : (
                          <span>⚽</span>
                        )}
                      </div>

                      <strong>
                        {away?.name || "Away Team"}
                      </strong>

                      <small>
                        AWAY
                      </small>

                    </div>

                  </div>

                  {/* STATUS */}
                  <div className="match-bottom">

                    <span className="status-dot"></span>

                    <span>
                      {status}
                    </span>

                    <Link to={`/matches/${match.id}`}>
                      Details →
                    </Link>

                  </div>

                </article>
              );
            })}

            {!matches.length && (
              <div className="empty">

                <div>⚽</div>

                <strong>
                  No matches available
                </strong>

                <span>
                  Check back soon for upcoming matches.
                </span>

              </div>
            )}

          </div>
        )}
      </section>

      {/* STATS */}
      <section className="stats">

        <div>
          <b>LIVE</b>
          <span>Live Scores</span>
        </div>

        <div>
          <b>85+</b>
          <span>Competitions</span>
        </div>

        <div>
          <b>24/7</b>
          <span>Football Updates</span>
        </div>

        <div>
          <b>∞</b>
          <span>Football Passion</span>
        </div>

      </section>

      {/* CTA */}
      <section className="cta">

        <div>
          <small>
            READY FOR KICK-OFF?
          </small>

          <h2>
            The game starts here.
          </h2>

          <p>
            Discover matches, follow live scores and never
            miss another football moment.
          </p>
        </div>

        <Link to="/matches">
          Enter Match Center →
        </Link>

      </section>

      {/* FOOTER */}
      <footer>

        <div>
          <b>
            GOAL<span>ZONE</span>
          </b>

          <p>
            Your ultimate football center.
          </p>
        </div>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/matches">Matches</Link>
          <Link to="/live">Live</Link>
          <Link to="/transfers">Transfers</Link>
          <Link to="/news">News</Link>
        </nav>

        <small>
          © 2026 GOALZONE
        </small>

      </footer>

    </main>
  );
}