
// =====================================================
// GOALZONE — TRANSFERS API
// Open Transfermarkt Dataset
// No API Key — No Login
// =====================================================

export type Transfer = {
  id: string;
  player: string;
  from: string;
  to: string;
  date: string;
  fee: number | null;
  marketValue: number | null;
};

const TRANSFERS_URL =
  "https://pub-e682421888d945d684bcae8890b0ec20.r2.dev/data/transfers.csv.gz";

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && next === '"') {
      value += '"';
      i++;
      continue;
    }

    if (char === '"') {
      quotes = !quotes;
      continue;
    }

    if (char === "," && !quotes) {
      row.push(value);
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quotes) {
      if (char === "\r" && next === "\n") i++;

      row.push(value);
      value = "";

      if (row.some((x) => x.trim())) {
        rows.push(row);
      }

      row = [];
      continue;
    }

    value += char;
  }

  if (value || row.length) {
    row.push(value);

    if (row.some((x) => x.trim())) {
      rows.push(row);
    }
  }

  return rows;
}

function numberOrNull(value?: string): number | null {
  if (!value || !value.trim()) return null;

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

async function readGzip(response: Response): Promise<string> {
  if ("DecompressionStream" in window) {
    const stream = response.body?.pipeThrough(
      new DecompressionStream("gzip")
    );

    if (!stream) {
      throw new Error("تعذر قراءة ملف الانتقالات");
    }

    return await new Response(stream).text();
  }

  throw new Error(
    "المتصفح لا يدعم فك ضغط بيانات الانتقالات"
  );
}

export async function getTransfers(
  limit = 100
): Promise<Transfer[]> {
  const response = await fetch(
    `${TRANSFERS_URL}?t=${Date.now()}`
  );

  if (!response.ok) {
    throw new Error(
      `Transfers API Error: ${response.status}`
    );
  }

  const csv = await readGzip(response);

  const rows = parseCSV(csv);

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map((header) =>
    header.trim().toLowerCase()
  );

  const getIndex = (name: string) =>
    headers.indexOf(name.toLowerCase());

  const playerIdIndex = getIndex("player_id");
  const playerNameIndex = getIndex("player_name");
  const dateIndex = getIndex("transfer_date");
  const fromIndex = getIndex("from_club_name");
  const toIndex = getIndex("to_club_name");
  const feeIndex = getIndex("transfer_fee");
  const marketValueIndex = getIndex(
    "market_value_in_eur"
  );

  const transfers: Transfer[] = rows
    .slice(1)
    .map((row) => {
      const playerId =
        playerIdIndex >= 0 ? row[playerIdIndex] : "";

      const player =
        playerNameIndex >= 0
          ? row[playerNameIndex]
          : "Unknown Player";

      const date =
        dateIndex >= 0 ? row[dateIndex] : "";

      const from =
        fromIndex >= 0
          ? row[fromIndex]
          : "Unknown";

      const to =
        toIndex >= 0
          ? row[toIndex]
          : "Unknown";

      return {
        id: `${playerId}-${date}-${from}-${to}`,
        player,
        from,
        to,
        date,
        fee:
          feeIndex >= 0
            ? numberOrNull(row[feeIndex])
            : null,
        marketValue:
          marketValueIndex >= 0
            ? numberOrNull(row[marketValueIndex])
            : null,
      };
    })
    .filter(
      (transfer) =>
        transfer.player &&
        transfer.from &&
        transfer.to
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      return dateB - dateA;
    });

  return transfers.slice(0, limit);
}

export async function getLatestTransfers(
  limit = 50
): Promise<Transfer[]> {
  return getTransfers(limit);
}

export async function searchTransfers(
  query: string,
  limit = 50
): Promise<Transfer[]> {
  const transfers = await getTransfers(500);

  const search = query.trim().toLowerCase();

  if (!search) {
    return transfers.slice(0, limit);
  }

  return transfers
    .filter(
      (transfer) =>
        transfer.player
          .toLowerCase()
          .includes(search) ||
        transfer.from
          .toLowerCase()
          .includes(search) ||
        transfer.to
          .toLowerCase()
          .includes(search)
    )
    .slice(0, limit);
}

export function formatTransferFee(
  fee: number | null
): string {
  if (fee === null) {
    return "غير معلن";
  }

  if (fee === 0) {
    return "Free Transfer";
  }

  if (fee >= 1_000_000_000) {
    return `${(fee / 1_000_000_000).toFixed(2)}B €`;
  }

  if (fee >= 1_000_000) {
    return `${(fee / 1_000_000).toFixed(2)}M €`;
  }

  if (fee >= 1_000) {
    return `${(fee / 1_000).toFixed(0)}K €`;
  }

  return `${fee.toLocaleString()} €`;
}

