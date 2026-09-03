
import { useEffect, useState } from "react";
import {
  getLiveMatches,
  type ApiEvent,
} from "../api/footballApi";
import "./Live.css";

type LiveProps = {
  onDetails: (match: ApiEvent) => void;
};

function Live({ onDetails }: LiveProps) {
  const [matches, setMatches] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadLive = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLiveMatches();
      setMatches(data);
    } catch (err) {
      console.error("Live Error:", err);
      setError("فشل تحميل المباريات المباشرة.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLive();

    const interval = setInterval(loadLive, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="live-page">
      <section className="live-hero">
        <div className="live-hero-content">
          <span className="live-label">
            <i></i>
            LIVE CENTER
          </span>

          <h1>
            LIVE
            <strong>MATCHES</strong>
          </h1>

          <p>
            تابع المباريات الجارية حاليًا لحظة بلحظة.
          </p>

          <div className="live-stats">
            <div className="live-stat">
              <span className="stat-icon live-icon">●</span>

              <div>
                <strong>LIVE</strong>
                <small>NOW PLAYING</small>
              </div>
            </div>

            <div className="live-stat">
              <span className="stat-icon">↻</span>

              <div>
                <strong>30s</strong>
                <small>AUTO UPDATE</small>
              </div>
            </div>

            <div className="live-stat">
              <span className="stat-icon">⚽</span>

              <div>
                <strong>24/7</strong>
                <small>FOOTBALL CENTER</small>
              </div>
            </div>
          </div>
        </div>

        <div className="transfers-ball">⚽</div>
      </section>

      <section className="live-content">
        <div className="live-heading">
          <div>
            <span>LIVE FOOTBALL</span>

            <h2>
              المباريات <strong>المباشرة</strong>
            </h2>
          </div>

          <div className="live-count">
            <i></i>
            {matches.length} MATCHES
          </div>
        </div>

        {loading && (
          <div className="live-state">
            <div className="live-loader"></div>

            <h3>جاري تحميل المباريات</h3>

            <p>
              نبحث عن المباريات المباشرة الآن...
            </p>
          </div>
        )}

        {!loading && error && (
          <div className="live-state">
            <div className="state-icon">⚠</div>

            <h3>حدث خطأ</h3>

            <p>{error}</p>

            <button onClick={loadLive}>
              إعادة المحاولة
            </button>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="live-state">
            <div className="state-icon">⚽</div>

            <h3>لا توجد مباريات مباشرة الآن</h3>

            <p>
              سيتم تحديث المباريات تلقائيًا كل 30 ثانية.
            </p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="live-grid">
            {matches.map((match) => {
              const competition = match.competitions?.[0];
              const teams = competition?.competitors ?? [];

              const home = teams.find(
                (team) => team.homeAway === "home"
              );

              const away = teams.find(
                (team) => team.homeAway === "away"
              );

              return (
                <article
                  className="live-card"
                  key={match.id}
                >
                  <div className="live-card-top">
                    <span className="live-now">
                      <i></i>
                      LIVE NOW
                    </span>

                    <small>
                      {competition?.status?.type
                        ?.shortDetail || "LIVE"}
                    </small>
                  </div>

                  <div className="live-teams">
                    <div className="live-team">
                      <div className="team-logo">
                        {home?.team.logo ? (
                          <img
                            src={home.team.logo}
                            alt={home.team.displayName}
                          />
                        ) : (
                          "⚽"
                        )}
                      </div>

                      <strong>
                        {home?.team.displayName ||
                          "Home Team"}
                      </strong>

                      <span>HOME</span>
                    </div>

                    <div className="live-score">
                      <b>{home?.score ?? "0"}</b>

                      <em>:</em>

                      <b>{away?.score ?? "0"}</b>

                      <span>LIVE</span>
                    </div>

                    <div className="live-team">
                      <div className="team-logo">
                        {away?.team.logo ? (
                          <img
                            src={away.team.logo}
                            alt={away.team.displayName}
                          />
                        ) : (
                          "⚽"
                        )}
                      </div>

                      <strong>
                        {away?.team.displayName ||
                          "Away Team"}
                      </strong>

                      <span>AWAY</span>
                    </div>
                  </div>

                  <div className="live-card-footer">
                    {match.name ||
                      "Live Football Match"}
                  </div>

                  <button
                    type="button"
                    className="live-details-btn"
                    onClick={() => onDetails(match)}
                  >
                    <span>تفاصيل المباراة</span>
                    <b>→</b>
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default Live;
