/**
 * fxCdn.ts – Free FX historical data provider
 *
 * Source: @fawazahmed0/currency-api served via jsDelivr CDN
 * https://github.com/fawazahmed0/exchange-api
 *
 * ✅ Completely free – no API key required
 * ✅ Updated daily (ECB / IMF sourced)
 * ✅ Supports EUR and 160+ currencies
 * ✅ No rate limits (CDN-backed)
 *
 * Strategy: fetch the last `days` daily snapshots in parallel using the
 * USD base file, then compute any pair via cross-rate arithmetic so we
 * issue only `days` total HTTP requests for ALL currency pairs combined.
 *
 *   USD/EUR = 1 / usd_eur
 *   EUR/USD = usd_eur (inverse)
 *   GBP/EUR = usd_eur / usd_gbp
 *   BRL/EUR = usd_eur / usd_brl
 */

import type { IndicatorData, IndicatorPoint } from "@/lib/indicators";

const CDN_BASE = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api";

// Static revalidate values used by callers
export const FX_CDN_REVALIDATE = 43_200; // 12 h – each daily file is immutable after it's published

/** Currency labels & units for pairs we support */
const PAIR_META: Record<string, { label: string; unit: string }> = {
  "usd-eur": { label: "USD/EUR", unit: "EUR" },
  "eur-usd": { label: "EUR/USD", unit: "USD" },
  "gbp-eur": { label: "GBP/EUR", unit: "EUR" },
  "brl-eur": { label: "BRL/EUR", unit: "EUR" },
  "gbp-usd": { label: "GBP/USD", unit: "USD" },
  "usd-jpy": { label: "USD/JPY", unit: "JPY" },
};

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Fetch all USD rates for a specific date from the CDN.
 * Returns null on any error (weekend gap, network issue, etc.).
 */
async function fetchDayRates(
  dateStr: string,
): Promise<Record<string, number> | null> {
  const tag = dateStr === "latest" ? "latest" : dateStr;
  const url = `${CDN_BASE}@${tag}/v1/currencies/usd.json`;
  try {
    const res = await fetch(url, {
      next: {
        // Historical dates are immutable; "latest" updates daily
        revalidate: dateStr === "latest" ? 43_200 : 31_536_000, // 12h or 1y
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.usd as Record<string, number>) ?? null;
  } catch {
    return null;
  }
}

/**
 * Build a time-series for `fromSymbol/toSymbol` over the last `days` days.
 * All cross-rates are computed from the USD base to minimise HTTP requests.
 */
export async function fetchFxHistory(
  fromSymbol: string,
  toSymbol: string,
  days = 30,
): Promise<IndicatorData> {
  const from = fromSymbol.toLowerCase();
  const to = toSymbol.toLowerCase();
  const id = `${from}-${to}`;
  const meta = PAIR_META[id] ?? {
    label: `${fromSymbol}/${toSymbol}`,
    unit: toSymbol,
  };

  // Build list of dates: today going back `days` days
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    dates.push(formatDate(d));
  }

  // Fetch all days in parallel – CDN handles concurrent requests fine
  const dailyRates = await Promise.all(dates.map((d) => fetchDayRates(d)));

  const points: IndicatorPoint[] = [];

  for (let i = 0; i < dates.length; i++) {
    const rates = dailyRates[i];
    if (!rates) continue; // skip missing day (holiday gap, etc.)

    let value: number | null = null;

    if (from === "usd") {
      // USD → to  (direct)
      value = rates[to] ?? null;
    } else if (to === "usd") {
      // from → USD  (inverse)
      value = rates[from] ? 1 / rates[from] : null;
    } else {
      // Cross-rate: from/to = usd_to / usd_from
      // Example: GBP/EUR = rates["eur"] / rates["gbp"]
      value =
        rates[to] != null && rates[from] != null
          ? rates[to] / rates[from]
          : null;
    }

    if (value !== null && isFinite(value)) {
      points.push({ t: `${dates[i]}T00:00:00Z`, v: value });
    }
  }

  if (points.length === 0) {
    return {
      indicatorId: id,
      label: meta.label,
      unit: meta.unit,
      lastUpdated: new Date().toISOString(),
      points: [],
      stale: true,
      error: "No se pudieron cargar los datos de tipo de cambio del CDN",
    };
  }

  return {
    indicatorId: id,
    label: meta.label,
    unit: meta.unit,
    lastUpdated: points.at(-1)!.t,
    points,
  };
}
