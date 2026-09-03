
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams, type Team } from "../api/teamsApi";
import "./Favorites.css";

const KEY = "goalzone_favorites";

export default function Favorites() {
  const navigate = useNavigate();

  const [teams, setTeams] = useState<Team[]>([]);
  const [favorites, setFavorites] = useState<string[]>(
    JSON.parse(localStorage.getItem(KEY) || "[]")
  );
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTeams()
      .then(setTeams)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter(x => x !== id)
      : [...favorites, id];

    setFavorites(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  };

  const favoriteTeams = teams.filter(team =>
    favorites.includes(team.id)
  );

  return (
    <main className="favorites-page">

      <section className="favorites-hero">
        <div className="favorites-container">

          <span className="favorites-label">
            GOALZONE • FAVORITES
          </span>

          <h1>
            My <strong>Teams</strong>
          </h1>

          <p>
            Follow your favorite teams, matches and news.
          </p>

          <div className="favorite-counter">
            <strong>{favorites.length}</strong>
            <span>FAVORITES</span>
          </div>

        </div>
      </section>

      <section className="favorites-container teams-section">

        <div className="teams-heading">

          <div>
            <span>YOUR TEAMS</span>
            <h2>Favorite Teams</h2>
          </div>

          <button
            className={`add-team-btn ${showAll ? "active" : ""}`}
            onClick={() => setShowAll(!showAll)}
          >
            <span>{showAll ? "×" : "+"}</span>
            {showAll ? "Close" : "Add Team"}
          </button>

        </div>

        {/* FAVORITE TEAMS */}

        {loading ? (
          <div className="favorites-loading">
            <div />
            <p>Loading teams...</p>
          </div>
        ) : favoriteTeams.length === 0 ? (

          <div className="empty-favorites">

            <div className="empty-icon">☆</div>

            <h3>No favorite teams yet</h3>

            <p>
              Add your favorite team to see it here.
            </p>

            <button
              className="empty-add-btn"
              onClick={() => setShowAll(true)}
            >
              + Add Your First Team
            </button>

          </div>

        ) : (

          <div className="teams-grid">

            {favoriteTeams.map(team => (

              <article
                className="team-card selected"
                key={team.id}
                onClick={() =>
                  navigate(`/team/${team.id}`)
                }
              >

                <button
                  className="favorite-star"
                  onClick={e => {
                    e.stopPropagation();
                    toggleFavorite(team.id);
                  }}
                >
                  ★
                </button>

                <div className="team-logo">

                  {team.logo ? (
                    <img
                      src={team.logo}
                      alt={team.name}
                    />
                  ) : (
                    <span>⚽</span>
                  )}

                </div>

                <h3>{team.name}</h3>

                <span>{team.league}</span>

              </article>

            ))}

          </div>

        )}

        {/* ALL TEAMS */}

        {showAll && (

          <div className="all-teams-panel">

            <div className="all-teams-header">

              <div>
                <span>TEAM SELECTOR</span>
                <h3>Choose a team</h3>
              </div>

              <b>{teams.length} TEAMS</b>

            </div>

            <div className="teams-grid">

              {teams.map(team => {

                const selected =
                  favorites.includes(team.id);

                return (

                  <article
                    className={`team-card ${
                      selected ? "selected" : ""
                    }`}
                    key={team.id}
                  >

                    <button
                      className="favorite-star"
                      onClick={() =>
                        toggleFavorite(team.id)
                      }
                    >
                      {selected ? "★" : "☆"}
                    </button>

                    <div
                      className="team-logo"
                      onClick={() =>
                        navigate(`/team/${team.id}`)
                      }
                    >
                      {team.logo && (
                        <img
                          src={team.logo}
                          alt={team.name}
                        />
                      )}
                    </div>

                    <h3
                      onClick={() =>
                        navigate(`/team/${team.id}`)
                      }
                    >
                      {team.name}
                    </h3>

                    <span>{team.league}</span>

                  </article>

                );
              })}

            </div>

          </div>

        )}

      </section>

    </main>
  );
}

