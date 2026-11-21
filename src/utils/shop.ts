// src/utils/shop.ts — TUNED from Bayo's chunk helpers.
// What changed from Bayo:
// - REMOVED: API_URL, /api/* calls, tracking, live websocket, call widget,
//   Paystack/Flutterwave checkout guards. This file is pure formatting only.
// - KEPT: the money / size / name helpers, because they are just maths.
// - No product, price or content is invented here. Prices come in as props.

export type ShopKind = "class" | "ebook" | "source";

export function nairaLabel(amount: number): string {
  return `₦${Math.round(amount).toLocaleString("en-NG")}`;
}

export function moneyLabel(amount: number, currency: string): string {
  if (currency === "NGN") return nairaLabel(amount);
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount).toLocaleString("en")}`;
  }
}

export function countLabel(count: number): string {
  return count.toLocaleString("en-NG");
}

export function humanSize(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function zipName(fileName: string | undefined, title: string): string {
  if (fileName) return fileName;
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "source-code"}.zip`;
}

export function productTypeOf(kind: ShopKind): string {
  return kind === "class" ? "course" : kind;
}

// Price display only. No backend, no currency conversion, no checkout.
// Pass priceLabel from your own data, e.g. "₦5,000" or "Free" or "Coming soon".
export function priceLabelFor(
  price: number | null,
  priceText?: string,
  available?: boolean,
): string {
  if (price !== null && price > 0) return nairaLabel(price);
  if (priceText) return priceText;
  if (available) return "Free";
  return "Coming soon";
}

export type PurchaseMode = "pay" | "free" | "link" | "soon";

export function purchaseModeFor(
  available: boolean,
  price: number | null,
  externalUrl?: string,
): PurchaseMode {
  if (externalUrl) return "link";
  if (available && price !== null && price > 0) return "pay";
  if (available) return "free";
  return "soon";
}

// The device timezone leads the display choice. Language and IP country
// also contribute, but neither a VPN nor an IP lookup alone can override
// a known timezone. Without a timezone, the other signals decide.

export type SupportCurrency = "USD" | "NGN";

export type SupportCurrencyConfig = {
  symbol: string;
  label: string;
  sublabel: string;
  presets: number[];
  min: number;
  max: number;
};

export const SUPPORT_CURRENCIES: Record<
  SupportCurrency,
  SupportCurrencyConfig
> = {
  USD: {
    symbol: "$",
    label: "US dollars",
    sublabel: "Card or eligible digital wallet",
    presets: [5, 10, 25, 50],
    min: 2,
    max: 3500,
  },
  NGN: {
    symbol: "₦",
    label: "Naira",
    sublabel: "Card, bank transfer or eligible wallet",
    presets: [2000, 5000, 10000, 20000],
    min: 500,
    max: 5000000,
  },
};

export function detectSupportCurrency(ipCountry?: string): SupportCurrency {
  const votes: SupportCurrency[] = [];

  // 2) Timezone family — one vote. The offset confirms the zone
  //    instead of voting separately: Lagos must be UTC+1.
  let timeZone = "";
  try {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    timeZone = "";
  }
  let timezoneVote: SupportCurrency | null = null;
  if (timeZone === "Africa/Lagos") {
    if (new Date().getTimezoneOffset() === -60) timezoneVote = "NGN";
    // Lagos zone with any other offset is inconsistent data —
    // this family abstains rather than voting on a spoof.
  } else if (timeZone) {
    timezoneVote = "USD";
  }
  if (timezoneVote) votes.push(timezoneVote, timezoneVote);

  // 3) Language family — one vote.
  if (typeof navigator !== "undefined") {
    const languages = (
      navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language || ""]
    ).map((language) => language.toLowerCase());
    if (
      languages.some(
        (language) => language === "en-ng" || language.startsWith("en-ng-"),
      )
    ) {
      votes.push("NGN");
    } else if (languages.some((language) => language.length > 0)) {
      votes.push("USD");
    }
  }

  // 4) IP family — one vote, only when a caller supplies a
  //    country (a VPN can spoof it, so it never votes alone
  //    into a win: it needs another family agreeing with it).
  if (ipCountry) {
    votes.push(ipCountry.toUpperCase() === "NG" ? "NGN" : "USD");
  }

  const nigeriaVotes = votes.filter((vote) => vote === "NGN").length;
  const outsideVotes = votes.length - nigeriaVotes;
  if (nigeriaVotes > outsideVotes) return "NGN";
  if (outsideVotes > nigeriaVotes) return "USD";
  // Tie (or no votes): location decides — the timezone family if
  // it voted, otherwise the global default.
  return timezoneVote ?? "USD";
}

export function formatCurrencyAmount(
  amount: number,
  currency: SupportCurrency,
): string {
  const symbol = SUPPORT_CURRENCIES[currency].symbol;
  return `${symbol}${Math.round(amount).toLocaleString("en-NG")}`;
}
