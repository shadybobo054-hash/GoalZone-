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
  league_name?: string;
};

const DEMO_TRANSFERS: Transfer[] = [
  {
    id: 1,
    player_name: "Marcus Vale",
    player_photo: "https://i.pravatar.cc/500?img=12",
    from_team: "Arsenal",
    from_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/359.png",
    to_team: "Barcelona",
    to_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/83.png",
    transfer_fee: "€85M",
    position: "Winger",
    transfer_date: "2026-07-12",
    league_name: "Premier League",
  },
  {
    id: 2,
    player_name: "Daniel Cruz",
    player_photo: "https://i.pravatar.cc/500?img=13",
    from_team: "Chelsea",
    from_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/363.png",
    to_team: "Real Madrid",
    to_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/86.png",
    transfer_fee: "€110M",
    position: "Forward",
    transfer_date: "2026-07-18",
    league_name: "Premier League",
  },
  {
    id: 3,
    player_name: "Leo Martins",
    player_photo: "https://i.pravatar.cc/500?img=14",
    from_team: "Inter",
    from_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/110.png",
    to_team: "Manchester City",
    to_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/382.png",
    transfer_fee: "€72M",
    position: "Midfielder",
    transfer_date: "2026-07-21",
    league_name: "Serie A",
  },
  {
    id: 4,
    player_name: "Noah Silva",
    player_photo: "https://i.pravatar.cc/500?img=15",
    from_team: "Benfica",
    from_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/1929.png",
    to_team: "Liverpool",
    to_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/364.png",
    transfer_fee: "€64M",
    position: "Defender",
    transfer_date: "2026-07-25",
    league_name: "Primeira Liga",
  },
  {
    id: 5,
    player_name: "Adam Rossi",
    player_photo: "https://i.pravatar.cc/500?img=16",
    from_team: "AC Milan",
    from_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/103.png",
    to_team: "Bayern Munich",
    to_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/132.png",
    transfer_fee: "€58M",
    position: "Midfielder",
    transfer_date: "2026-07-29",
    league_name: "Serie A",
  },
  {
    id: 6,
    player_name: "Lucas Stone",
    player_photo: "https://i.pravatar.cc/500?img=17",
    from_team: "PSG",
    from_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/160.png",
    to_team: "Manchester United",
    to_logo: "https://a.espncdn.com/i/teamlogos/soccer/500/360.png",
    transfer_fee: "€91M",
    position: "Forward",
    transfer_date: "2026-08-02",
    league_name: "Ligue 1",
  },
];

export default function Transfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/transfers")
      .then((res) => {
        if (!res.ok) throw new Error("API error");
        return res.json();
      })
      .then((data) => {
        setTransfers(
          Array.isArray(data) && data.length ? data : DEMO_TRANSFERS,
        );
      })
      .catch(() => {
        setTransfers(DEMO_TRANSFERS);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="transfers-page">
      <section className="transfers-hero">
        <div className="transfers-overlay" />

        <div className="transfers-hero-content">
          <span>GOALZONE TRANSFER CENTER</span>

          <h1>
            FOOTBALL <b>TRANSFERS</b>
          </h1>

          <p>Latest moves, new clubs and transfer news.</p>
        </div>
      </section>

      <section className="transfers-section">
        <div className="section-heading">
          <span>TRANSFER CENTER</span>

          <h2>
            Latest <b>Transfers</b>
          </h2>
        </div>

        {loading ? (
          <div className="transfer-state">
            <div className="spinner" />
            Loading transfers...
          </div>
        ) : (
          <div className="transfers-grid">
            {transfers.map((transfer) => (
              <article className="transfer-card" key={transfer.id}>
                <div className="transfer-top">
                  <span>{transfer.league_name || "FOOTBALL"}</span>

                  <b>DEMO</b>
                </div>

                <div className="player">
                  <div className="player-photo">
                    {transfer.player_photo ? (
                      <img
                        src={transfer.player_photo}
                        alt={transfer.player_name}
                      />
                    ) : (
                      <span>⚽</span>
                    )}
                  </div>

                  <h3>{transfer.player_name}</h3>

                  <small>{transfer.position || "Player"}</small>
                </div>

                <div className="clubs">
                  <div className="club">
                    <div className="club-logo">
                      {transfer.from_logo ? (
                        <img
                          src={transfer.from_logo}
                          alt={transfer.from_team}
                        />
                      ) : (
                        "⚽"
                      )}
                    </div>

                    <strong>{transfer.from_team || "Unknown"}</strong>
                  </div>

                  <div className="transfer-arrow">→</div>

                  <div className="club">
                    <div className="club-logo">
                      {transfer.to_logo ? (
                        <img src={transfer.to_logo} alt={transfer.to_team} />
                      ) : (
                        "⚽"
                      )}
                    </div>

                    <strong>{transfer.to_team || "Unknown"}</strong>
                  </div>
                </div>

                <div className="transfer-bottom">
                  <span>
                    {transfer.transfer_date
                      ? new Date(transfer.transfer_date).toLocaleDateString()
                      : "Recently"}
                  </span>

                  <strong>{transfer.transfer_fee || "Undisclosed"}</strong>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
