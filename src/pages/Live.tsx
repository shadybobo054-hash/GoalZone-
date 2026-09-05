
import { useEffect, useState } from "react";
import {
  getMatches,
  LEAGUES,
  type ApiEvent,
} from "../api/footballApi";
import "./Live.css";

const leagues = Object.values(LEAGUES);

type TeamCompetitor = {
  homeAway?: "home" | "away";
  score?: string | number;
  team?: {
    displayName?: string;
    logo?: string;
  };
};

const getTeam = (
  match: ApiEvent,
  side: "home" | "away"
): TeamCompetitor | undefined => {
  const competitors =
    (match.competitions?.[0]?.competitors ||
      []) as TeamCompetitor[];

  return competitors.find(
    (team: TeamCompetitor) =>
      team.homeAway === side
  );
};

const isLive = (match: ApiEvent) =>
  match.competitions?.[0]?.status?.type?.state === "in";

const getMatchTime = (match: ApiEvent) => {
  const type =
    match.competitions?.[0]?.status?.type;

  return (
    type?.shortDetail ||
    type?.detail ||
    "LIVE"
  );
};

export default function Live() {
  const [matches, setMatches] =
    useState<ApiEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadLiveMatches = async () => {
      setLoading(true);

      try {
        const results = await Promise.all(
          leagues.map((league) =>
            getMatches(league).catch(() => [])
          )
        );

        const liveMatches = results
          .flat()
          .filter((match: ApiEvent) =>
            isLive(match)
          );

        const unique = [
          ...new Map(
            liveMatches.map(
              (match: ApiEvent) => [
                match.id,
                match,
              ]
            )
          ).values(),
        ];

        setMatches(unique);
      } finally {
        setLoading(false);
      }
    };

    loadLiveMatches();
  }, []);

  const featured = matches[0];

  const home = featured
    ? getTeam(featured, "home")
    : undefined;

  const away = featured
    ? getTeam(featured, "away")
    : undefined;

  return (
    <main className="live-page">

      {/* HERO */}
      <section className="live-hero">

        <div className="hero-grid" />

        <div className="hero-glow glow-one" />
        <div className="hero-glow glow-two" />

        <div className="live-container live-hero-inner">

          <div className="live-copy">

            <div className="live-eyebrow">
              <i />
              GOALZONE · LIVE CENTER
            </div>

            <h1>
              THE ACTION
              <strong>IS LIVE.</strong>
            </h1>

            <p>
              Follow live football scores, match events
              and every important moment as it happens.
            </p>

            <div className="hero-meta">

              <span>
                <i />
                ON AIR
              </span>

              <b>LIVE SCORES</b>
              <b>MATCH EVENTS</b>

            </div>

          </div>

          {/* LIVE BOARD */}
          <div className="live-board">

            <div className="board-top">

              <span>
                LIVE BROADCAST
              </span>

              <b>
                <i />
                ON AIR
              </b>

            </div>

            <div className="board-league">

              <span>
                {featured?.league?.name ||
                  "GOALZONE LIVE"}
              </span>

              <strong>
                {featured
                  ? getMatchTime(featured)
                  : "LIVE"}
              </strong>

            </div>

            <div className="board-score">

              {/* HOME */}
              <div className="board-team">

                {home?.team?.logo ? (
                  <img
                    src={home.team.logo}
                    alt={
                      home.team.displayName ||
                      "Home"
                    }
                  />
                ) : (
                  <div className="fallback">
                    H
                  </div>
                )}

                <span>
                  {home?.team?.displayName ||
                    "HOME"}
                </span>

                <strong>
                  {home?.score ?? "0"}
                </strong>

              </div>

              {/* VS */}
              <div className="board-vs">

                <span>
                  LIVE
                </span>

                <strong>
                  VS
                </strong>

              </div>

              {/* AWAY */}
              <div className="board-team">

                {away?.team?.logo ? (
                  <img
                    src={away.team.logo}
                    alt={
                      away.team.displayName ||
                      "Away"
                    }
                  />
                ) : (
                  <div className="fallback">
                    A
                  </div>
                )}

                <span>
                  {away?.team?.displayName ||
                    "AWAY"}
                </span>

                <strong>
                  {away?.score ?? "0"}
                </strong>

              </div>

            </div>

            {/* LIVE WAVE */}
            <div className="wave">

              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
                (item) => (
                  <i key={item} />
                )
              )}

            </div>

            {/* STATS */}
            <div className="board-stats">

              <div>
                <strong>
                  {matches.length}
                </strong>

                <span>
                  LIVE MATCHES
                </span>
              </div>

              <div>
                <strong>
                  24/7
                </strong>

                <span>
                  COVERAGE
                </span>
              </div>

              <div>
                <strong>
                  REAL
                </strong>

                <span>
                  TIME
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* LIVE MATCHES */}
      <section className="live-section live-container">

        <div className="section-head">

          <div>

            <span>
              LIVE FOOTBALL
            </span>

            <h2>
              Matches{" "}
              <strong>
                Live Now
              </strong>
            </h2>

            <p>
              Follow every match as it happens.
            </p>

          </div>

          <div className="live-count">

            <i />

            <strong>
              {matches.length}
            </strong>

            <small>
              LIVE
            </small>

          </div>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="live-state">

            <div className="loader" />

            <h3>
              Scanning live matches...
            </h3>

            <p>
              Connecting to football live data.
            </p>

          </div>

        ) : !matches.length ? (

          /* EMPTY */
          <div className="live-state">

            <strong>
              NO LIVE MATCHES
            </strong>

            <p>
              There are no matches being played right now.
            </p>

          </div>

        ) : (

          /* MATCH CARDS */
          <div className="live-grid">

            {matches.map(
              (match: ApiEvent) => {

                const homeTeam =
                  getTeam(match, "home");

                const awayTeam =
                  getTeam(match, "away");

                return (
                  <article
                    className="live-card"
                    key={match.id}
                  >

                    <div className="card-top">

                      <span>
                        <i />
                        LIVE
                      </span>

                      <small>
                        {match.league?.name ||
                          "Football"}
                      </small>

                    </div>

                    <div className="card-teams">

                      {/* HOME */}
                      <div className="card-team">

                        {homeTeam?.team?.logo ? (
                          <img
                            src={
                              homeTeam.team.logo
                            }
                            alt={
                              homeTeam.team
                                .displayName ||
                              "Home"
                            }
                          />
                        ) : (
                          <div className="fallback">
                            H
                          </div>
                        )}

                        <strong>
                          {homeTeam?.team
                            ?.displayName ||
                            "Home"}
                        </strong>

                        <b>
                          {homeTeam?.score ?? "0"}
                        </b>

                      </div>

                      {/* CENTER */}
                      <div className="card-vs">

                        <span>
                          LIVE
                        </span>

                        <strong>
                          {getMatchTime(match)}
                        </strong>

                      </div>

                      {/* AWAY */}
                      <div className="card-team">

                        {awayTeam?.team?.logo ? (
                          <img
                            src={
                              awayTeam.team.logo
                            }
                            alt={
                              awayTeam.team
                                .displayName ||
                              "Away"
                            }
                          />
                        ) : (
                          <div className="fallback">
                            A
                          </div>
                        )}

                        <strong>
                          {awayTeam?.team
                            ?.displayName ||
                            "Away"}
                        </strong>

                        <b>
                          {awayTeam?.score ?? "0"}
                        </b>

                      </div>

                    </div>

                    <div className="card-footer">

                      <span>
                        LIVE SCORE
                      </span>

                      <button>
                        VIEW MATCH →
                      </button>

                    </div>

                  </article>
                );
              }
            )}

          </div>

        )}

      </section>

    </main>
  );
}

