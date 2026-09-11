import { useEffect, useState } from "react";
import "./Transfers.css";

type Transfer = {
  id: number;
  player_name: string;
  player_photo?: string;
  from_team?: string;
  from_logo?: string;
  to_team?: string;
  to_logo?: string;
  transfer_fee?: string;
  position?: string;
  transfer_date?: string;
};

const API_URL = "http://127.0.0.1:5000/api/transfers";
const PER_PAGE = 6;

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");

  async function loadTransfers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to load transfers");
      }

      const data = await response.json();

      console.log("Transfers:", data);

      setTransfers(data.transfers || []);
      setPage(1);
    } catch (err) {
      console.error("Transfers error:", err);
      setError("Unable to load transfers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTransfers();
  }, []);

  const totalPages = Math.ceil(
    transfers.length / PER_PAGE
  );

  const startIndex =
    (page - 1) * PER_PAGE;

  const visibleTransfers =
    transfers.slice(
      startIndex,
      startIndex + PER_PAGE
    );

  function formatDate(date?: string) {
    if (!date) return "N/A";

    const value = new Date(date);

    if (isNaN(value.getTime())) {
      return date;
    }

    return value.toLocaleDateString("en-GB");
  }

  function handleImageError(
    e: React.SyntheticEvent<HTMLImageElement>
  ) {
    e.currentTarget.style.display = "none";
  }

  return (
    <div className="transfers-page">

      {/* ================= HERO ================= */}

      <section className="transfers-hero">

        <div className="transfers-overlay" />

        <div className="transfers-hero-content">

          <span>
            FOOTBALL • TRANSFERS • 24/7
          </span>

          <h1>
            THE LATEST
            <br />
            <b>TRANSFERS.</b>
          </h1>

          <p>
            Follow the latest player moves,
            club changes and transfer activity
            from the world of football.
          </p>

        </div>

      </section>

      {/* ================= CONTENT ================= */}

      <section className="transfers-section">

        <div className="section-heading">

          <span>
            TRANSFER CENTER
          </span>

          <h2>
            Latest <b>Transfers</b>
          </h2>

        </div>

        {/* ================= CONTROLS ================= */}

        <div className="transfer-controls">

          <button
            className="transfer-btn primary"
            onClick={loadTransfers}
          >
            <span>↻</span>
            REFRESH
          </button>

          <button
            className="transfer-btn secondary"
            onClick={() => setPage(1)}
          >
            <span>⌂</span>
            FIRST PAGE
          </button>

        </div>

        {/* ================= LOADING ================= */}

        {loading && (
          <div className="transfer-state">

            <div className="spinner" />

            <h3>
              Loading transfers...
            </h3>

            <p>
              Getting the latest football moves.
            </p>

          </div>
        )}

        {/* ================= ERROR ================= */}

        {!loading && error && (
          <div className="transfer-state">

            <span>⚠️</span>

            <h3>
              Something went wrong
            </h3>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!loading &&
          !error &&
          transfers.length === 0 && (

            <div className="transfer-state">

              <span>⚽</span>

              <h3>
                No transfers found
              </h3>

              <p>
                Transfer data is not available right now.
              </p>

            </div>
          )}

        {/* ================= CARDS ================= */}

        {!loading &&
          !error &&
          visibleTransfers.length > 0 && (

            <div className="transfers-grid">

              {visibleTransfers.map(
                (transfer) => (

                  <article
                    className="transfer-card"
                    key={transfer.id}
                  >

                    {/* TOP */}

                    <div className="transfer-top">

                      <span>
                        {formatDate(
                          transfer.transfer_date
                        )}
                      </span>

                      <b>
                        TRANSFER
                      </b>

                    </div>

                    {/* PLAYER */}

                    <div className="player">

                      <div className="player-photo">

                        {transfer.player_photo ? (

                          <img
                            src={transfer.player_photo}
                            alt={transfer.player_name}
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                          />

                        ) : (

                          <span>
                            ⚽
                          </span>

                        )}

                      </div>

                      <h3>
                        {transfer.player_name}
                      </h3>

                      {transfer.position && (
                        <small>
                          {transfer.position}
                        </small>
                      )}

                    </div>

                    {/* CLUBS */}

                    <div className="clubs">

                      {/* FROM */}

                      <div className="club">

                        <div className="club-logo">

                          {transfer.from_logo ? (

                            <img
                              src={transfer.from_logo}
                              alt={
                                transfer.from_team ||
                                "Previous club"
                              }
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={handleImageError}
                            />

                          ) : (

                            <span>
                              ⚽
                            </span>

                          )}

                        </div>

                        <strong>
                          {transfer.from_team ||
                            "Unknown"}
                        </strong>

                      </div>

                      {/* ARROW */}

                      <div className="transfer-arrow">
                        →
                      </div>

                      {/* TO */}

                      <div className="club">

                        <div className="club-logo">

                          {transfer.to_logo ? (

                            <img
                              src={transfer.to_logo}
                              alt={
                                transfer.to_team ||
                                "New club"
                              }
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={handleImageError}
                            />

                          ) : (

                            <span>
                              ⚽
                            </span>

                          )}

                        </div>

                        <strong>
                          {transfer.to_team ||
                            "Unknown"}
                        </strong>

                      </div>

                    </div>

                    {/* BOTTOM */}

                    <div className="transfer-bottom">

                      <span>
                        TRANSFER TYPE
                      </span>

                      <strong>
                        {transfer.transfer_fee ||
                          "N/A"}
                      </strong>

                    </div>

                  </article>

                )
              )}

            </div>
          )}

        {/* ================= PAGINATION ================= */}

        {!loading &&
          !error &&
          transfers.length > PER_PAGE && (

            <>

              <div className="transfers-pagination">

                <button
                  className="page-arrow"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((p) => p - 1)
                  }
                >
                  ←
                </button>

                {Array.from(
                  {
                    length: totalPages
                  },
                  (_, index) => index + 1
                ).map((number) => (

                  <button
                    key={number}
                    className={`page-number ${
                      page === number
                        ? "active"
                        : ""
                    }`}
                    onClick={() =>
                      setPage(number)
                    }
                  >
                    {number}
                  </button>

                ))}

                <button
                  className="page-arrow"
                  disabled={
                    page === totalPages
                  }
                  onClick={() =>
                    setPage((p) => p + 1)
                  }
                >
                  →
                </button>

              </div>

              <div className="transfer-page-info">

                PAGE {page} OF {totalPages}
                {" • "}
                {transfers.length} TRANSFERS

              </div>

            </>
          )}

      </section>

    </div>
  );
}