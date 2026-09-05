const TRANSFER_BASE =
  "https://raw.githubusercontent.com/eordo/transfermarkt-data/master";

/* =========================================================
   TYPE
========================================================= */

export type Transfer = {
  id: string;

  player: string;

  from: string;

  to: string;

  date: string;

  type: string;

  fee: string;

  playerImage: string;

  fromLogo: string;

  toLogo: string;

  marketValue?: string;
};

/* =========================================================
   FILES
========================================================= */

const TRANSFER_FILES: Record<
  string,
  string
> = {
  "eng.1":
    "premier_league/2025.csv",

  "esp.1":
    "laliga/2025.csv",

  "ger.1":
    "bundesliga/2025.csv",

  "ita.1":
    "serie_a/2025.csv",

  "fra.1":
    "ligue_1/2025.csv",
};

/* =========================================================
   CSV LINE PARSER
========================================================= */

function parseCSVLine(
  line: string
): string[] {
  const result: string[] = [];

  let value = "";

  let quoted = false;

  for (
    let i = 0;
    i < line.length;
    i++
  ) {
    const char =
      line[i];

    /* Quotation */
    if (
      char === '"'
    ) {
      if (
        quoted &&
        line[i + 1] === '"'
      ) {
        value += '"';

        i++;
      } else {
        quoted =
          !quoted;
      }

      continue;
    }

    /* Separator */
    if (
      char === "," &&
      !quoted
    ) {
      result.push(
        value.trim()
      );

      value = "";

      continue;
    }

    value += char;
  }

  result.push(
    value.trim()
  );

  return result;
}

/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(
  text: string
): Record<string, string>[] {
  const lines =
    text
      .replace(/\r/g, "")
      .split("\n")
      .filter(Boolean);

  if (
    lines.length < 2
  ) {
    return [];
  }

  const headers =
    parseCSVLine(
      lines[0]
    );

  return lines
    .slice(1)
    .map(line => {
      const values =
        parseCSVLine(
          line
        );

      const row:
        Record<
          string,
          string
        > = {};

      headers.forEach(
        (
          header,
          index
        ) => {
          row[header] =
            values[index] ||
            "";
        }
      );

      return row;
    });
}

/* =========================================================
   FORMAT FEE
========================================================= */

function formatFee(
  fee: string
): string {
  if (
    !fee ||
    fee === "-" ||
    fee === "0"
  ) {
    return "FREE";
  }

  const value =
    Number(
      fee.replace(
        /[^\d.-]/g,
        ""
      )
    );

  if (
    !Number.isFinite(
      value
    ) ||
    value <= 0
  ) {
    return "UNDISCLOSED";
  }

  if (
    value >=
    1_000_000_000
  ) {
    return `€${(
      value /
      1_000_000_000
    ).toFixed(2)}B`;
  }

  if (
    value >=
    1_000_000
  ) {
    const m =
      value /
      1_000_000;

    return `€${m.toFixed(
      m >= 10 ? 0 : 1
    )}M`;
  }

  if (
    value >= 1_000
  ) {
    return `€${(
      value / 1_000
    ).toFixed(0)}K`;
  }

  return `€${value}`;
}

/* =========================================================
   CREATE TRANSFER
========================================================= */

function createTransfer(
  row: Record<string, string>,
  league: string,
  index: number
): Transfer | null {
  const player =
    row.player_name?.trim();

  const club =
    row.club?.trim();

  const dealingClub =
    row.dealing_club?.trim();

  if (
    !player ||
    !club
  ) {
    return null;
  }

  const movement =
    row.movement
      ?.trim()
      .toLowerCase();

  let from =
    dealingClub ||
    "—";

  let to =
    club;

  if (
    movement === "out"
  ) {
    from =
      club;

    to =
      dealingClub ||
      "—";
  }

  return {
    id:
      row.player_id ||
      `${league}-${player}-${index}`,

    player,

    from,

    to,

    date:
      row.season ||
      "2025",

    type:
      row.is_loan === "1"
        ? "LOAN"
        : "TRANSFER",

    fee:
      formatFee(
        row.fee
      ),

    playerImage:
      "",

    fromLogo:
      "",

    toLogo:
      "",

    marketValue:
      row.market_value
        ? formatFee(
            row.market_value
          )
        : undefined,
  };
}

/* =========================================================
   SINGLE TRANSFER CACHE
========================================================= */

/*
  IMPORTANT:

  لا يوجد Map لكل دوري هنا.

  السبب:
  هدفنا = Request واحد فقط.

  لذلك كل استدعاءات:
  
    getTransfers()
    getTransfers("all")
    getTransfers("eng.1")
    getTransfers("esp.1")
    ...

  تستخدم نفس البيانات ونفس الـ Promise.

  مصدر البيانات الوحيد:
  Premier League CSV.
*/

let transfersCache:
  | Transfer[]
  | null = null;

let transfersPromise:
  | Promise<Transfer[]>
  | null = null;

/* =========================================================
   SINGLE TRANSFER REQUEST
========================================================= */

async function loadTransfersOnce(): Promise<Transfer[]> {
  /* Cache */
  if (
    transfersCache !== null
  ) {
    return transfersCache;
  }

  /* Request already running */
  if (
    transfersPromise
  ) {
    return transfersPromise;
  }

  transfersPromise =
    (async () => {
      try {
        /*
          ONE REQUEST ONLY
        */

        const file =
          TRANSFER_FILES[
            "eng.1"
          ];

        const response =
          await fetch(
            `${TRANSFER_BASE}/${file}`
          );

        if (
          !response.ok
        ) {
          throw new Error(
            `CSV ${response.status}`
          );
        }

        const csv =
          await response.text();

        const rows =
          parseCSV(csv);

        const incoming =
          rows.filter(
            row =>
              row.movement
                ?.toLowerCase() ===
              "in"
          );

        const transfers =
          incoming
            .map(
              (
                row,
                index
              ) =>
                createTransfer(
                  row,
                  "eng.1",
                  index
                )
            )
            .filter(
              (
                item
              ): item is Transfer =>
                item !== null
            )
            .slice(
              0,
              100
            );

        /*
          Save result
        */

        transfersCache =
          transfers;

        return transfers;
      } catch (error) {
        console.error(
          "Transfers API error:",
          error
        );

        /*
          Cache empty result
          so errors don't cause
          endless requests.
        */

        transfersCache =
          [];

        return [];
      } finally {
        transfersPromise =
          null;
      }
    })();

  return transfersPromise;
}

/* =========================================================
   GET TRANSFERS
========================================================= */

export async function getTransfers(
  _league?: string
): Promise<Transfer[]> {
  /*
    Ignore league intentionally.

    Every call uses the SAME
    cached request.
  */

  return loadTransfersOnce();
}

/* =========================================================
   GET ALL TRANSFERS
========================================================= */

export async function getAllTransfers(): Promise<Transfer[]> {
  return loadTransfersOnce();
}