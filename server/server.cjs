const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "goalzone",
  password: "GoalZone123!",
  database: "goalzone",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
});

const leagues = [
  { id: "eng.1", name: "Premier League", country: "England" },
  { id: "esp.1", name: "La Liga", country: "Spain" },
  { id: "ger.1", name: "Bundesliga", country: "Germany" },
  { id: "ita.1", name: "Serie A", country: "Italy" },
  { id: "fra.1", name: "Ligue 1", country: "France" },
  { id: "uefa.champions", name: "Champions League", country: "Europe" },
];

function formatDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toISOString().slice(0, 19).replace("T", " ");
}

/* ================= DATABASE ================= */

async function createTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS matches (
      id INT AUTO_INCREMENT PRIMARY KEY,
      home_team VARCHAR(100),
      away_team VARCHAR(100),
      home_logo TEXT,
      away_logo TEXT,
      match_date DATETIME,
      status VARCHAR(30),
      score_home INT DEFAULT 0,
      score_away INT DEFAULT 0,
      source_id VARCHAR(100) UNIQUE,
      league_id VARCHAR(100),
      league_name VARCHAR(150),
      country VARCHAR(100),
      league_logo TEXT
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS news (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      image TEXT,
      category VARCHAR(100),
      source VARCHAR(150),
      published_at DATETIME,
      source_url TEXT,
      source_id VARCHAR(150) UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Database tables ready");
}

/* ================= MATCHES ================= */

async function syncLeague(league) {
  try {
    const url =
      `https://site.api.espn.com/apis/site/v2/sports/soccer/${league.id}/scoreboard`;

    const response = await axios.get(url, { timeout: 15000 });
    const events = response.data?.events || [];

    for (const event of events) {
      const competition = event.competitions?.[0];
      const competitors = competition?.competitors || [];

      const home = competitors.find((x) => x.homeAway === "home");
      const away = competitors.find((x) => x.homeAway === "away");

      if (!home || !away) continue;

      const homeScore = Number(home.score) || 0;
      const awayScore = Number(away.score) || 0;

      const status =
        competition?.status?.type?.name ||
        event.status?.type?.name ||
        "SCHEDULED";

      const matchDate = formatDate(event.date);

      await db.query(
        `
        INSERT INTO matches (
          home_team,
          away_team,
          home_logo,
          away_logo,
          match_date,
          status,
          score_home,
          score_away,
          source_id,
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
          league_name = VALUES(league_name),
          country = VALUES(country),
          league_logo = VALUES(league_logo)
        `,
        [
          home.team?.displayName || home.team?.name || "Home",
          away.team?.displayName || away.team?.name || "Away",
          home.team?.logo || null,
          away.team?.logo || null,
          matchDate,
          status,
          homeScore,
          awayScore,
          String(event.id),
          league.id,
          league.name,
          league.country,
          competition?.league?.logo || null,
        ]
      );
    }

    console.log(`⚽ ${league.name}: ${events.length} matches synced`);
  } catch (error) {
    console.log(`❌ ${league.name}: ${error.message}`);
  }
}

async function syncMatches() {
  console.log("🔄 Syncing matches...");

  for (const league of leagues) {
    await syncLeague(league);
  }

  console.log("✅ Matches sync finished");
}

/* ================= NEWS ================= */

async function syncNews() {
  try {
    console.log("📰 Syncing football news...");

    const response = await axios.get(
      "https://site.api.espn.com/apis/site/v2/sports/soccer/news",
      { timeout: 15000 }
    );

    const articles = response.data?.articles || [];

    let saved = 0;

    for (const article of articles.slice(0, 30)) {
      const title = article.headline || article.title;

      if (!title) continue;

      const description =
        article.description ||
        article.summary ||
        "";

      const image =
        article.images?.[0]?.url ||
        article.image?.url ||
        null;

      const source =
        article.source ||
        "ESPN";

      const publishedAt = formatDate(
        article.published ||
        article.publishedAt ||
        article.date
      );

      const sourceUrl =
        article.links?.web?.href ||
        article.link ||
        null;

      const sourceId =
        String(article.id || article.links?.web?.href || title);

      let category = "FOOTBALL";

      const text = (
        title +
        " " +
        description
      ).toLowerCase();

      if (
        text.includes("transfer") ||
        text.includes("signing")
      ) {
        category = "TRANSFERS";
      } else if (
        text.includes("champions league") ||
        text.includes("ucl")
      ) {
        category = "CHAMPIONS LEAGUE";
      } else if (
        text.includes("premier league") ||
        text.includes("arsenal") ||
        text.includes("chelsea") ||
        text.includes("liverpool") ||
        text.includes("manchester")
      ) {
        category = "PREMIER LEAGUE";
      } else if (
        text.includes("la liga") ||
        text.includes("barcelona") ||
        text.includes("real madrid")
      ) {
        category = "LA LIGA";
      }

      await db.query(
        `
        INSERT INTO news (
          title,
          description,
          image,
          category,
          source,
          published_at,
          source_url,
          source_id
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          title = VALUES(title),
          description = VALUES(description),
          image = VALUES(image),
          category = VALUES(category),
          source = VALUES(source),
          published_at = VALUES(published_at),
          source_url = VALUES(source_url)
        `,
        [
          title,
          description,
          image,
          category,
          source,
          publishedAt,
          sourceUrl,
          sourceId,
        ]
      );

      saved++;
    }

    console.log(`✅ News synced: ${saved} articles`);
  } catch (error) {
    console.log("❌ News sync error:", error.message);
  }
}

/* ================= API ================= */

app.get("/api/matches", async (req, res) => {
  try {
    const { league } = req.query;

    let sql = "SELECT * FROM matches";
    const params = [];

    if (league) {
      sql += " WHERE league_id = ?";
      params.push(league);
    }

    sql += " ORDER BY match_date ASC";

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (error) {
    console.error("Matches API error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load matches",
    });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        title,
        description,
        image,
        category,
        source,
        published_at,
        source_url
      FROM news
      ORDER BY published_at DESC, id DESC
      LIMIT 30
    `);

    res.json(rows);
  } catch (error) {
    console.error("News API error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to load news",
    });
  }
});

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      server: "online",
      database: "connected",
    });
  } catch {
    res.status(500).json({
      success: false,
      server: "online",
      database: "disconnected",
    });
  }
});

/* ================= START ================= */

async function start() {
  try {
    await db.query("SELECT 1");

    console.log("✅ MySQL Connected");

    await createTables();

    await syncMatches();
    await syncNews();

    setInterval(syncMatches, 5 * 60 * 1000);
    setInterval(syncNews, 10 * 60 * 1000);

    app.listen(PORT, () => {
      console.log(
        `🚀 Server running on http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error("❌ Server startup error:", error.message);
  }
}

start();