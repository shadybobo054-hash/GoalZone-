const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "goalzone",
  password: "GoalZone123!",
  database: "goalzone",
  port: 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Error:", err.message);
    return;
  }

  console.log("✅ MySQL Connected");
});

const LEAGUES = [
  ["eng.1", "Premier League", "England"],
  ["esp.1", "LaLiga", "Spain"],
  ["ger.1", "Bundesliga", "Germany"],
  ["ita.1", "Serie A", "Italy"],
  ["fra.1", "Ligue 1", "France"],
  ["ned.1", "Eredivisie", "Netherlands"],
  ["por.1", "Primeira Liga", "Portugal"],
  ["bel.1", "Belgian Pro League", "Belgium"],
  ["tur.1", "Super Lig", "Turkey"],
  ["sco.1", "Scottish Premiership", "Scotland"],
  ["gre.1", "Super League Greece", "Greece"],
  ["aut.1", "Austrian Bundesliga", "Austria"],
  ["sui.1", "Swiss Super League", "Switzerland"],
  ["den.1", "Danish Superliga", "Denmark"],
  ["nor.1", "Eliteserien", "Norway"],
  ["swe.1", "Allsvenskan", "Sweden"],
  ["mex.1", "Liga MX", "Mexico"],
  ["bra.1", "Brasileirao", "Brazil"],
  ["arg.1", "Liga Profesional", "Argentina"],
  ["usa.1", "MLS", "USA"],
  ["col.1", "Liga BetPlay", "Colombia"],
  ["jpn.1", "J1 League", "Japan"],
  ["aus.1", "A-League", "Australia"],
  ["uefa.champions", "UEFA Champions League", "Europe"],
  ["uefa.europa", "UEFA Europa League", "Europe"],
  ["uefa.europa.conf", "UEFA Conference League", "Europe"],
  ["conmebol.libertadores", "Copa Libertadores", "South America"],
  ["conmebol.sudamericana", "Copa Sudamericana", "South America"],
];

function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
}

async function saveMatch(match) {
  const sql = `
    INSERT INTO matches (
      source_id,
      league_id,
      league_name,
      country,
      league_logo,
      home_team,
      away_team,
      home_logo,
      away_logo,
      match_date,
      status,
      score_home,
      score_away
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)

    ON DUPLICATE KEY UPDATE
      league_id = VALUES(league_id),
      league_name = VALUES(league_name),
      country = VALUES(country),
      league_logo = VALUES(league_logo),
      home_team = VALUES(home_team),
      away_team = VALUES(away_team),
      home_logo = VALUES(home_logo),
      away_logo = VALUES(away_logo),
      match_date = VALUES(match_date),
      status = VALUES(status),
      score_home = VALUES(score_home),
      score_away = VALUES(score_away)
  `;

  await query(sql, [
    match.source_id,
    match.league_id,
    match.league_name,
    match.country,
    match.league_logo,
    match.home_team,
    match.away_team,
    match.home_logo,
    match.away_logo,
    match.match_date,
    match.status,
    match.score_home,
    match.score_away,
  ]);
}

async function syncMatches() {
  console.log("🔄 Updating world matches...");

  let totalSaved = 0;

  for (const [leagueId, leagueName, country] of LEAGUES) {
    try {
      const url =
        `https://site.api.espn.com/apis/site/v2/sports/soccer/` +
        `${leagueId}/scoreboard`;

      const response = await axios.get(url, {
        timeout: 15000,
      });

      const events = response.data?.events || [];

      const leagueLogo =
        response.data?.leagues?.[0]?.logos?.[0]?.href || "";

      let saved = 0;

      for (const event of events) {
        try {
          const competition = event.competitions?.[0];

          if (!competition) continue;

          const competitors =
            competition.competitors || [];

          const home = competitors.find(
            (team) => team.homeAway === "home"
          );

          const away = competitors.find(
            (team) => team.homeAway === "away"
          );

          if (!home || !away) continue;

          const state =
            event.status?.type?.state;

          let status = "Scheduled";

          if (state === "in") {
            status = "Live";
          } else if (state === "post") {
            status = "Finished";
          }

          const match = {
            source_id: String(event.id),

            league_id: leagueId,

            league_name: leagueName,

            country: country,

            league_logo: leagueLogo,

            home_team:
              home.team?.displayName ||
              home.team?.shortDisplayName ||
              "Unknown",

            away_team:
              away.team?.displayName ||
              away.team?.shortDisplayName ||
              "Unknown",

            home_logo:
              home.team?.logo || "",

            away_logo:
              away.team?.logo || "",

            match_date: event.date
              ? new Date(event.date)
              : null,

            status: status,

            score_home:
              Number(home.score || 0),

            score_away:
              Number(away.score || 0),
          };

          await saveMatch(match);

          saved++;
          totalSaved++;
        } catch (err) {
          console.error(
            `❌ Match save error (${leagueName}):`,
            err.message
          );
        }
      }

      console.log(
        `✅ ${leagueName}: ${saved}/${events.length} matches`
      );
    } catch (err) {
      console.error(
        `❌ ESPN Error (${leagueId}):`,
        err.message
      );
    }
  }

  console.log(
    `🏁 World matches update finished | Saved: ${totalSaved}`
  );
}

app.get("/api/matches", async (req, res) => {
  try {
    const { league } = req.query;

    let sql = `
      SELECT *
      FROM matches
    `;

    const params = [];

    if (league) {
      sql += ` WHERE league_id = ?`;
      params.push(league);
    }

    sql += `
      ORDER BY match_date ASC
    `;

    const data = await query(sql, params);

    res.json(data);
  } catch (err) {
    console.error(
      "❌ Matches API:",
      err.message
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/api/leagues", async (req, res) => {
  try {
    const data = await query(`
      SELECT
        league_id,
        league_name,
        country,
        MAX(league_logo) AS league_logo,
        COUNT(*) AS matches_count
      FROM matches
      WHERE league_id IS NOT NULL
      GROUP BY
        league_id,
        league_name,
        country
      ORDER BY league_name ASC
    `);

    res.json(data);
  } catch (err) {
    console.error(
      "❌ Leagues API:",
      err.message
    );

    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/api/news", async (req, res) => {
  try {
    const data = await query(`
      SELECT *
      FROM news
      ORDER BY published_at DESC
    `);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/api/transfers", async (req, res) => {
  try {
    const data = await query(`
      SELECT *
      FROM transfers
      ORDER BY transfer_date DESC
    `);

    res.json(data);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

app.get("/api/sync/matches", async (req, res) => {
  try {
    await syncMatches();

    res.json({
      success: true,
      message: "World matches updated",
    });
  } catch (err) {
    console.error(
      "❌ Sync Error:",
      err.message
    );

    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(5000, async () => {
  console.log(
    "🚀 Server running on http://localhost:5000"
  );

  try {
    await syncMatches();
  } catch (err) {
    console.error(
      "❌ Startup sync error:",
      err.message
    );
  }

  setInterval(
    async () => {
      try {
        await syncMatches();
      } catch (err) {
        console.error(
          "❌ Auto sync error:",
          err.message
        );
      }
    },
    5 * 60 * 1000
  );
});