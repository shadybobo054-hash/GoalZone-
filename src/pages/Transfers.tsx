import { useEffect, useMemo, useState } from "react";
import { getTransfers, LEAGUES, type Transfer } from "../api/footballApi";
import "./Transfers.css";

const leagues = [
  ["all", "ALL LEAGUES"],
  [LEAGUES.premierLeague, "PREMIER LEAGUE"],
  [LEAGUES.laLiga, "LA LIGA"],
  [LEAGUES.bundesliga, "BUNDESLIGA"],
  [LEAGUES.serieA, "SERIE A"],
  [LEAGUES.ligue1, "LIGUE 1"],
] as const;

const STEP = 6;

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [league, setLeague] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(STEP);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setVisible(STEP);

      const selected =
        league === "all"
          ? leagues.slice(1).map(x => x[0])
          : [league];

      const data = await Promise.all(
        selected.map(x => getTransfers(x).catch(() => []))
      );

      setTransfers([
        ...new Map(
          data.flat().map(x => [x.id, x])
        ).values(),
      ]);

      setLoading(false);
    };

    load();
  }, [league]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return transfers;

    return transfers.filter(x =>
      `${x.player} ${x.from} ${x.to} ${x.type}`
        .toLowerCase()
        .includes(q)
    );
  }, [transfers, search]);

  useEffect(() => {
    setVisible(STEP);
  }, [search]);

  const shown = filtered.slice(0, visible);
  const hasMore = visible < filtered.length;
  const expanded = visible > STEP;

  return (
    <main className="transfers-page">

      <section className="transfers-hero">
        <div className="transfer-grid" />
        <div className="transfer-glow glow-one" />
        <div className="transfer-glow glow-two" />

        <div className="transfers-container hero-inner">

          <div className="hero-copy">
            <div className="eyebrow">
              <i />
              GOALZONE · TRANSFER CENTER
            </div>

            <h1>
              TRANSFER
              <strong>MARKET.</strong>
            </h1>

            <p>
              Track the latest football moves,
              signings and club changes from
              the biggest leagues.
            </p>

            <div className="hero-stats">
              <div>
                <strong>{filtered.length}</strong>
                <span>TRANSFERS</span>
              </div>

              <div>
                <strong>05</strong>
                <span>LEAGUES</span>
              </div>

              <div>
                <strong>LIVE</strong>
                <span>UPDATES</span>
              </div>
            </div>
          </div>

          <div className="transfer-board">
            <div className="board-top">
              <span>TRANSFER MARKET</span>
              <b>LIVE</b>
            </div>

            <div className="market-player">
              <div className="mini-avatar">P</div>
              <div>
                <small>PLAYER</small>
                <strong>TRANSFER</strong>
              </div>
            </div>

            <div className="market-move">
              <div />
              <strong>→</strong>
              <div />
            </div>

            <div className="market-clubs">
              <span>OLD CLUB</span>
              <b>NEW CLUB</b>
            </div>

            <div className="board-bottom">
              <span>LATEST MOVES</span>
              <strong>GOALZONE</strong>
            </div>
          </div>

        </div>
      </section>

      <section className="transfers-container transfers-section">

        <div className="section-head">
          <div>
            <span>TRANSFER MARKET</span>
            <h2>
              Latest <strong>Moves</strong>
            </h2>
          </div>

          <div className="transfer-count">
            <strong>{filtered.length}</strong>
            <span>MOVES</span>
          </div>
        </div>

        <div className="transfer-tools">

          <div className="league-tabs">
            {leagues.map(([id, name]) => (
              <button
                key={id}
                className={league === id ? "active" : ""}
                onClick={() => setLeague(id)}
              >
                {name}
              </button>
            ))}
          </div>

          <input
            type="search"
            placeholder="Search player or club..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

        </div>

        {loading ? (
          <div className="transfer-state">
            <div className="loader" />
            <h3>LOADING TRANSFERS...</h3>
            <p>Connecting to transfer market.</p>
          </div>
        ) : !filtered.length ? (
          <div className="transfer-state">
            <div className="empty-icon">↔</div>
            <h3>NO TRANSFERS FOUND</h3>
            <p>There are no transfer updates available.</p>
          </div>
        ) : (
          <>
            <div className="transfer-list">

              {shown.map(t => (
                <article className="transfer-card" key={t.id}>

                  <div className="player">
                    {t.playerImage ? (
                      <img src={t.playerImage} alt={t.player} />
                    ) : (
                      <div className="player-avatar">
                        {t.player[0]}
                      </div>
                    )}

                    <div className="player-info">
                      <strong>{t.player}</strong>
                      <span>{t.type}</span>
                    </div>
                  </div>

                  <div className="club">
                    <div className="club-logo">
                      {t.fromLogo ? (
                        <img src={t.fromLogo} alt="" />
                      ) : "⚽"}
                    </div>

                    <div>
                      <small>FROM</small>
                      <strong>{t.from}</strong>
                    </div>
                  </div>

                  <div className="move-arrow">→</div>

                  <div className="club">
                    <div className="club-logo">
                      {t.toLogo ? (
                        <img src={t.toLogo} alt="" />
                      ) : "⚽"}
                    </div>

                    <div>
                      <small>TO</small>
                      <strong>{t.to}</strong>
                    </div>
                  </div>

                  <div className="transfer-fee">
                    <small>TRANSFER FEE</small>
                    <strong>{t.fee}</strong>
                  </div>

                </article>
              ))}

            </div>

            {filtered.length > STEP && (
              <div className="transfers-more">

                {hasMore && (
                  <button onClick={() => setVisible(v => v + STEP)}>
                    SHOW MORE ↓
                  </button>
                )}

                {!hasMore && expanded && (
                  <button onClick={() => setVisible(STEP)}>
                    SEE LESS ↑
                  </button>
                )}

                {expanded && (
                  <button
                    className="start-btn"
                    onClick={() => {
                      setVisible(STEP);
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth",
                      });
                    }}
                  >
                    BACK TO START ↺
                  </button>
                )}

                <small>
                  SHOWING {shown.length} OF {filtered.length} MOVES
                </small>

              </div>
            )}
          </>
        )}

      </section>
    </main>
  );
}