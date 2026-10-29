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
