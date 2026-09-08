import { useEffect, useState } from "react";
import "./Matches.css";

type League = {
  league_id: string;
  league_name: string;
  country: string;
  matches_count: number;
};

type Match = {
  id: number;
  league_name?: string;
  country?: string;
  home_team: string;
  away_team: string;
  home_logo?: string;
  away_logo?: string;
  match_date?: string;
  status?: string;
  score_home?: number;
  score_away?: number;
};

const leagueLogos: Record<string, string> = {
  "eng.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/23.png",
  "esp.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/15.png",
  "ger.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/10.png",
  "ita.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/12.png",
  "fra.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/9.png",
  "ned.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/11.png",
  "por.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/14.png",
  "tur.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/18.png",
  "sco.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/24.png",
  "mex.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/22.png",
  "bra.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/8.png",
  "arg.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/13.png",
  "usa.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/19.png",
  "jpn.1": "https://a.espncdn.com/i/leaguelogos/soccer/500/21.png",
  "uefa.champions":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/2.png",
  "uefa.europa":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/2310.png",
  "uefa.europa.conf":
    "https://a.espncdn.com/i/leaguelogos/soccer/500/2022.png",
};

function getLeagueLogo(id: string) {
  return leagueLogos[id] || "";
}

export default function Matches() {
  const [leagues, setLeagues] = useState<League[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/leagues")
      .then((res) => res.json())
      .then((data) => setLeagues(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const openLeague = async (league: League) => {
    setSelectedLeague(league);
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/matches?league=${league.league_id}`
      );
      const data = await res.json();
      setMatches(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Date TBA";

  return (
    <main className="matches-page">
      <section className="matches-hero">
        <div className="hero-overlay" />

        <div className="matches-hero-content">
          <span className="hero-kicker">GOALZONE LIVE CENTER</span>
          <h1>MATCHES</h1>
          <p>Follow football matches from leagues around the world</p>
        </div>
      </section>

      {!selectedLeague && (
        <section className="leagues-section">
          <div className="section-heading">
            <span>FOOTBALL</span>
            <h2>Choose a League</h2>
            <p>Select a competition to see all its matches</p>
          </div>

          {loading ? (
            <div className="matches-state">Loading leagues...</div>
          ) : leagues.length === 0 ? (
            <div className="matches-state">No leagues found</div>
          ) : (
            <div className="leagues-grid">
              {leagues.map((league) => {
                const logo = getLeagueLogo(league.league_id);

                return (
                  <button
                    className="league-card"
                    key={league.league_id}
                    onClick={() => openLeague(league)}
                  >
                    <div className="league-icon">
                      {logo ? (
                        <img src={logo} alt={league.league_name} />
                      ) : (
                        <span>⚽</span>
                      )}
                    </div>

                    <div className="league-info">
                      <span>{league.country}</span>
                      <h3>{league.league_name}</h3>
                      <small>{league.matches_count} Matches</small>
                    </div>

                    <div className="league-arrow">→</div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {selectedLeague && (
        <section className="league-matches">
          <div className="selected-header">
            <button
              className="back-button"
              onClick={() => {
                setSelectedLeague(null);
                setMatches([]);
              }}
            >
              ← All Leagues
            </button>

            <div>
              <span>{selectedLeague.country}</span>
              <h2>{selectedLeague.league_name}</h2>
            </div>

            <div className="match-count">
              {matches.length} MATCHES
            </div>
          </div>

          {loading ? (
            <div className="matches-state">Loading matches...</div>
          ) : matches.length === 0 ? (
            <div className="matches-state">
              <h3>No matches found</h3>
              <p>This league has no matches available.</p>
            </div>
          ) : (
            <div className="matches-grid">
              {matches.map((match) => (
                <article className="match-card" key={match.id}>
                  <div className="match-top">
                    <div className="competition">
                      {match.league_name}
                    </div>

                    <span
                      className={`match-status ${
                        match.status?.toLowerCase() || ""
                      }`}
                    >
                      {match.status || "Scheduled"}
                    </span>
                  </div>

                  <div className="match-date">
                    {formatDate(match.match_date)}
                  </div>

                  <div className="teams">
                    <div className="team">
                      <div className="team-logo">
                        {match.home_logo ? (
                          <img
                            src={match.home_logo}
                            alt={match.home_team}
                          />
                        ) : (
                          "⚽"
                        )}
                      </div>
                      <strong>{match.home_team}</strong>
                    </div>

                    <div className="score">
                      <b>{match.score_home ?? 0}</b>
                      <span>:</span>
                      <b>{match.score_away ?? 0}</b>
                    </div>

                    <div className="team">
                      <div className="team-logo">
                        {match.away_logo ? (
                          <img
                            src={match.away_logo}
                            alt={match.away_team}
                          />
                        ) : (
                          "⚽"
                        )}
                      </div>
                      <strong>{match.away_team}</strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}