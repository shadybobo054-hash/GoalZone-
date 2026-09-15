import { useEffect, useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

type SearchResult = {
  matches: any[];
  transfers: any[];
  news: any[];
  leagues: any[];
};

const emptyResults: SearchResult = {
  matches: [],
  transfers: [],
  news: [],
  leagues: [],
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] =
    useState<SearchResult>(emptyResults);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const q = search.trim();

    if (!q) {
      setResults(emptyResults);
      setShowResults(false);
      return;
    }

    const controller = new AbortController();

    fetch(
      `http://127.0.0.1:5174/api/search?q=${encodeURIComponent(q)}`,
      {
        signal: controller.signal,
      }
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error("Search failed");
        }

        return res.json();
      })
      .then((data) => {
        setResults(
          data?.results || emptyResults
        );

        setShowResults(true);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Search error:", error);
        }
      });

    return () => controller.abort();
  }, [search]);

  const closeMenu = () => {
    setOpen(false);
  };

  const goTo = (path: string) => {
    setSearch("");
    setShowResults(false);
    closeMenu();
    navigate(path);
  };

  const hasResults =
    results.matches.length > 0 ||
    results.transfers.length > 0 ||
    results.news.length > 0 ||
    results.leagues.length > 0;

  return (
    <header className="navbar">
      <div className="nav-inner">

        <Link
          to="/"
          className="brand"
          onClick={closeMenu}
        >
          <span className="brand-ball">⚽</span>

          <span>
            <strong>GOAL</strong>
            <b>ZONE</b>
          </span>
        </Link>

        <nav
          className={
            open
              ? "nav-links open"
              : "nav-links"
          }
        >
          <NavLink
            to="/"
            end
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/matches"
            onClick={closeMenu}
          >
            Matches
          </NavLink>

          <NavLink
            to="/live"
            className="live-link"
            onClick={closeMenu}
          >
            <i />
            Live
          </NavLink>

          <NavLink
            to="/transfers"
            onClick={closeMenu}
          >
            Transfers
          </NavLink>

          <NavLink
            to="/news"
            onClick={closeMenu}
          >
            News
          </NavLink>

          <NavLink
            to="/leagues"
            onClick={closeMenu}
          >
            Top Leagues
          </NavLink>

          <NavLink
            to="/favorites"
            onClick={closeMenu}
          >
            Favorites
          </NavLink>
        </nav>

        <div className="nav-actions">

          {/* SEARCH */}

          <div className="nav-search">

            <span className="search-icon">
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search football..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onFocus={() => {
                if (search.trim()) {
                  setShowResults(true);
                }
              }}
            />

            {search && (
              <button
                type="button"
                className="search-clear"
                onClick={() => {
                  setSearch("");
                  setShowResults(false);
                }}
              >
                ×
              </button>
            )}

            {showResults && (
              <div className="search-results">

                {!hasResults && (
                  <div className="search-empty">
                    No football content found
                  </div>
                )}

                {/* MATCHES */}

                {results.matches.length > 0 && (
                  <div className="search-group">

                    <h4>⚽ MATCHES</h4>

                    {results.matches.map(
                      (match) => (
                        <button
                          type="button"
                          key={`match-${match.id}`}
                          onClick={() =>
                            goTo("/matches")
                          }
                        >
                          <span>
                            {match.home_team}{" "}
                            vs{" "}
                            {match.away_team}
                          </span>

                          <small>
                            {match.league_name}
                            {" • "}
                            {match.score_home}-
                            {match.score_away}
                          </small>
                        </button>
                      )
                    )}

                  </div>
                )}

                {/* TRANSFERS */}

                {results.transfers.length > 0 && (
                  <div className="search-group">

                    <h4>🔄 TRANSFERS</h4>

                    {results.transfers.map(
                      (transfer) => (
                        <button
                          type="button"
                          key={`transfer-${transfer.id}`}
                          onClick={() =>
                            goTo("/transfers")
                          }
                        >
                          <span>
                            {transfer.player_name}
                          </span>

                          <small>
                            {transfer.from_team ||
                              "Free"}
                            {" → "}
                            {transfer.to_team ||
                              "Free"}
                          </small>
                        </button>
                      )
                    )}

                  </div>
                )}

                {/* NEWS */}

                {results.news.length > 0 && (
                  <div className="search-group">

                    <h4>📰 NEWS</h4>

                    {results.news.map(
                      (news) => (
                        <button
                          type="button"
                          key={`news-${news.id}`}
                          onClick={() =>
                            goTo("/news")
                          }
                        >
                          <span>
                            {news.title}
                          </span>

                          <small>
                            Football News
                          </small>
                        </button>
                      )
                    )}

                  </div>
                )}

                {/* LEAGUES */}

                {results.leagues.length > 0 && (
                  <div className="search-group">

                    <h4>🏆 LEAGUES</h4>

                    {results.leagues.map(
                      (league) => (
                        <button
                          type="button"
                          key={`league-${league.id}`}
                          onClick={() =>
                            goTo("/leagues")
                          }
                        >
                          <span>
                            {league.name}
                          </span>

                          <small>
                            {league.country}
                          </small>
                        </button>
                      )
                    )}

                  </div>
                )}

              </div>
            )}

          </div>

          <Link
            to="/live"
            className="live-button"
          >
            <span />
            LIVE
          </Link>

          <button
            className="menu-button"
            type="button"
            onClick={() =>
              setOpen(!open)
            }
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>

        </div>

      </div>
    </header>
  );
}