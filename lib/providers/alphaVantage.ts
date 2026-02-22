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
    const url = `${AV_BASE}?function=${avFunction}&interval=daily&apikey=${key}`;

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
