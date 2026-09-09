
// src/api/transfersApi.ts
// =====================================================
// GOALZONE — TRANSFERS API
// ESPN Soccer Transactions — بدون API Key
// =====================================================

const BASE_URL =
  "https://site.api.espn.com/apis/site/v2/sports/soccer";

export type Transfer = {
  id: string;
  player: string;
  from: string;
  to: string;
  date: string;
  type?: string;
  image?: string;
};

type TransactionItem = {
  id?: string;
  date?: string;
  description?: string;
  headline?: string;

  athlete?: {
    id?: string;
    displayName?: string;
    fullName?: string;
    headshot?: {
      href?: string;
    };
  };

  team?: {
    id?: string;
    displayName?: string;
    shortDisplayName?: string;
    logo?: string;
  };

  fromTeam?: {
    id?: string;
    displayName?: string;
    shortDisplayName?: string;
    logo?: string;
  };

  toTeam?: {
    id?: string;
    displayName?: string;
    shortDisplayName?: string;
    logo?: string;
  };
};

type TransactionsResponse = {
  transactions?: TransactionItem[];
};

const LEAGUES = [
  "eng.1",
  "esp.1",
  "ita.1",
  "ger.1",
  "fra.1",
  "uefa.champions",
  "usa.1",
  "ksa.1",
  "egy.1",
];

async function getLeagueTransactions(
  league: string
): Promise<TransactionItem[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/${league}/transactions`
    );

    if (!response.ok) {
      console.warn(
        `Transactions ${league}: ${response.status}`
      );
      return [];
    }

    const data: TransactionsResponse = await response.json();

    return data.transactions || [];
  } catch (error) {
    console.warn(`Transactions ${league} failed`, error);
    return [];
  }
}

function cleanTeamName(
  team:
    | {
        displayName?: string;
        shortDisplayName?: string;
      }
    | undefined
): string {
  return (
    team?.displayName ||
    team?.shortDisplayName ||
    "Unknown"
  );
}

function convertTransaction(
  item: TransactionItem,
  index: number
): Transfer | null {
  const player =
    item.athlete?.displayName ||
    item.athlete?.fullName;

  if (!player) {
    return null;
  }

  let from = cleanTeamName(item.fromTeam);
  let to = cleanTeamName(item.toTeam);

  const description =
    item.description ||
    item.headline ||
    "";

  /*
   * بعض استجابات ESPN قد لا ترسل fromTeam / toTeam
   * وتضع المعلومة داخل description.
   *
   * مثال:
   * "Player joins Arsenal from Chelsea"
   */

  if (
    (from === "Unknown" || to === "Unknown") &&
    description
  ) {
    const joinsMatch = description.match(
      /joins\s+(.+?)\s+from\s+(.+)/i
    );

    if (joinsMatch) {
      to = joinsMatch[1].trim();
      from = joinsMatch[2].trim();
    }

    const leavesMatch = description.match(
      /leaves\s+(.+?)\s+for\s+(.+)/i
    );

    if (leavesMatch) {
      from = leavesMatch[1].trim();
      to = leavesMatch[2].trim();
    }
  }

  return {
    id:
      item.id ||
      item.athlete?.id ||
      `transfer-${index}`,

    player,

    from,

    to,

    date: item.date
      ? new Date(item.date).toLocaleDateString(
          "en-GB"
        )
      : "2026",

    type: "Transfer",

    image: item.athlete?.headshot?.href,
  };
}

export async function getTransfers(): Promise<Transfer[]> {
  try {
    const results = await Promise.all(
      LEAGUES.map((league) =>
        getLeagueTransactions(league)
      )
    );

    const allTransactions =
      results.flat();

    const transfers = allTransactions
      .map((item, index) =>
        convertTransaction(item, index)
      )
      .filter(
        (item): item is Transfer =>
          item !== null
      );

    // إزالة الصفقات المكررة
    const uniqueTransfers = transfers.filter(
      (transfer, index, array) =>
        index ===
        array.findIndex(
          (item) =>
            item.player === transfer.player &&
            item.from === transfer.from &&
            item.to === transfer.to
        )
    );

    return uniqueTransfers.slice(0, 50);
  } catch (error) {
    console.error(
      "Transfers API Error:",
      error
    );

    return [];
  }
}

