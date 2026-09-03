
import { useEffect, useMemo, useState } from "react";
import { getTransfers, type Transfer } from "../api/newApi";
import "./Transfers.css";

function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const loadTransfers = async () => {
    try {
      setLoading(true);
      setError("");
      setTransfers(await getTransfers());
    } catch {
      setError("تعذر تحميل الانتقالات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransfers();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return transfers.filter((t) => {
      const text = `${t.player} ${t.from} ${t.to}`.toLowerCase();
      const matchesSearch = !q || text.includes(q);

      if (filter === "incoming")
        return matchesSearch && t.to !== "Unknown";

      if (filter === "outgoing")
        return matchesSearch && t.from !== "Unknown";

      return matchesSearch;
    });
  }, [transfers, search, filter]);

  return (
    <main className="transfers-page">

      {/* HERO */}
      <section className="transfers-hero">
        <div className="transfers-hero-bg" />

        <div className="transfers-hero-content">
          <span className="transfers-label">
            GOALZONE TRANSFER CENTER
          </span>

          <h1>
            TRANSFER
            <strong>WINDOW</strong>
          </h1>

          <p>
            أحدث أخبار وانتقالات اللاعبين من عالم كرة القدم.
          </p>

          <div className="transfers-hero-stats">
            <div>
              <b>LIVE</b>
              <span>UPDATES</span>
            </div>
            <div>
              <b>WORLD</b>
              <span>TRANSFERS</span>
            </div>
            <div>
              <b>24/7</b>
              <span>FOOTBALL</span>
            </div>
          </div>
        </div>

        <div className="transfers-ball">⚽</div>
      </section>

      {/* CONTENT */}
      <section className="transfers-content">

        <div className="transfers-heading">
          <div>
            <span>LATEST MOVES</span>
            <h2>آخر الانتقالات</h2>
          </div>

          <strong>{filtered.length} انتقال</strong>
        </div>

        <div className="transfers-tools">
          <input
            type="text"
            placeholder="ابحث عن لاعب أو نادي..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="transfer-filters">
            <button
              className={filter === "all" ? "active" : ""}
              onClick={() => setFilter("all")}
            >
              الكل
            </button>

            <button
              className={filter === "incoming" ? "active" : ""}
              onClick={() => setFilter("incoming")}
            >
              انتقالات
            </button>

            <button
              className={filter === "outgoing" ? "active" : ""}
              onClick={() => setFilter("outgoing")}
            >
              مغادرة
            </button>
          </div>
        </div>

        {loading && (
          <div className="transfers-state">
            <div className="transfer-loader" />
            <p>جاري تحميل الانتقالات...</p>
          </div>
        )}

        {!loading && error && (
          <div className="transfers-state">
            <div className="empty-transfer">!</div>
            <h3>{error}</h3>
            <button onClick={loadTransfers}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="transfers-state">
            <div className="empty-transfer">↔</div>
            <h3>لا توجد انتقالات</h3>
            <p>جرب البحث باسم لاعب أو نادي آخر.</p>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="transfers-grid">
            {filtered.map((transfer) => (
              <article className="transfer-card" key={transfer.id}>

                <div className="transfer-card-top">
                  <span>TRANSFER</span>
                  <small>{transfer.date}</small>
                </div>

                <h3>{transfer.player}</h3>

                <div className="transfer-route">
                  <div className="club">
                    <small>FROM</small>
                    <b>{transfer.from || "Unknown"}</b>
                  </div>

                  <div className="transfer-arrow">→</div>

                  <div className="club">
                    <small>TO</small>
                    <b>{transfer.to || "Unknown"}</b>
                  </div>
                </div>

                <div className="transfer-line" />
                <span className="transfer-type">
                  OFFICIAL TRANSFER
                </span>

              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Transfers;
