import { useEffect, useState } from "react";
import {
  getLeagues,
  type League,
} from "../api/footballApi";
import "./Leagues.css";

const LEAGUE_LOGOS: Record<string, string> = {
  "eng.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/23.png",

  "esp.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/15.png",

  "ger.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/10.png",

  "ita.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/12.png",

  "fra.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/9.png",

  "ned.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/11.png",

  "por.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/14.png",

  "bel.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/18.png",

  "tur.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/33.png",

  "sco.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/40.png",

  "usa.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/19.png",

  "bra.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/85.png",

  "arg.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/202.png",

  "mex.1":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/22.png",

  "uefa.champions":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/2.png",

  "uefa.europa":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/2310.png",

  "fifa.world":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/8.png",

  "caf.nations":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/50.png",

  "conmebol.libertadores":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/12.png",
};

export default function Leagues() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeagues()
      .then(setLeagues)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="leagues-page">
        <div className="leagues-loading">
          Loading leagues ⚽
        </div>
      </main>
    );
  }

  return (
    <main className="leagues-page">
      <section className="leagues-hero">
        <span>GOALZONE</span>

        <h1>Football Leagues</h1>

        <p>
          Explore competitions from around the world
        </p>
      </section>

      <section className="leagues-grid">
        {leagues.map((league) => {
          const logo =
            LEAGUE_LOGOS[league.id];

          return (
            <article
              className="league-card"
              key={league.id}
            >
              <div className="league-icon">
                {logo ? (
                  <img
                    src={logo}
                    alt={league.name}
                  />
                ) : (
                  <span>🏆</span>
                )}
              </div>

              <div className="league-info">
                <h2>{league.name}</h2>
                <p>{league.country}</p>
              </div>

              <span className="league-arrow">
                →
              </span>
            </article>
          );
        })}
      </section>
    </main>
  );
}