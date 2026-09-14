import { useEffect, useState } from "react";
import "./Transfers.css";

type Transfer = {
  id: number;
  player_name: string;
  player_photo?: string | null;
  from_team?: string | null;
  from_logo?: string | null;
  to_team?: string | null;
  to_logo?: string | null;
  transfer_fee?: string | null;
  position?: string | null;
  transfer_date?: string | null;
};

const API_URL = "http://127.0.0.1:5174/api/transfers";

const ITEMS_PER_PAGE = 12;

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function loadTransfers() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Server Error ${response.status}`
          );
        }

        const data = await response.json();

        if (
          Array.isArray(data.transfers) &&
          data.transfers.length > 0
        ) {
          setTransfers(data.transfers);
        } else {
          console.warn(
            "⚠️ No transfers returned. Keeping saved data."
          );
        }
      } catch (err) {
        console.error(
          "Transfers error:",
          err
        );

        setError(
          "Unable to refresh transfers. Showing saved data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadTransfers();
  }, []);

  const totalPages = Math.ceil(
    transfers.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const currentTransfers =
    transfers.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

  const changePage = (page: number) => {
    if (
      page < 1 ||
      page > totalPages
    )
      return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="transfers-page">
      <section className="transfers-hero">
        <span>
          GOALZONE • TRANSFER CENTER
        </span>

        <h1>
          FOOTBALL <b>TRANSFERS</b>
        </h1>

        <p>
          Latest football transfers and player moves.
        </p>
      </section>

      <section className="transfers-section">
        <div className="transfers-heading">
          <div>
            <span>
              TRANSFER CENTER
            </span>

            <h2>
              Latest <b>Transfers</b>
            </h2>
          </div>

          <strong>
            {transfers.length} TRANSFERS
          </strong>
        </div>

        {loading && (
          <div className="transfers-state">
            Loading transfers...
          </div>
        )}

        {!loading &&
          error &&
          transfers.length === 0 && (
            <div className="transfers-state">
              ⚠ {error}
            </div>
          )}

        {!loading &&
          !error &&
          transfers.length === 0 && (
            <div className="transfers-state">
              <h3>
                No transfers available
              </h3>
            </div>
          )}

        {!loading &&
          currentTransfers.length > 0 && (
            <>
              {error &&
                transfers.length > 0 && (
                  <div className="transfers-state">
                    ⚠ {error}
                  </div>
                )}

              <div className="transfers-grid">
                {currentTransfers.map(
                  (transfer) => (
                    <article
                      className="transfer-card"
                      key={transfer.id}
                    >
                      <div className="transfer-player">
                        {transfer.player_photo ? (
                          <img
                            src={
                              transfer.player_photo
                            }
                            alt={
                              transfer.player_name
                            }
                          />
                        ) : (
                          <div className="player-placeholder">
                            ⚽
                          </div>
                        )}

                        <div>
                          <h3>
                            {
                              transfer.player_name
                            }
                          </h3>

                          {transfer.position && (
                            <span>
                              {
                                transfer.position
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="transfer-teams">
                        <div className="transfer-team">
                          {transfer.from_logo && (
                            <img
                              src={
                                transfer.from_logo
                              }
                              alt=""
                            />
                          )}

                          <span>
                            {transfer.from_team ||
                              "Free Agent"}
                          </span>
                        </div>

                        <b>→</b>

                        <div className="transfer-team">
                          {transfer.to_logo && (
                            <img
                              src={
                                transfer.to_logo
                              }
                              alt=""
                            />
                          )}

                          <span>
                            {transfer.to_team ||
                              "Unknown"}
                          </span>
                        </div>
                      </div>

                      <div className="transfer-info">
                        <strong>
                          {transfer.transfer_fee ||
                            "Undisclosed"}
                        </strong>

                        {transfer.transfer_date && (
                          <small>
                            {
                              transfer.transfer_date
                            }
                          </small>
                        )}
                      </div>
                    </article>
                  )
                )}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() =>
                      changePage(
                        currentPage - 1
                      )
                    }
                    disabled={
                      currentPage === 1
                    }
                  >
                    ←
                  </button>

                  {Array.from(
                    {
                      length: totalPages,
                    },
                    (_, index) =>
                      index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      className={
                        currentPage === page
                          ? "active"
                          : ""
                      }
                      onClick={() =>
                        changePage(page)
                      }
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      changePage(
                        currentPage + 1
                      )
                    }
                    disabled={
                      currentPage ===
                      totalPages
                    }
                  >
                    →
                  </button>
                </div>
              )}

              <div className="pagination-info">
                Page {currentPage} of{" "}
                {totalPages}
              </div>
            </>
          )}
      </section>
    </main>
  );
}