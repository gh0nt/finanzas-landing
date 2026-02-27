/**
 * fred.ts – St. Louis Fed FRED API provider for commodity prices
 *
 * https://fred.stlouisfed.org/docs/api/fred/
 *
 * ✅ Completely free — register at https://fred.stlouisfed.org/docs/api/api_key.html
 * ✅ 120 requests / minute (very generous)
 * ✅ Daily historical data going back decades
 *
 * Set env var: FRED_API_KEY=your_key_here
 * (Never prefix with NEXT_PUBLIC_ — server-side only)
 *
 * Supported series:
 *   wti    → DCOILWTICO  (WTI Crude Oil, USD/barrel, daily)
 *   gold   → GOLDAMGBD228NLBM  (Gold Fixing Price, USD/troy oz, daily)
 *   natgas → DHHNGSP  (Henry Hub Natural Gas, USD/MMBtu, daily)
 *
 * Coffee (Colombian) is not available on FRED — shown as "sin datos".
 */

import type { IndicatorData, IndicatorPoint } from "@/lib/indicators";

const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";

/** FRED series IDs and metadata for each commodity slug */
const FRED_SERIES: Record<
  string,
  { seriesId: string; label: string; unit: string }
> = {
  wti: {
    seriesId: "DCOILWTICO",
    label: "Petróleo WTI",
    unit: "USD/barril",
  },
  gold: {
    seriesId: "GOLDAMGBD228NLBM",
    label: "Oro",
    unit: "USD/oz",
  },
  natgas: {
    seriesId: "DHHNGSP",
    label: "Gas Natural",
    unit: "USD/MMBtu",
  },
};

function getKey(): string | null {
  return process.env.FRED_API_KEY ?? null;
}

/** Format a Date as YYYY-MM-DD */
function toYMD(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function fetchFredCommodity(
  slug: string,
  maxPoints = 90,
): Promise<IndicatorData> {
  const meta = FRED_SERIES[slug];
  if (!meta) {
    return errorResult(
      slug,
      slug,
      null,
      `Commodity "${slug}" no soportado en FRED`,
    );
  }

  const key = getKey();
  if (!key) {
    return errorResult(
      slug,
      meta.label,
      meta.unit,
      "FRED_API_KEY no configurada. Regístrate gratis en https://fred.stlouisfed.org/docs/api/api_key.html",
    );
  }

  // Date range: last 150 days (to guarantee we get ~90 trading days)
  const endDate = toYMD(new Date());
  const startDate = toYMD(new Date(Date.now() - 150 * 24 * 60 * 60 * 1000));

  const url =
    `${FRED_BASE}?series_id=${meta.seriesId}` +
    `&observation_start=${startDate}` +
    `&observation_end=${endDate}` +
    `&sort_order=asc` +
    `&file_type=json` +
    `&api_key=${key}`;

  try {
    const res = await fetch(url, {
      // 12-hour revalidation — FRED updates daily
      next: { revalidate: 43_200 },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const json = await res.json();

    if (json.error_message) throw new Error(json.error_message);

    const observations: Array<{ date: string; value: string }> =
      json.observations ?? [];

    const points: IndicatorPoint[] = observations
      .filter((o) => o.value !== "." && !isNaN(parseFloat(o.value)))
      .slice(-maxPoints)
      .map((o) => ({
        t: `${o.date}T00:00:00Z`,
        v: parseFloat(o.value),
      }));

    if (points.length === 0)
      throw new Error("Sin datos en el rango solicitado");

    return {
      indicatorId: slug,
      label: meta.label,
      unit: meta.unit,
      lastUpdated: points.at(-1)!.t,
      points,
    };
  } catch (err) {
    return errorResult(slug, meta.label, meta.unit, String(err));
  }
}

function errorResult(
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
