import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./Favorites.css";

type Team = {
  id: string;
  name: string;
  country: string;
  logo: string;
};

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
};

const TEAMS: Team[] = [
  // England
  {
    id: "arsenal",
    name: "Arsenal",
    country: "England",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png",
  },
  {
    id: "chelsea",
    name: "Chelsea",
    country: "England",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",
  },
  {
    id: "liverpool",
    name: "Liverpool",
    country: "England",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png",
  },
  {
    id: "man-city",
    name: "Manchester City",
    country: "England",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/382.png",
  },
  {
    id: "man-united",
    name: "Manchester United",
    country: "England",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/360.png",
  },
  {
    id: "tottenham",
    name: "Tottenham",
    country: "England",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/367.png",
  },

  // Spain
  {
    id: "barcelona",
    name: "Barcelona",
    country: "Spain",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png",
  },
  {
    id: "real-madrid",
    name: "Real Madrid",
    country: "Spain",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
  },
  {
    id: "atletico",
    name: "Atletico Madrid",
    country: "Spain",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/1068.png",
  },
  {
    id: "sevilla",
    name: "Sevilla",
    country: "Spain",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/243.png",
  },
  {
    id: "athletic",
    name: "Athletic Club",
    country: "Spain",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/93.png",
  },

  // Germany
  {
    id: "bayern",
    name: "Bayern Munich",
    country: "Germany",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/132.png",
  },
  {
    id: "dortmund",
    name: "Borussia Dortmund",
    country: "Germany",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/124.png",
  },
  {
    id: "leverkusen",
    name: "Bayer Leverkusen",
    country: "Germany",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/131.png",
  },
  {
    id: "leipzig",
    name: "RB Leipzig",
    country: "Germany",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/11420.png",
  },
  {
    id: "frankfurt",
    name: "Eintracht Frankfurt",
    country: "Germany",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/125.png",
  },

  // Italy
  {
    id: "juventus",
    name: "Juventus",
    country: "Italy",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/111.png",
  },
  {
    id: "inter",
    name: "Inter Milan",
    country: "Italy",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/110.png",
  },
  {
    id: "ac-milan",
    name: "AC Milan",
    country: "Italy",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/103.png",
  },
  {
    id: "napoli",
    name: "Napoli",
    country: "Italy",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/114.png",
  },
  {
    id: "roma",
    name: "AS Roma",
    country: "Italy",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/104.png",
  },

  // France
  {
    id: "psg",
    name: "Paris Saint-Germain",
    country: "France",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/160.png",
  },
  {
    id: "marseille",
    name: "Marseille",
    country: "France",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/176.png",
  },
  {
    id: "lyon",
    name: "Lyon",
    country: "France",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/167.png",
  },
  {
    id: "monaco",
    name: "Monaco",
    country: "France",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/174.png",
  },

  // Netherlands
  {
    id: "ajax",
    name: "Ajax",
    country: "Netherlands",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/139.png",
  },
  {
    id: "psv",
    name: "PSV Eindhoven",
    country: "Netherlands",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/148.png",
  },

  // Portugal
  {
    id: "porto",
    name: "FC Porto",
    country: "Portugal",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/437.png",
  },
  {
    id: "benfica",
    name: "Benfica",
    country: "Portugal",
    logo: "https://a.espncdn.com/i/teamlogos/soccer/500/234.png",
  },
];

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("goalzone-favorites") || "[]"
      );
    } catch {
      return [];
    }
  });

  const [matches, setMatches] = useState<Match[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(Array.isArray(data) ? data : []);
      })
      .catch(() => setMatches([]));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "goalzone-favorites",
      JSON.stringify(favorites)
    );
  }, [favorites]);

  const favoriteTeams = TEAMS.filter((team) =>
    favorites.includes(team.id)
  );

  const filteredTeams = TEAMS.filter((team) =>
    team.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace("fc ", "")
      .replace(" fc", "")
      .replace("cf ", "")
      .replace(" cf", "");

  const teamMatches = useMemo(() => {
    const now = Date.now();

    return favoriteTeams.map((team) => {
      const teamName = normalize(team.name);

      const list = matches
        .filter((match) => {
          const home = normalize(match.home_team);
          const away = normalize(match.away_team);

          return (
            home.includes(teamName) ||
            away.includes(teamName) ||
            teamName.includes(home) ||
            teamName.includes(away)
          );
        })
        .sort(
          (a, b) =>
            new Date(a.match_date).getTime() -
            new Date(b.match_date).getTime()
        );

      const next =
        list.find(
          (match) =>
            new Date(match.match_date).getTime() >= now ||
            isLive(match.status)
        ) ||
        list[0] ||
        null;

      return {
        team,
        match: next,
      };
    });
  }, [favoriteTeams, matches]);

  function formatDate(date: string) {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "TBA";

    return value.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  }

  function formatTime(date: string) {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return "TBA";

    return value.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function isLive(status: string) {
    return /LIVE|IN PROGRESS|HALFTIME|1H|2H/i.test(status);
  }

  return (
    <main className="favorites-page">
      {/* HERO */}
      <section className="favorites-hero">
        <div className="favorites-glow" />

        <div className="favorites-hero-inner">
          <div>
            <span className="fav-eyebrow">
              <i />
              GOALZONE • YOUR FOOTBALL
            </span>

            <h1>
              YOUR TEAMS.
              <br />
              YOUR <b>GAME.</b>
            </h1>

            <p>
              Keep your favorite teams close and never miss their next match.
            </p>
          </div>

          <div className="favorite-count">
            <strong>{favoriteTeams.length}</strong>
            <span>
              FAVORITE
              <br />
              TEAMS
            </span>
          </div>
        </div>
      </section>

      {/* FAVORITES */}
      <section className="favorites-section">
        <header className="favorites-heading">
          <div>
            <span>YOUR COLLECTION</span>

            <h2>
              My <b>Teams</b>
            </h2>
          </div>

          <Link to="/matches">ALL MATCHES →</Link>
        </header>

        {favoriteTeams.length > 0 ? (
          <div className="favorite-grid">
            {teamMatches.map(({ team, match }) => (
              <article
                className="favorite-card"
                key={team.id}
              >
                <div className="favorite-card-top">
                  <span>FAVORITE</span>

                  <button
                    onClick={() => toggleFavorite(team.id)}
                    aria-label={`Remove ${team.name}`}
                  >
                    ★
                  </button>
                </div>

                <div className="favorite-team">
                  <div className="favorite-logo">
                    <img
                      src={team.logo}
                      alt={team.name}
                    />
                  </div>

                  <div>
                    <h3>{team.name}</h3>
                    <span>{team.country}</span>
                  </div>
                </div>

                {match ? (
                  <div className="next-match">
                    <div className="next-label">
                      <span>
                        {isLive(match.status)
                          ? "LIVE NOW"
                          : "NEXT MATCH"}
                      </span>

                      <b>{formatDate(match.match_date)}</b>
                    </div>

                    <div className="opponents">
                      <span>{match.home_team}</span>

                      <strong>
                        {isLive(match.status)
                          ? `${match.score_home} : ${match.score_away}`
                          : formatTime(match.match_date)}
                      </strong>

                      <span>{match.away_team}</span>
                    </div>

                    <small>
                      {match.league_name || "Football"}
                    </small>
                  </div>
                ) : (
                  <div className="no-match">
                    <span>⚽</span>
                    <p>No upcoming match found</p>
                  </div>
                )}
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-favorites">
            <div>★</div>

            <h3>Build your football list</h3>

            <p>
              Choose your favorite teams below to personalize GoalZone.
            </p>
          </div>
        )}

        {/* CHOOSE TEAMS */}
        <div className="choose-heading">
          <div>
            <span>PERSONALIZE GOALZONE</span>

            <h2>
              Choose your <b>Teams</b>
            </h2>
          </div>

          <strong>{TEAMS.length} TEAMS</strong>
        </div>

        {/* SEARCH */}
        <div className="team-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search teams..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
            >
              ×
            </button>
          )}
        </div>

        {/* TEAM GRID */}
        <div className="choose-grid">
          {filteredTeams.map((team) => {
            const active = favorites.includes(team.id);

            return (
              <button
                className={
                  active
                    ? "choose-card active"
                    : "choose-card"
                }
                key={team.id}
                onClick={() => toggleFavorite(team.id)}
              >
                <img
                  src={team.logo}
                  alt={team.name}
                />

                <span>
                  <strong>{team.name}</strong>
                  <small>{team.country}</small>
                </span>

                <b>{active ? "✓" : "+"}</b>
              </button>
            );
          })}
        </div>

        {filteredTeams.length === 0 && (
          <div className="empty-favorites search-empty">
            <div>⌕</div>
            <h3>No teams found</h3>
            <p>Try another team name.</p>
          </div>
        )}
      </section>
    </main>
  );
}