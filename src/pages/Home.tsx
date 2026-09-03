
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="hero-background">
          <div className="hero-grid"></div>
          <div className="hero-light hero-light-one"></div>
          <div className="hero-light hero-light-two"></div>
        </div>

        <div className="hero-content">
          <div className="hero-label">
            <span className="hero-live-dot"></span>
            THE WORLD OF FOOTBALL
          </div>

          <h1>
            FOOTBALL <br />
            <span>WITHOUT LIMITS</span>
          </h1>

          <p>
            كل ما يخص كرة القدم في مكان واحد. <br />
            مباريات، نتائج، أخبار وانتقالات لحظة بلحظة.
          </p>

          <div className="hero-actions">
            <Link to="/matches" className="hero-primary-btn">
              <span>⚽</span>
              مباريات اليوم
              <b>→</b>
            </Link>

            <Link to="/live" className="hero-live-btn">
              <span className="live-indicator"></span>
              LIVE MATCHES
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <strong>24/7</strong>
              <span>FOOTBALL</span>
            </div>

            <div className="hero-stat-line"></div>

            <div className="hero-stat">
              <strong>LIVE</strong>
              <span>UPDATES</span>
            </div>

            <div className="hero-stat-line"></div>

            <div className="hero-stat">
              <strong>WORLD</strong>
              <span>COVERAGE</span>
            </div>
          </div>
        </div>

        {/* نفس كرة Transfers بالضبط */}
        <div className="transfers-ball">⚽</div>

        <div className="hero-visual">
          <div className="floating-match floating-match-top">
            <div className="floating-live">
              <span></span>
              LIVE
            </div>

            <div className="floating-teams">
              <strong>ARS</strong>
              <b>2 : 1</b>
              <strong>CHE</strong>
            </div>
          </div>

          <div className="floating-match floating-match-bottom">
            <span className="floating-icon">🏆</span>

            <div>
              <strong>PREMIER LEAGUE</strong>
              <small>Match Center</small>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-section">
        <div className="section-heading">
          <div>
            <span>GOALZONE CENTER</span>
            <h2>Everything Football.</h2>
          </div>

          <p>تابع عالم كرة القدم من مكان واحد.</p>
        </div>

        <div className="quick-grid">
          <Link to="/matches" className="quick-card quick-card-featured">
            <div className="quick-card-top">
              <span className="quick-number">01</span>
              <span className="quick-arrow">↗</span>
            </div>

            <div className="quick-icon">⚽</div>

            <h3>Matches</h3>

            <p>
              المباريات القادمة والنتائج وأهم تفاصيل كل مباراة.
            </p>

            <div className="quick-footer">
              <span>EXPLORE MATCHES</span>
              <b>→</b>
            </div>
          </Link>

          <Link to="/live" className="quick-card quick-card-live">
            <div className="quick-card-top">
              <span className="quick-number">02</span>
              <span className="quick-arrow">↗</span>
            </div>

            <div className="quick-icon live-icon">
              <span></span>
            </div>

            <h3>Live</h3>

            <p>
              المباريات المباشرة والنتيجة والأحداث لحظة بلحظة.
            </p>

            <div className="quick-footer">
              <span>WATCH LIVE</span>
              <b>→</b>
            </div>
          </Link>

          <Link to="/transfers" className="quick-card quick-card-transfer">
            <div className="quick-card-top">
              <span className="quick-number">03</span>
              <span className="quick-arrow">↗</span>
            </div>

            <div className="quick-icon">↔</div>

            <h3>Transfers</h3>

            <p>
              أحدث انتقالات اللاعبين وحركة سوق كرة القدم.
            </p>

            <div className="quick-footer">
              <span>TRANSFER CENTER</span>
              <b>→</b>
            </div>
          </Link>

          <Link to="/news" className="quick-card quick-card-news">
            <div className="quick-card-top">
              <span className="quick-number">04</span>
              <span className="quick-arrow">↗</span>
            </div>

            <div className="quick-icon">▤</div>

            <h3>News</h3>

            <p>
              آخر الأخبار والتحديثات من عالم كرة القدم.
            </p>

            <div className="quick-footer">
              <span>READ NEWS</span>
              <b>→</b>
            </div>
          </Link>
        </div>
      </section>

      <section className="home-match-section">
        <div className="match-section-header">
          <div>
            <span>TODAY'S FOOTBALL</span>
            <h2>Match Center</h2>
          </div>

          <Link to="/matches" className="view-all">
            View all <b>→</b>
          </Link>
        </div>

        <div className="featured-match">
          <div className="match-league">
            <span>PREMIER LEAGUE</span>
            <small>Today • 20:00</small>
          </div>

          <div className="match-teams">
            <div className="match-team">
              <div className="team-logo">
                <img
                  src="https://a.espncdn.com/i/teamlogos/soccer/500/359.png"
                  alt="Arsenal"
                />
              </div>

              <strong>Arsenal</strong>
              <small>Home</small>
            </div>

            <div className="match-center">
              <span>VS</span>
              <small>20:00</small>
            </div>

            <div className="match-team">
              <div className="team-logo">
                <img
                  src="https://a.espncdn.com/i/teamlogos/soccer/500/363.png"
                  alt="Chelsea"
                />
              </div>

              <strong>Chelsea</strong>
              <small>Away</small>
            </div>
          </div>

          <Link to="/matches" className="match-details">
            Details <span>→</span>
          </Link>
        </div>
      </section>

      <section className="home-cta">
        <div className="cta-glow"></div>

        <div className="cta-content">
          <span>GOALZONE</span>

          <h2>
            YOUR FOOTBALL. <br />
            <strong>YOUR WORLD.</strong>
          </h2>

          <p>كل لحظة في كرة القدم تستحق أن تتابعها.</p>

          <Link to="/matches" className="cta-button">
            Explore Football <b>→</b>
          </Link>
        </div>

        <div className="cta-ball">⚽</div>
      </section>
    </main>
  );
}

export default Home;

