/**
 * Alpha Vantage data provider.
 *
 * API key is read server-side only (never exposed to the browser).
 * Set ALPHA_VANTAGE_KEY in your .env file.
 *
 * RATE LIMITS (free tier):
 *   - 25 requests / day
 *   - 5 requests / minute
 *
 * All fetches use Next.js fetch caching with revalidate so the actual
 * upstream calls are bounded per cache window, not per page request.
 */

import type { IndicatorData, IndicatorPoint } from "@/lib/indicators";

const AV_BASE = "https://www.alphavantage.co/query";

/** Revalidation window in seconds (4 hours – adjust for production). */
export const FX_REVALIDATE = 14_400; // 4 h
export const COMMODITY_REVALIDATE = 21_600; // 6 h

function getKey(): string {
  const key = process.env.ALPHA_VANTAGE_KEY;
  if (!key) throw new Error("ALPHA_VANTAGE_KEY env var is not set");
  return key;
}

// ─────────────────────────────────────────────────────────────────────────────
// FX_DAILY  →  daily historical rates for a currency pair
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchFxDaily(
  fromSymbol: string,
  toSymbol: string,
  maxPoints = 90,
): Promise<IndicatorData> {
  const id = `${fromSymbol.toLowerCase()}-${toSymbol.toLowerCase()}`;
  const label = `${fromSymbol}/${toSymbol}`;

  try {
    const key = getKey();
    const url =
      `${AV_BASE}?function=FX_DAILY` +
      `&from_symbol=${fromSymbol}&to_symbol=${toSymbol}` +
      `&outputsize=compact&apikey=${key}`;

    const res = await fetch(url, { next: { revalidate: FX_REVALIDATE } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    // Alpha Vantage returns an error object when rate-limited or key is wrong
    if (json["Note"] || json["Information"] || json["Error Message"]) {
      const msg: string =
        json["Note"] ?? json["Information"] ?? json["Error Message"];
      return staleResult(id, label, toSymbol, msg);
    }

    const series: Record<string, Record<string, string>> = json[
      "Time Series FX (Daily)"
    ];
    if (!series) throw new Error("Unexpected response shape");

    // Dates come newest-first; reverse to oldest-first and take the last N
    const dates = Object.keys(series).sort();
    const points: IndicatorPoint[] = dates.slice(-maxPoints).map((date) => ({
      t: `${date}T00:00:00Z`,
      v: parseFloat(series[date]["4. close"]),
    }));

    const lastUpdated =
      points[points.length - 1]?.t ?? new Date().toISOString();

    return {
      indicatorId: id,
      label,
      unit: toSymbol,
      lastUpdated,
      points,
    };
  } catch (err) {
    return staleResult(id, label, toSymbol, String(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Commodity functions  (WTI, BRENT, NATURAL_GAS, COPPER, COFFEE, etc.)
// Ref: https://www.alphavantage.co/documentation/#commodities
// ─────────────────────────────────────────────────────────────────────────────

/** Maps the commodity slug used in our API to the Alpha Vantage function name */
const COMMODITY_AV_FUNCTION: Record<string, string> = {
  wti: "WTI",
  brent: "BRENT",
  "natural-gas": "NATURAL_GAS",
  copper: "COPPER",
  coffee: "COFFEE",
  sugar: "SUGAR",
  corn: "CORN",
  wheat: "WHEAT",
  cotton: "COTTON",
  aluminum: "ALUMINUM",
};

/**
 * Interval supported by each AV commodity function.
 * Energy (WTI, BRENT, NATURAL_GAS) → daily/weekly/monthly.
 * Agriculture & metals (WHEAT, CORN, SUGAR, COFFEE, COPPER, ALUMINUM…) → monthly only.
 */
const COMMODITY_AV_INTERVAL: Record<string, "daily" | "monthly"> = {
  WTI: "monthly",
  BRENT: "monthly",
  NATURAL_GAS: "monthly",
  COPPER: "monthly",
  ALUMINUM: "monthly",
  COFFEE: "monthly",
  SUGAR: "monthly",
  CORN: "monthly",
  WHEAT: "monthly",
  COTTON: "monthly",
};

/** Friendly labels and units for our slugs */
const COMMODITY_META: Record<string, { label: string; unit: string }> = {
  wti: { label: "Petróleo WTI", unit: "USD/barril" },
  brent: { label: "Petróleo Brent", unit: "USD/barril" },
  "natural-gas": { label: "Gas Natural", unit: "USD/MMBtu" },
  copper: { label: "Cobre", unit: "USD/libra" },
  coffee: { label: "Café", unit: "USD/libra" },
  sugar: { label: "Azúcar", unit: "USD/libra" },
  corn: { label: "Maíz", unit: "USD/bushel" },
  wheat: { label: "Trigo", unit: "USD/bushel" },
  cotton: { label: "Algodón", unit: "USD/libra" },
};

export async function fetchCommodity(
  slug: string,
  maxPoints = 90,
): Promise<IndicatorData> {
  const avFunction = COMMODITY_AV_FUNCTION[slug];
  const meta = COMMODITY_META[slug];

  if (!avFunction || !meta) {
    return staleResult(slug, slug, null, `Commodity "${slug}" no soportado`);
  }

  try {
    const key = getKey();
    const interval = COMMODITY_AV_INTERVAL[avFunction] ?? "monthly";
    const url = `${AV_BASE}?function=${avFunction}&interval=${interval}&apikey=${key}`;

    const res = await fetch(url, {
      next: { revalidate: COMMODITY_REVALIDATE },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    if (json["Note"] || json["Information"] || json["Error Message"]) {
      const msg: string =
        json["Note"] ?? json["Information"] ?? json["Error Message"];
      return staleResult(slug, meta.label, meta.unit, msg);
    }

    const data: Array<{ date: string; value: string }> = json["data"];
    if (!Array.isArray(data)) throw new Error("Unexpected response shape");

    const points: IndicatorPoint[] = data
      .filter((d) => d.value !== "." && !isNaN(parseFloat(d.value)))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-maxPoints)
      .map((d) => ({
        t: `${d.date}T00:00:00Z`,
        v: parseFloat(d.value),
      }));

    const lastUpdated =
      points[points.length - 1]?.t ?? new Date().toISOString();

    return {
      indicatorId: slug,
      label: meta.label,
      unit: meta.unit,
      lastUpdated,
      points,
    };
  } catch (err) {
    return staleResult(slug, meta.label, meta.unit, String(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Gold via FX_DAILY (XAU → USD)
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchGold(maxPoints = 90): Promise<IndicatorData> {
  const base = await fetchFxDaily("XAU", "USD", maxPoints);
  return {
    ...base,
    indicatorId: "gold",
    label: "Oro",
    unit: "USD/oz",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper – build a stale/error result
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Comparator adapters — return InstrumentQuote instead of IndicatorData
// These are called by lib/comparator/service.ts for energy/metals/agriculture
// and for the IBEX 35 indicator.
// ─────────────────────────────────────────────────────────────────────────────

import type { InstrumentQuote, InstrumentMeta } from "@/lib/comparator/types";
import { cacheFetch } from "@/lib/comparator/cache";

export const AV_COMPARATOR_TTL = 21_600; // 6 h — stays within 25 req/day budget

/** AV commodity function names (used as providerSymbol in catalog) */
const AV_COMMODITY_FUNCTIONS = new Set([
  "WTI",
  "BRENT",
  "NATURAL_GAS",
  "COPPER",
  "COFFEE",
  "CORN",
  "WHEAT",
  "SUGAR",
  "COTTON",
  "ALUMINUM",
]);

/** Precious-metal tickers served via GOLD_SILVER_SPOT endpoint */
const AV_SPOT_METALS = new Set(["XAU", "XAG"]);

function avErrorQuote(meta: InstrumentMeta, error: string): InstrumentQuote {
  return {
    id: meta.id,
    category: meta.category,
    name: meta.name,
    symbol: meta.symbol,
    unit: meta.unit,
    currency: meta.currency,
    value: null,
    change_24h: null,
    change_24h_pct: null,
    timestamp: new Date().toISOString(),
    source: "alpha_vantage",
    stale: true,
    error,
  };
}

/** Precious metals via GOLD_SILVER_SPOT (XAU, XAG) */
async function fetchAVGoldSilverSpot(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  const symbol = meta.providerSymbol; // "XAU" or "XAG"
  const cacheKey = `av_comparator:spot:${symbol}`;

  return cacheFetch(cacheKey, AV_COMPARATOR_TTL, async () => {
    const key = getKey();
    const url =
      `${AV_BASE}?function=GOLD_SILVER_SPOT` +
      `&symbol=${symbol}&apikey=${key}`;
    const res = await fetch(url, { next: { revalidate: AV_COMPARATOR_TTL } });
    if (!res.ok) throw new Error(`AV HTTP ${res.status}`);
    const json = await res.json();

    if (json["Note"] || json["Information"] || json["Error Message"]) {
      const msg: string =
        json["Note"] ?? json["Information"] ?? json["Error Message"];
      throw new Error(msg);
    }

    // Response shape: { "Realtime Gold/Silver Spot Price": { "2. Price": "...", "4. Last Updated": "..." } }
    const spot =
      json["Realtime Gold/Silver Spot Price"] ??
      json["Realtime Metals Spot Price"];
    if (!spot || !spot["2. Price"])
      throw new Error("GOLD_SILVER_SPOT: unexpected response shape");

    const value = parseFloat(spot["2. Price"]);
    if (isNaN(value)) throw new Error("GOLD_SILVER_SPOT: non-numeric price");

    return {
      id: meta.id,
      category: meta.category,
      name: meta.name,
      symbol: meta.symbol,
      unit: meta.unit,
      currency: meta.currency,
      value,
      change_24h: null,
      change_24h_pct: null,
      timestamp: spot["4. Last Updated"]
        ? new Date(spot["4. Last Updated"]).toISOString()
        : new Date().toISOString(),
      source: "alpha_vantage" as const,
      stale: false,
    };
  });
}

/** Commodity endpoint (WTI, BRENT, NATURAL_GAS, COPPER, COFFEE, CORN, WHEAT…) */
async function fetchAVCommodityQuote(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  const fn = meta.providerSymbol; // e.g. "WTI", "BRENT"
  const cacheKey = `av_comparator:commodity:${fn}`;

  return cacheFetch(cacheKey, AV_COMPARATOR_TTL, async () => {
    const key = getKey();
    const interval = COMMODITY_AV_INTERVAL[fn] ?? "monthly";
    const url = `${AV_BASE}?function=${fn}&interval=${interval}&apikey=${key}`;
    const res = await fetch(url, { next: { revalidate: AV_COMPARATOR_TTL } });
    if (!res.ok) throw new Error(`AV HTTP ${res.status}`);
    const json = await res.json();

    if (json["Note"] || json["Information"] || json["Error Message"]) {
      const msg: string =
        json["Note"] ?? json["Information"] ?? json["Error Message"];
      throw new Error(msg);
    }

    const data: Array<{ date: string; value: string }> = json["data"];
    if (!Array.isArray(data) || data.length === 0)
      throw new Error("No data in AV commodity response");

    // Filter out placeholder "." entries (current month not yet published by EIA)
    const valid = data.filter(
      (d) => d.value !== "." && d.value !== "" && !isNaN(parseFloat(d.value)),
    );
    if (valid.length === 0) throw new Error("All data points are placeholders");
    const latestRaw = valid[0];
    const prevRaw = valid.length > 1 ? valid[1] : null;

    const value = parseFloat(latestRaw.value);
    const prevValue = prevRaw ? parseFloat(prevRaw.value) : null;

    const change_24h = prevValue !== null ? value - prevValue : null;
    const change_24h_pct =
      change_24h !== null && prevValue !== null && prevValue !== 0
        ? (change_24h / prevValue) * 100
        : null;

    return {
      id: meta.id,
      category: meta.category,
      name: meta.name,
      symbol: meta.symbol,
      unit: meta.unit,
      currency: meta.currency,
      value,
      change_24h,
      change_24h_pct,
      timestamp: `${latestRaw.date}T00:00:00Z`,
      source: "alpha_vantage" as const,
      stale: false,
    };
  });
}

/** Precious metals via FX_DAILY (XAU/USD, XAG/USD, XPT/USD) */
async function fetchAVMetalQuote(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  const metalSymbol = meta.providerSymbol; // e.g. "XAU"
  const cacheKey = `av_comparator:metal:${metalSymbol}`;

  return cacheFetch(cacheKey, AV_COMPARATOR_TTL, async () => {
    const key = getKey();
    const url =
      `${AV_BASE}?function=FX_DAILY` +
      `&from_symbol=${metalSymbol}&to_symbol=USD` +
      `&outputsize=compact&apikey=${key}`;
    const res = await fetch(url, { next: { revalidate: AV_COMPARATOR_TTL } });
    if (!res.ok) throw new Error(`AV HTTP ${res.status}`);
    const json = await res.json();

    if (json["Note"] || json["Information"] || json["Error Message"]) {
      const msg: string =
        json["Note"] ?? json["Information"] ?? json["Error Message"];
      throw new Error(msg);
    }

    const series: Record<string, Record<string, string>> = json[
      "Time Series FX (Daily)"
    ];
    if (!series) throw new Error("Unexpected AV FX response shape");

    const dates = Object.keys(series).sort().reverse(); // newest first
    if (dates.length === 0) throw new Error("No data in AV FX response");

    const latest = dates[0];
    const prev = dates.length > 1 ? dates[1] : null;

    const value = parseFloat(series[latest]["4. close"]);
    const prevValue = prev ? parseFloat(series[prev]["4. close"]) : null;

    const change_24h = prevValue !== null ? value - prevValue : null;
    const change_24h_pct =
      change_24h !== null && prevValue !== null && prevValue !== 0
        ? (change_24h / prevValue) * 100
        : null;

    return {
      id: meta.id,
      category: meta.category,
      name: meta.name,
      symbol: meta.symbol,
      unit: meta.unit,
      currency: meta.currency,
      value,
      change_24h,
      change_24h_pct,
      timestamp: `${latest}T00:00:00Z`,
      source: "alpha_vantage" as const,
      stale: false,
    };
  });
}

/** Index / equity via GLOBAL_QUOTE (e.g. IBEX 35 → ^IBEX) */
async function fetchAVGlobalQuote(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  const symbol = meta.providerSymbol;
  const cacheKey = `av_comparator:global:${symbol}`;

  return cacheFetch(cacheKey, 300, async () => {
    const key = getKey();
    const url =
      `${AV_BASE}?function=GLOBAL_QUOTE` +
      `&symbol=${encodeURIComponent(symbol)}&apikey=${key}`;
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`AV HTTP ${res.status}`);
    const json = await res.json();

    if (json["Note"] || json["Information"] || json["Error Message"]) {
      const msg: string =
        json["Note"] ?? json["Information"] ?? json["Error Message"];
      throw new Error(msg);
    }

    const q = json["Global Quote"];
    if (!q || !q["05. price"])
      throw new Error("GLOBAL_QUOTE: no price in response");

    const value = parseFloat(q["05. price"]);
    const prev = parseFloat(q["08. previous close"]);
    const change_24h = value - prev;
    const change_24h_pct = prev !== 0 ? (change_24h / prev) * 100 : null;

    return {
      id: meta.id,
      category: meta.category,
      name: meta.name,
      symbol: meta.symbol,
      unit: meta.unit,
      currency: meta.currency,
      value,
      change_24h,
      change_24h_pct,
      timestamp: `${q["07. latest trading day"]}T00:00:00Z`,
      source: "alpha_vantage" as const,
      stale: false,
    };
  });
}

/**
 * Public dispatch: routes to the correct AV sub-adapter
 * based on providerSymbol.
 */
export async function fetchAlphaVantageQuote(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  try {
    if (AV_SPOT_METALS.has(meta.providerSymbol)) {
      return await fetchAVGoldSilverSpot(meta);
    }
    if (AV_COMMODITY_FUNCTIONS.has(meta.providerSymbol)) {
      return await fetchAVCommodityQuote(meta);
    }
    // Fallback: GLOBAL_QUOTE (indices, equities)
    return await fetchAVGlobalQuote(meta);
  } catch (err) {
    console.error(`[alpha_vantage:comparator] error for ${meta.id}`, err);
    return avErrorQuote(meta, String(err));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper – build a stale/error result
// ─────────────────────────────────────────────────────────────────────────────

function staleResult(
  indicatorId: string,
  label: string,
  unit: string | null,
  error: string,
): IndicatorData {
  return {
    indicatorId,
    label,
    unit,
    lastUpdated: new Date().toISOString(),
    points: [],
    stale: true,
    error,
  };
}
