const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "..", ".env")
});

const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const axios = require("axios");
const OpenAI = require("openai");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: "goalzone",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10
});

const API_KEY = process.env.API_FOOTBALL_KEY;
const FOOTBALL_API = "https://v3.football.api-sports.io";

console.log(
  "🔑 API FOOTBALL KEY:",
  API_KEY ? `FOUND (${API_KEY.length} chars)` : "❌ MISSING"
);

const apiConfig = {
  headers: {
    "x-apisports-key": API_KEY
  }
};

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  : null;

/* ================= HEALTH ================= */

app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");

    res.json({
      success: true,
      mysql: true,
      ai: !!openai,
      transfersApi: !!API_KEY
    });
  } catch (e) {
    console.error("❌ HEALTH:", e.message);

    res.status(500).json({
      success: false,
      mysql: false,
      message: e.message
    });
  }
});

/* ================= MATCHES ================= */

app.get("/api/matches", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT *
      FROM matches
      ORDER BY match_date ASC
    `);

    console.log(`⚽ Matches API: ${rows.length}`);

    res.json({
      success: true,
      matches: rows
    });
  } catch (e) {
    console.error("❌ MATCHES:", e.message);

    res.status(500).json({
      success: false,
      matches: [],
      message: e.message
    });
  }
});

/* ================= API FOOTBALL TEST ================= */

async function testFootballApi() {
  if (!API_KEY) {
    console.log("❌ API_FOOTBALL_KEY missing");
    return false;
  }

  try {
    const response = await axios.get(
      `${FOOTBALL_API}/status`,
      {
        ...apiConfig,
        timeout: 10000
      }
    );

    console.log(
      "🏆 API-FOOTBALL STATUS:",
      response.data
    );

    if (
      response.data?.errors &&
      Object.keys(response.data.errors).length
    ) {
      console.log(
        "❌ API ERROR:",
        response.data.errors
      );

      return false;
    }

    console.log("✅ API-Football Connected");
    return true;

  } catch (e) {
    console.log(
      "❌ API-FOOTBALL ERROR:",
      e.response?.data || e.message
    );

    return false;
  }
}

/* ================= TEAM SEARCH ================= */

function cleanName(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\b(fc|cf|afc|sc|ac|club)\b/g, "")
    .replace(/[^a-z0-9]/g, "");
}

async function findTeam(name) {
  if (!name || !API_KEY) return null;

  try {
    const response = await axios.get(
      `${FOOTBALL_API}/teams`,
      {
        ...apiConfig,
        params: {
          search: name
        },
        timeout: 10000
      }
    );

    const errors = response.data?.errors || {};
    const teams = response.data?.response || [];

    if (Object.keys(errors).length) {
      console.log(
        `❌ API Team ${name}:`,
        errors
      );
    }

    console.log(
      `🔎 ${name} -> ${teams.length} result(s)`
    );

    if (!teams.length) return null;

    const wanted = cleanName(name);

    const exact = teams.find(
      x => cleanName(x.team?.name) === wanted
    );

    if (exact?.team) {
      return exact.team;
    }

    const similar = teams.find(x => {
      const current = cleanName(x.team?.name);

      return (
        current.includes(wanted) ||
        wanted.includes(current)
      );
    });

    return similar?.team || teams[0]?.team || null;

  } catch (e) {
    console.log(
      `❌ Team error ${name}:`,
      e.response?.data || e.message
    );

    return null;
  }
}

/* ================= TRANSFERS API ================= */

app.get("/api/transfers", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        player,
        player_photo,
        from_team,
        from_logo,
        to_team,
        to_logo,
        fee,
        transfer_date
      FROM transfers
      ORDER BY transfer_date DESC, id DESC
      LIMIT 100
    `);

    const transfers = rows.map(t => ({
      id: t.id,
      player_name: t.player || "Unknown Player",
      player_photo: t.player_photo || "",
      from_team: t.from_team || "Unknown",
      from_logo: t.from_logo || "",
      to_team: t.to_team || "Unknown",
      to_logo: t.to_logo || "",
      transfer_fee: t.fee || "N/A",
      transfer_date: t.transfer_date || null
    }));

    console.log(
      `🔄 Transfers API: ${transfers.length}`
    );

    res.json({
      success: true,
      transfers
    });

  } catch (e) {
    console.error(
      "❌ TRANSFERS API:",
      e.message
    );

    res.status(500).json({
      success: false,
      transfers: [],
      message: e.message
    });
  }
});

/* ================= TRANSFERS SYNC ================= */

async function syncTransfers() {
  if (!API_KEY) {
    console.log("❌ No API_FOOTBALL_KEY");
    return;
  }

  const apiOk = await testFootballApi();

  if (!apiOk) {
    console.log(
      "⛔ Transfers sync stopped بسبب مشكلة API-Football"
    );
    return;
  }

  console.log("\n🔄 Syncing transfers...");

  try {
    const [teams] = await db.query(`
      SELECT DISTINCT home_team AS team
      FROM matches
      WHERE home_team IS NOT NULL

      UNION

      SELECT DISTINCT away_team AS team
      FROM matches
      WHERE away_team IS NOT NULL
    `);

    let saved = 0;

    for (const row of teams.slice(0, 20)) {
      if (!row.team) continue;

      const team = await findTeam(row.team);

      if (!team?.id) {
        console.log(
          `⚠️ Team not found: ${row.team}`
        );
        continue;
      }

      try {
        const response = await axios.get(
          `${FOOTBALL_API}/transfers`,
          {
            ...apiConfig,
            params: {
              team: team.id
            },
            timeout: 15000
          }
        );

        const errors =
          response.data?.errors || {};

        if (Object.keys(errors).length) {
          console.log(
            `⚠️ Transfers ${row.team}:`,
            errors
          );
          continue;
        }

        const list =
          response.data?.response || [];

        for (const item of list) {
          const player = item.player;

          if (!player?.name) continue;

          for (const transfer of item.transfers || []) {
            const from = transfer.teams?.out;
            const to = transfer.teams?.in;

            const fromTeam = from?.name || "";
            const toTeam = to?.name || "";

            if (!fromTeam && !toTeam) continue;

            const fromLogo = from?.logo || "";
            const toLogo = to?.logo || "";

            const date = transfer.date
              ? new Date(transfer.date)
                  .toISOString()
                  .slice(0, 10)
              : null;

            if (!date) continue;

            const fee =
              transfer.type || "N/A";

            const photo =
              player.photo || "";

            const [exists] = await db.query(
              `
              SELECT id
              FROM transfers
              WHERE player = ?
              AND from_team = ?
              AND to_team = ?
              AND transfer_date = ?
              LIMIT 1
              `,
              [
                player.name,
                fromTeam,
                toTeam,
                date
              ]
            );

            if (exists.length) {
              await db.query(
                `
                UPDATE transfers
                SET
                  player_photo = ?,
                  from_logo = ?,
                  to_logo = ?,
                  fee = ?
                WHERE id = ?
                `,
                [
                  photo,
                  fromLogo,
                  toLogo,
                  fee,
                  exists[0].id
                ]
              );

              continue;
            }

            await db.query(
              `
              INSERT INTO transfers
              (
                player,
                player_photo,
                from_team,
                from_logo,
                to_team,
                to_logo,
                fee,
                transfer_date
              )
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)
              `,
              [
                player.name,
                photo,
                fromTeam,
                fromLogo,
                toTeam,
                toLogo,
                fee,
                date
              ]
            );

            saved++;
          }
        }

        console.log(
          `✅ ${row.team}`
        );

      } catch (e) {
        console.log(
          `⚠️ Transfer ${row.team}:`,
          e.response?.data || e.message
        );
      }
    }

    console.log(
      `✅ Transfers saved: ${saved}`
    );

  } catch (e) {
    console.log(
      "❌ Transfer sync:",
      e.message
    );
  }
}

/* ================= AI ================= */

app.post("/api/ai/chat", async (req, res) => {
  try {
    if (!openai) {
      return res.status(500).json({
        success: false,
        message: "OPENAI_API_KEY missing"
      });
    }

    const message =
      String(req.body.message || "").trim();

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "اكتب رسالة"
      });
    }

    const response =
      await openai.responses.create({
        model: "gpt-5.6-luna",
        instructions:
          "أنت GoalZone AI. أجب بالعربية باختصار شديد. تحدث فقط عن كرة القدم.",
        input: message,
        max_output_tokens: 300
      });

    res.json({
      success: true,
      answer:
        response.output_text ||
        "لم أستطع توليد إجابة."
    });

  } catch (e) {
    console.error(
      "❌ AI ERROR:",
      e.message
    );

    res.status(500).json({
      success: false,
      message: e.message
    });
  }
});

/* ================= START ================= */

async function start() {
  try {
    await db.query("SELECT 1");

    console.log("✅ MySQL Connected");

    const server = app.listen(
      PORT,
      "0.0.0.0",
      () => {
        console.log(
          `🚀 Server: http://127.0.0.1:${PORT}`
        );
      }
    );

    server.on("error", err => {
      console.error(
        "❌ SERVER LISTEN ERROR:",
        err.message
      );
    });

    await syncTransfers();

  } catch (e) {
    console.error(
      "❌ SERVER ERROR:",
      e.message
    );
  }
}

start();