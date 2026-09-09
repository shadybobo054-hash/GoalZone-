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
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* ================= OPENAI ================= */

console.log(
  "OpenAI Key:",
  process.env.OPENAI_API_KEY ? "FOUND ✅" : "MISSING ❌"
);

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

/* ================= DATABASE ================= */

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "goalzone",
  password: process.env.DB_PASSWORD || "GoalZone123!",
  database: process.env.DB_NAME || "goalzone",
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

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
      message: "Server error",
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
    console.error("❌ MATCHES ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load matches",
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
    console.error("❌ NEWS ERROR:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to load news",
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

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

/* ================= MATCH SYNC ================= */

let syncRunning = false;

async function syncMatches() {
  if (syncRunning) {
    console.log("⏳ Match sync already running...");
    return;
  }

  syncRunning = true;

  try {
    console.log("\n🔄 Syncing matches...");

    const start = new Date();
    start.setDate(start.getDate() - 7);

    const end = new Date();
    end.setDate(end.getDate() + 30);

    const formatDate = (date) =>
      date.toISOString().slice(0, 10).replaceAll("-", "");

    const startDate = formatDate(start);
    const endDate = formatDate(end);

    console.log(
      `📅 Sync range: ${startDate} → ${endDate}`
    );

    let totalSaved = 0;

    for (const league of LEAGUES) {
      try {
        const url =
          `https://site.api.espn.com/apis/site/v2/sports/soccer/` +
          `${league.id}/scoreboard?dates=${startDate}-${endDate}`;

        const response = await axios.get(url, {
          timeout: 15000,
        });

        const events =
          response.data?.events || [];

        if (!events.length) {
          console.log(
            `⚠️ ${league.name}: no matches`
          );
          continue;
        }

        let saved = 0;

        for (const event of events) {
          const competition =
            event.competitions?.[0];

          const competitors =
            competition?.competitors || [];

          const home = competitors.find(
            (team) =>
              team.homeAway === "home"
          );

          const away = competitors.find(
            (team) =>
              team.homeAway === "away"
          );

          if (!home || !away) continue;

          await saveMatch({
            source_id: String(event.id),

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
              Number(home.score || 0),

            score_away:
              Number(away.score || 0),

            league_id: league.id,
            league_name: league.name,
            country: league.country,

            league_logo:
              event.league?.logo || "",
          });

          saved++;
          totalSaved++;
        }

        console.log(
          `✅ ${league.name}: ${saved} matches`
        );
      } catch (error) {
        console.error(
          `❌ ${league.name}:`,
          error.message
        );
      }
    }

    console.log(
      `✅ Match sync finished. Saved: ${totalSaved}`
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

/* ================= NEWS SYNC ================= */

async function syncNews() {
  try {
    console.log("\n📰 Syncing news...");

    const url =
      "https://site.api.espn.com/apis/site/v2/sports/soccer/news";

    const response = await axios.get(url, {
      timeout: 15000,
    });

    const articles =
      response.data?.articles || [];

    if (!articles.length) {
      console.log("⚠️ No news found");
      return;
    }

    for (const article of articles.slice(0, 10)) {
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
          article.headline ||
            "Football News",

          String(
            article.description || ""
          ).slice(0, 500),

          article.images?.[0]?.url || "",

          article.published ||
            new Date(),
        ]
      );
    }

    console.log(
      `✅ News synced: ${Math.min(
        articles.length,
        10
      )}`
    );
  } catch (error) {
    console.log(
      "⚠️ News unavailable"
    );
  }
}

/* ================= GOALZONE AI ================= */

app.post("/api/ai/chat", async (req, res) => {
  try {
    const {
      message,
      favorites = [],
    } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "اكتب سؤالك الأول.",
      });
    }

    if (!openai) {
      return res.status(500).json({
        success: false,
        message: "الـ AI غير متصل حاليًا.",
      });
    }

    /* ===== جلب المباريات ===== */

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
           OR status IN ('in', 'live', 'LIVE')
        ORDER BY match_date ASC
        LIMIT 6
      `);

    /* ===== بيانات صغيرة للـAI ===== */

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

    /* ===== تأكيد الموديل ===== */

    console.log("🤖 AI MODEL: gpt-5.5");
    console.log(
      "💬 AI QUESTION:",
      message.trim()
    );

    /* ===== AI REQUEST ===== */

    const response =
      await openai.responses.create({
        model: "gpt-5.5",

        instructions:
          "أنت GoalZone AI. " +
          "أجب بالعربية بشكل واضح ومفيد. " +
          "اعتمد على البيانات المتاحة فقط. " +
          "لا تخترع نتائج أو مواعيد. " +
          "إذا لم تجد المعلومة في البيانات، " +
          "قل إن المعلومة غير متاحة.",

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

    console.log(
      "✅ AI RESPONSE RECEIVED"
    );

    return res.json({
      success: true,
      answer,
    });

  } catch (error) {
    console.error(
      "❌ AI ERROR:",
      error?.message || "Unknown error"
    );

    /* ===== 429 ===== */

    if (
      error?.status === 429 ||
      error?.code === "rate_limit_exceeded"
    ) {
      return res.status(429).json({
        success: false,
        message:
          "الـ AI مش متاح مؤقتًا، جرّب بعد شوية.",
      });
    }

    /* ===== أخطاء OpenAI ===== */

    if (
      error?.status >= 400 &&
      error?.status < 500
    ) {
      return res.status(500).json({
        success: false,
        message:
          "حصلت مشكلة مؤقتة في خدمة الـ AI.",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        "حصل خطأ أثناء تشغيل GoalZone AI.",
    });
  }
});

/* ================= START SERVER ================= */

async function startServer() {
  try {
    await db.query("SELECT 1");

    console.log(
      "✅ MySQL Connected"
    );

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

    await syncNews();

    setInterval(
      syncMatches,
      5 * 60 * 1000
    );

    setInterval(
      syncNews,
      10 * 60 * 1000
    );

  } catch (error) {
    console.error(
      "❌ Server startup error:",
      error.message
    );
  }
}

startServer();