import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Leagues.css";

type League = {
  id: string;
  name: string;
  country: string;
  logo: string;
};

type Match = {
  league_id: string | null;
  status: string;
};

const LEAGUES: League[] = [
  {
    id: "eng.1",
    name: "Premier League",
    country: "England",
    logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/23.png",
  },
  {
    id: "esp.1",
    name: "La Liga",
    country: "Spain",
    logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/15.png",
  },
  {
    id: "ger.1",
    name: "Bundesliga",
    country: "Germany",
    logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/10.png",
  },
  {
    id: "ita.1",
    name: "Serie A",
    country: "Italy",
    logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/12.png",
  },
  {
    id: "fra.1",
    name: "Ligue 1",
    country: "France",
    logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/9.png",
  },
  {
    id: "uefa.champions",
    name: "Champions League",
    country: "Europe",
    logo: "https://a.espncdn.com/i/leaguelogos/soccer/500/2.png",
  },
];

export default function Leagues() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(Array.isArray(data) ? data : []);
      })
      .catch(() => setMatches([]))
      .finally(() => setLoading(false));
  }, []);

  const count = (id: string) =>
    matches.filter((m) => m.league_id === id).length;

  const liveCount = (id: string) =>
    matches.filter(
      (m) =>
        m.league_id === id &&
        /LIVE|IN PROGRESS|HALFTIME|1H|2H/i.test(m.status)
    ).length;

  const featured = LEAGUES[0];

  return (
    <main className="leagues-page">
      <section className="leagues-hero">
        <div className="hero-glow" />

        <div className="leagues-hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">
              <i />
              GOALZONE • LEAGUE CENTER
            </span>

            <h1>
              THE WORLD
              <br />
              OF <b>FOOTBALL.</b>
            </h1>

            <p>
              Explore the biggest competitions, fixtures and live football
              from around the world.
            </p>
          </div>

          <div className="hero-league">
            <span>FEATURED COMPETITION</span>

            <img src={featured.logo} alt={featured.name} />

            <strong>{featured.name}</strong>
            <small>{featured.country}</small>

            <Link to="/matches">EXPLORE LEAGUE →</Link>
          </div>
        </div>
      </section>

      <section className="leagues-section">
        <header className="section-title">
          <div>
            <span>COMPETITIONS</span>
            <h2>
              Football <b>Leagues</b>
            </h2>
          </div>

          <strong>{LEAGUES.length} LEAGUES</strong>
        </header>

        <div className="league-feature">
          <div className="feature-info">
            <span>01 • FEATURED</span>

            <img src={featured.logo} alt={featured.name} />

            <div>
              <h3>{featured.name}</h3>
              <p>{featured.country} • Top Flight</p>
            </div>
          </div>

          <div className="feature-stats">
            <div>
              <strong>{count(featured.id)}</strong>
              <span>MATCHES</span>
            </div>

            <div className="live-number">
              <strong>{liveCount(featured.id)}</strong>
              <span>LIVE NOW</span>
            </div>
          </div>

          <Link to="/matches" className="feature-arrow">
            →
          </Link>
        </div>

        <div className="league-grid">
          {LEAGUES.slice(1).map((league, index) => {
            const total = count(league.id);
            const live = liveCount(league.id);

            return (
              <article className="league-card" key={league.id}>
                <div className="league-card-top">
                  <span>0{index + 2}</span>

                  {live > 0 && (
                    <b className="live-tag">
                      <i />
                      {live} LIVE
                    </b>
                  )}
                </div>

                <div className="league-logo">
                  <img src={league.logo} alt={league.name} />
                </div>

                <div className="league-card-info">
                  <h3>{league.name}</h3>
                  <p>{league.country}</p>
                </div>

                <div className="league-card-bottom">
                  <span>
                    <b>{total}</b> MATCHES
                  </span>

                  <Link to="/matches">VIEW →</Link>
                </div>
              </article>
            );
          })}
        </div>

        {loading && (
          <div className="league-loading">
            <span />
            Loading league data...
          </div>
        )}
      </section>
    </main>
  );
}