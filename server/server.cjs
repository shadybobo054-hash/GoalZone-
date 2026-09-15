const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env"),
});

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");
const OpenAI = require("openai");

const app = express();
const PORT = Number(process.env.PORT) || 5174;

app.use(cors());
app.use(express.json());

/* ================= KEYS ================= */

const API_FOOTBALL_KEY =
  process.env.API_FOOTBALL_KEY || "";

const GNEWS_API_KEY =
  process.env.GNEWS_API_KEY || "";

const OPENAI_API_KEY =
  process.env.OPENAI_API_KEY || "";

console.log(
  "🔑 API FOOTBALL KEY:",
  API_FOOTBALL_KEY
    ? `FOUND (${API_FOOTBALL_KEY.length} chars)`
    : "MISSING ❌"
);

console.log(
  "📰 GNEWS KEY:",
  GNEWS_API_KEY
    ? "FOUND ✅"
    : "MISSING ❌"
);

console.log(
  "🤖 OPENAI KEY:",
  OPENAI_API_KEY
    ? "FOUND ✅"
    : "MISSING ❌"
);

/* ================= OPENAI ================= */

const openai = OPENAI_API_KEY
  ? new OpenAI({
      apiKey: OPENAI_API_KEY,
    })
  : null;

/* ================= DATABASE ================= */

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "goalzone",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "goalzone",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

/* ================= LEAGUES ================= */

const LEAGUES = [
  {
    id: "eng.1",
    name: "Premier League",
    country: "England",
  },
  {
    id: "esp.1",
    name: "La Liga",
    country: "Spain",
  },
  {
    id: "ger.1",
    name: "Bundesliga",
    country: "Germany",
  },
  {
    id: "ita.1",
    name: "Serie A",
    country: "Italy",
  },
  {
    id: "fra.1",
    name: "Ligue 1",
    country: "France",
  },
  {
    id: "uefa.champions",
    name: "Champions League",
    country: "Europe",
  },
];

/* ================= HEALTH ================= */

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      server: true,
      mysql: true,
      ai: !!openai,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= MATCHES ================= */

app.get("/api/matches", async (req, res) => {
  try {
    const { league } = req.query;

    let sql = `
      SELECT
        id,
        source_id,
        home_team,
        away_team,
        home_logo,
        away_logo,
        match_date,
        status,
        score_home,
        score_away,
        league_id,
        league_name,
        country,
        league_logo
      FROM matches
    `;

    const params = [];

    if (league) {
      sql += ` WHERE league_id = ? `;
      params.push(league);
    }

    sql += `
      ORDER BY match_date ASC, id ASC
    `;

    const [rows] = await db.query(sql, params);

    res.json({
      success: true,
      matches: rows,
    });
  } catch (error) {
    console.error(
      "❌ MATCHES ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= TRANSFERS TABLE ================= */

async function prepareTransfersTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS transfers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      player VARCHAR(255),
      player_photo TEXT,
      from_team VARCHAR(255),
      from_logo TEXT,
      to_team VARCHAR(255),
      to_logo TEXT,
      fee VARCHAR(100),
      transfer_date DATETIME,
      transfer_key VARCHAR(255) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Transfers table ready");
}

/* ================= TRANSFERS ================= */

app.get("/api/transfers", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        player AS player_name,
        player_photo,
        from_team,
        from_logo,
        to_team,
        to_logo,
        fee AS transfer_fee,
        transfer_date
      FROM transfers
      ORDER BY transfer_date DESC, id DESC
      LIMIT 100
    `);

    res.json({
      success: true,
      transfers: rows,
    });
  } catch (error) {
    console.error(
      "❌ TRANSFERS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= NEWS ================= */

app.get("/api/news", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        description,
        image,
        published_at
      FROM news
      ORDER BY published_at DESC, id DESC
      LIMIT 50
    `);

    res.json({
      success: true,
      news: rows,
    });
  } catch (error) {
    console.error(
      "❌ NEWS ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= SEARCH ================= */

app.get("/api/search", async (req, res) => {
  try {
    const q = String(
      req.query.q || ""
    ).trim();

    if (!q) {
      return res.json({
        success: true,
        results: {
          matches: [],
          transfers: [],
          news: [],
          leagues: [],
        },
      });
    }

    const like = `%${q}%`;

    /* ===== MATCHES ===== */

    const [matches] = await db.query(
      `
      SELECT
        id,
        home_team,
        away_team,
        league_name,
        country,
        score_home,
        score_away,
        match_date
      FROM matches
      WHERE home_team LIKE ?
         OR away_team LIKE ?
         OR league_name LIKE ?
         OR country LIKE ?
      ORDER BY match_date DESC
      LIMIT 8
      `,
      [
        like,
        like,
        like,
        like,
      ]
    );

    /* ===== TRANSFERS ===== */

    const [transfers] = await db.query(
      `
      SELECT
        id,
        player AS player_name,
        player_photo,
        from_team,
        from_logo,
        to_team,
        to_logo,
        fee AS transfer_fee,
        transfer_date
      FROM transfers
      WHERE player LIKE ?
         OR from_team LIKE ?
         OR to_team LIKE ?
      ORDER BY transfer_date DESC
      LIMIT 8
      `,
      [
        like,
        like,
        like,
      ]
    );

    /* ===== NEWS ===== */

    const [news] = await db.query(
      `
      SELECT
        id,
        title,
        description,
        image,
        published_at
      FROM news
      WHERE title LIKE ?
         OR description LIKE ?
      ORDER BY published_at DESC
      LIMIT 8
      `,
      [
        like,
        like,
      ]
    );

    /* ===== LEAGUES ===== */

    const leagues = LEAGUES.filter(
      (league) =>
        `${league.name} ${league.country}`
          .toLowerCase()
          .includes(q.toLowerCase())
    );

    res.json({
      success: true,
      results: {
        matches,
        transfers,
        news,
        leagues,
      },
    });
  } catch (error) {
    console.error(
      "❌ SEARCH ERROR:",
      error.message
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* ================= SAVE MATCH ================= */

async function saveMatch(match) {
  await db.query(
    `
    INSERT INTO matches (
      source_id,
      home_team,
      away_team,
      home_logo,
      away_logo,
      match_date,
      status,
      score_home,
      score_away,
      league_id,
      league_name,
      country,
      league_logo
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    ON DUPLICATE KEY UPDATE
      home_team = VALUES(home_team),
      away_team = VALUES(away_team),
      home_logo = VALUES(home_logo),
      away_logo = VALUES(away_logo),
      match_date = VALUES(match_date),
      status = VALUES(status),
      score_home = VALUES(score_home),
      score_away = VALUES(score_away),
      league_id = VALUES(league_id),
      league_name = VALUES(league_name),
      country = VALUES(country),
      league_logo = VALUES(league_logo)
    `,
    [
      match.source_id,
      match.home_team,
      match.away_team,
      match.home_logo,
      match.away_logo,
      match.match_date,
      match.status,
      match.score_home,
      match.score_away,
      match.league_id,
      match.league_name,
      match.country,
      match.league_logo,
    ]
  );
}

/* ================= MATCH SYNC ================= */

let syncRunning = false;

async function syncMatches() {
  if (syncRunning) {
    return;
  }

  syncRunning = true;

  try {
    console.log(
      "\n🔄 Syncing matches..."
    );

    const start = new Date();
    start.setDate(
      start.getDate() - 7
    );

    const end = new Date();
    end.setDate(
      end.getDate() + 30
    );

    const formatDate = (date) =>
      date
        .toISOString()
        .slice(0, 10)
        .replaceAll("-", "");

    const startDate =
      formatDate(start);

    const endDate =
      formatDate(end);

    console.log(
      `📅 ${startDate} → ${endDate}`
    );

    let totalSaved = 0;

    for (const league of LEAGUES) {
      try {
        const url =
          `https://site.api.espn.com/apis/site/v2/sports/soccer/` +
          `${league.id}/scoreboard?dates=${startDate}-${endDate}`;

        const response =
          await axios.get(url, {
            timeout: 15000,
          });

        const events =
          response.data?.events || [];

        let saved = 0;

        for (const event of events) {
          const competition =
            event.competitions?.[0];

          const competitors =
            competition?.competitors || [];

          const home =
            competitors.find(
              (x) =>
                x.homeAway === "home"
            );

          const away =
            competitors.find(
              (x) =>
                x.homeAway === "away"
            );

          if (!home || !away) {
            continue;
          }

          await saveMatch({
            source_id: String(
              event.id
            ),

            home_team:
              home.team?.displayName ||
              home.team?.name ||
              "Home",

            away_team:
              away.team?.displayName ||
              away.team?.name ||
              "Away",

            home_logo:
              home.team?.logo || "",

            away_logo:
              away.team?.logo || "",

            match_date:
              event.date
                ? new Date(event.date)
                : null,

            status:
              event.status?.type?.name ||
              event.status?.type?.state ||
              "scheduled",

            score_home:
              Number(
                home.score || 0
              ),

            score_away:
              Number(
                away.score || 0
              ),

            league_id:
              league.id,

            league_name:
              league.name,

            country:
              league.country,

            league_logo:
              event.league?.logo || "",
          });

          saved++;
          totalSaved++;
        }

        console.log(
          `✅ ${league.name}: ${saved}`
        );
      } catch (error) {
        console.error(
          `❌ ${league.name}:`,
          error.message
        );
      }
    }

    console.log(
      `✅ Matches saved: ${totalSaved}`
    );
  } catch (error) {
    console.error(
      "❌ MATCH SYNC ERROR:",
      error.message
    );
  } finally {
    syncRunning = false;
  }
}

/* ================= TRANSFERS SYNC ================= */

const TRANSFER_TEAMS = [
  40,
  50,
  42,
  49,
  529,
  541,
];

async function syncTransfers() {
  if (!API_FOOTBALL_KEY) {
    console.log(
      "⚠️ Transfers skipped: API key missing"
    );
    return;
  }

  try {
    console.log(
      "\n🔄 Syncing transfers..."
    );

    let totalSaved = 0;

    for (const teamId of TRANSFER_TEAMS) {
      try {
        const response =
          await axios.get(
            "https://v3.football.api-sports.io/transfers",
            {
              params: {
                team: teamId,
              },
              headers: {
                "x-apisports-key":
                  API_FOOTBALL_KEY,
              },
              timeout: 15000,
            }
          );

        const transfers =
          response.data?.response || [];

        for (const item of transfers.slice(
          0,
          10
        )) {
          const player =
            item.player || {};

          const transfersList =
            item.transfers || [];

          for (const move of transfersList) {
            const from =
              move.teams?.in ||
              {};

            const to =
              move.teams?.out ||
              {};

            const playerName =
              player.name ||
              "Unknown Player";

            const fromTeam =
              from.name || "";

            const toTeam =
              to.name || "";

            const transferDate =
              move.date
                ? new Date(move.date)
                : new Date();

            const key =
              `${playerName}-${fromTeam}-${toTeam}-${transferDate.toISOString()}`;

            await db.query(
              `
              INSERT INTO transfers (
                player,
                player_photo,
                from_team,
                from_logo,
                to_team,
                to_logo,
                fee,
                transfer_date,
                transfer_key
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)

              ON DUPLICATE KEY UPDATE
                player_photo = VALUES(player_photo),
                from_logo = VALUES(from_logo),
                to_logo = VALUES(to_logo),
                fee = VALUES(fee),
                transfer_date = VALUES(transfer_date)
              `,
              [
                playerName,
                player.photo || "",
                fromTeam,
                from.logo || "",
                toTeam,
                to.logo || "",
                move.type || "",
                transferDate,
                key,
              ]
            );

            totalSaved++;
          }
        }

        console.log(
          `✅ Team ${teamId}: ${transfers.length}`
        );
      } catch (error) {
        console.error(
          `❌ Transfer team ${teamId}:`,
          error?.response?.data ||
            error.message
        );
      }
    }

    console.log(
      `✅ Transfers processed: ${totalSaved}`
    );
  } catch (error) {
    console.error(
      "❌ TRANSFERS SYNC ERROR:",
      error.message
    );
  }
}

/* ================= NEWS SYNC ================= */

async function syncNews() {
  if (!GNEWS_API_KEY) {
    console.log(
      "⚠️ News skipped: GNEWS key missing"
    );
    return;
  }

  try {
    console.log(
      "\n📰 Syncing news..."
    );

    const response =
      await axios.get(
        "https://gnews.io/api/v4/search",
        {
          params: {
            q: "football soccer",
            lang: "en",
            max: 10,
            apikey: GNEWS_API_KEY,
          },
          timeout: 15000,
        }
      );

    const articles =
      response.data?.articles || [];

    console.log(
      `📰 GNews articles: ${articles.length}`
    );

    for (const article of articles) {
      await db.query(
        `
        INSERT INTO news (
          title,
          description,
          image,
          published_at
        )
        VALUES (?, ?, ?, ?)
        `,
        [
          article.title ||
            "Football News",

          String(
            article.description || ""
          ).slice(0, 500),

          article.image || "",

          article.publishedAt
            ? new Date(
                article.publishedAt
              )
            : new Date(),
        ]
      );
    }

    console.log(
      `✅ News synced: ${articles.length}`
    );
  } catch (error) {
    console.error(
      "❌ NEWS SYNC ERROR:",
      error?.response?.data ||
        error.message
    );
  }
}

/* ================= GOALZONE AI ================= */

app.post(
  "/api/ai/chat",
  async (req, res) => {
    try {
      const {
        message,
        favorites = [],
      } = req.body;

      if (!message?.trim()) {
        return res.status(400).json({
          success: false,
          message:
            "اكتب سؤالك الأول.",
        });
      }

      if (!openai) {
        return res.status(500).json({
          success: false,
          message:
            "الـ AI غير متصل حاليًا.",
        });
      }

      const [matches] =
        await db.query(`
          SELECT
            home_team,
            away_team,
            match_date,
            status,
            score_home,
            score_away,
            league_name
          FROM matches
          WHERE match_date >= NOW()
             OR status IN (
               'in',
               'live',
               'LIVE'
             )
          ORDER BY match_date ASC
          LIMIT 6
        `);

      const compactMatches =
        matches.map((m) => ({
          home: m.home_team,
          away: m.away_team,
          date: m.match_date,
          status: m.status,
          score:
            `${m.score_home ?? 0}-${m.score_away ?? 0}`,
          league: m.league_name,
        }));

      const compactFavorites =
        Array.isArray(favorites)
          ? favorites
              .slice(0, 5)
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item?.name ||
                    item?.team ||
                    ""
              )
              .filter(Boolean)
          : [];

      const response =
        await openai.responses.create({
          model: "gpt-5.5",

          instructions:
            "أنت GoalZone AI. " +
            "أجب بالعربية بشكل واضح ومفيد. " +
            "اعتمد على البيانات المتاحة فقط. " +
            "لا تخترع نتائج أو مواعيد. " +
            "إذا لم تجد المعلومة قل إنها غير متاحة.",

          input:
            `Matches: ${JSON.stringify(
              compactMatches
            )}\n` +
            `Favorites: ${JSON.stringify(
              compactFavorites
            )}\n` +
            `Question: ${message.trim()}`,
        });

      const answer =
        response.output_text?.trim() ||
        "مش قادر أطلع إجابة دلوقتي.";

      res.json({
        success: true,
        answer,
      });
    } catch (error) {
      console.error(
        "❌ AI ERROR:",
        error?.message || error
      );

      if (
        error?.status === 429 ||
        error?.code ===
          "rate_limit_exceeded"
      ) {
        return res.status(429).json({
          success: false,
          message:
            "الـ AI مش متاح مؤقتًا، جرّب بعد شوية.",
        });
      }

      res.status(500).json({
        success: false,
        message:
          "حصل خطأ أثناء تشغيل GoalZone AI.",
      });
    }
  }
);

/* ================= START ================= */

async function startServer() {
  try {
    await db.query("SELECT 1");

    console.log(
      "✅ MySQL Connected"
    );

    await prepareTransfersTable();

    app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🚀 Server running on http://127.0.0.1:${PORT}`
        );
      }
    );

    await syncMatches();

    await syncTransfers();

    await syncNews();

    setInterval(
      syncMatches,
      5 * 60 * 1000
    );

    setInterval(
      syncTransfers,
      30 * 60 * 1000
    );

    setInterval(
      syncNews,
      30 * 60 * 1000
    );
  } catch (error) {
    console.error(
      "❌ SERVER ERROR:",
      error.message
    );
  }
}

startServer();