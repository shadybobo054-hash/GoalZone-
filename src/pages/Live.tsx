import { useEffect, useState } from "react";
import "./Live.css";

type Match = {
  id: number;
  home_team: string;
  away_team: string;
  home_logo: string | null;
  away_logo: string | null;
  match_date: string;
  status: string;
  score_home: number;
  score_away: number;
  league_name: string | null;
  league_logo: string | null;
};

export default function Live() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMatches = () => {
    fetch("http://localhost:5000/api/matches")
      .then((r) => r.json())
      .then((data) => {
        const live = Array.isArray(data)
          ? data.filter((m: Match) => {
              const s = m.status.toUpperCase();
              return (
                s.includes("LIVE") ||
                s.includes("IN PROGRESS") ||
                s.includes("HALFTIME") ||
                s.includes("1H") ||
                s.includes("2H")
              );
            })
          : [];

        setMatches(live);
      })
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMatches();
    const timer = setInterval(loadMatches, 30000);
    return () => clearInterval(timer);
  }, []);

  const getMinute = (status: string) => {
    const found = status.match(/\d+/);
    return found ? `${found[0]}'` : "LIVE";
  };

  return (
    <main className="live-page">
      <section className="live-hero">
        <div className="live-hero-overlay" />

        <div className="live-hero-content">
          <div className="live-kicker">
            <span />
            GOALZONE • LIVE CENTER
          </div>

          <h1>
            THE GAME
            <br />
            <b>IS ON.</b>
          </h1>

          <p>
            Follow every live match, score and moment in real time.
          </p>

          <div className="live-stats">
            <div>
              <strong>{matches.length}</strong>
              <span>LIVE MATCHES</span>
            </div>

            <div>
              <strong>30s</strong>
              <span>AUTO REFRESH</span>
            </div>

            <div>
              <strong>24/7</strong>
              <span>FOOTBALL</span>
            </div>
          </div>
        </div>

        <div className="live-orb">
          <span>LIVE</span>
          <strong>●</strong>
          <small>NOW</small>
        </div>
      </section>

      <section className="live-section">
        <div className="live-heading">
          <div>
            <span>REAL TIME SCORES</span>
            <h2>
              Live <b>Now</b>
            </h2>
          </div>

          <div className="live-indicator">
            <i />
            {matches.length} LIVE
          </div>
        </div>

        {loading ? (
          <div className="live-empty">
            <div className="spinner" />
            <h3>Connecting to live center...</h3>
          </div>
        ) : matches.length === 0 ? (
          <div className="live-empty">
            <div className="empty-ball">⚽</div>
            <h3>No live matches</h3>
            <p>There are no matches happening right now.</p>
          </div>
        ) : (
          <div className="live-grid">
            {matches.map((match) => (
              <article className="live-card" key={match.id}>
                <div className="card-top">
                  <div className="competition">
                    {match.league_logo && (
                      <img src={match.league_logo} alt="" />
                    )}
                    <span>{match.league_name || "Football"}</span>
                  </div>

                  <div className="live-pill">
                    <i />
                    {getMinute(match.status)}
                  </div>
                </div>

                <div className="score-area">
                  <div className="club">
                    <div className="club-logo">
                      {match.home_logo ? (
                        <img src={match.home_logo} alt={match.home_team} />
                      ) : (
                        "⚽"
                      )}
                    </div>
                    <strong>{match.home_team}</strong>
                    <small>HOME</small>
                  </div>

                  <div className="score">
                    <strong>{match.score_home}</strong>
                    <span>:</span>
                    <strong>{match.score_away}</strong>
                  </div>

                  <div className="club">
                    <div className="club-logo">
                      {match.away_logo ? (
                        <img src={match.away_logo} alt={match.away_team} />
                      ) : (
                        "⚽"
                      )}
                    </div>
                    <strong>{match.away_team}</strong>
                    <small>AWAY</small>
                  </div>
                </div>

                <div className="card-bottom">
                  <span>● LIVE MATCH</span>
                  <span>GOALZONE</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}