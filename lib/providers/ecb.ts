/**
 * ECB Adapter — European Central Bank Statistical Data Warehouse
 *
 * Endpoints used:
 *  FX rates:  https://data-api.ecb.europa.eu/service/data/EXR/D.{CCY}.EUR.SP00.A
 *  Euribor:   https://data-api.ecb.europa.eu/service/data/FM/B.U2.EUR.RT0.MM.EURIBOR12MD_.HSTA
 *
 * ✅ Completely free — no API key required
 * ✅ Official ECB data, updated daily (business days)
 * ✅ Returns SDMX-JSON
 *
 * TTL: 3600 s (1 hour) — ECB publishes once per business day around 16:00 CET
 */

import type { InstrumentQuote, InstrumentMeta } from "@/lib/comparator/types";
import { cacheFetch } from "@/lib/comparator/cache";

export const ECB_TTL = 3_600; // 1 h

const ECB_BASE =
  process.env.ECB_BASE_URL ?? "https://data-api.ecb.europa.eu/service/data";

// ─── helpers ─────────────────────────────────────────────────────────────────

function ecbUrl(flow: string, key: string): string {
  return (
    `${ECB_BASE}/${flow}/${key}` +
    `?format=jsondata&detail=dataonly&lastNObservations=2`
  );
}

/** Parse the two most recent observations out of SDMX-JSON */
function parseLatestTwo(json: unknown): {
  latest: number | null;
  prev: number | null;
  timestamp: string;
} {
  try {
    const ds = (
      json as {
        dataSets: Array<{
          series: Record<string, { observations: Record<string, [number]> }>;
        }>;
      }
    ).dataSets[0];
    const seriesKey = Object.keys(ds.series)[0];
    const obs = ds.series[seriesKey].observations;
    const periods = (
      json as {
        structure: {
          dimensions: { observation: Array<{ values: Array<{ id: string }> }> };
        };
      }
    ).structure.dimensions.observation[0].values;

    const sortedKeys = Object.keys(obs).sort((a, b) => Number(a) - Number(b));
    if (sortedKeys.length === 0)
      return { latest: null, prev: null, timestamp: new Date().toISOString() };

    const lastKey = sortedKeys[sortedKeys.length - 1];
    const prevKey =
      sortedKeys.length > 1 ? sortedKeys[sortedKeys.length - 2] : null;

    const latest = obs[lastKey]?.[0] ?? null;
    const prev = prevKey ? (obs[prevKey]?.[0] ?? null) : null;
    const dateStr =
      periods[Number(lastKey)]?.id ?? new Date().toISOString().slice(0, 10);
    const timestamp = `${dateStr}T00:00:00Z`;

    return { latest, prev, timestamp };
  } catch {
    return { latest: null, prev: null, timestamp: new Date().toISOString() };
  }
}

function buildQuote(
  meta: InstrumentMeta,
  latest: number | null,
  prev: number | null,
  timestamp: string,
  error?: string,
): InstrumentQuote {
  const change_24h = latest !== null && prev !== null ? latest - prev : null;
  const change_24h_pct =
    change_24h !== null && prev !== null && prev !== 0
      ? (change_24h / prev) * 100
      : null;

  return {
    id: meta.id,
    category: meta.category,
    name: meta.name,
    symbol: meta.symbol,
    unit: meta.unit,
    currency: meta.currency,
    value: latest,
    change_24h,
    change_24h_pct,
    timestamp,
    source: "ecb",
    stale: error !== undefined,
    error,
  };
}

// ─── FX rates ─────────────────────────────────────────────────────────────────

/**
 * Fetch EUR/XXX from ECB for a single currency code.
 * providerSymbol is the 3-letter ISO code (e.g. "USD", "GBP").
 */
export async function fetchEcbFx(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  const ccy = meta.providerSymbol; // e.g. "USD"
  const cacheKey = `ecb:fx:${ccy}`;

  return cacheFetch(cacheKey, ECB_TTL, async () => {
    const url = ecbUrl("EXR", `D.${ccy}.EUR.SP00.A`);
    const t0 = Date.now();

    try {
      const res = await fetch(url, { next: { revalidate: ECB_TTL } });
      if (!res.ok) throw new Error(`ECB HTTP ${res.status}`);
      const json = await res.json();
      const { latest, prev, timestamp } = parseLatestTwo(json);
      console.info(`[ecb:fx:${ccy}] ${Date.now() - t0}ms value=${latest}`);
      return buildQuote(meta, latest, prev, timestamp);
    } catch (err) {
      console.error(`[ecb:fx:${ccy}] error after ${Date.now() - t0}ms`, err);
      return buildQuote(
        meta,
        null,
        null,
        new Date().toISOString(),
        String(err),
      );
    }
  });
}

// ─── Euribor 12M ─────────────────────────────────────────────────────────────

export async function fetchEcbEuribor(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  const cacheKey = "ecb:euribor12m";

  return cacheFetch(cacheKey, ECB_TTL, async () => {
    // ECB flow: FM — key: B.U2.EUR.RT0.MM.EURIBOR12MD_.HSTA
    const url = ecbUrl("FM", "B.U2.EUR.RT0.MM.EURIBOR12MD_.HSTA");
    const t0 = Date.now();

    try {
      const res = await fetch(url, { next: { revalidate: ECB_TTL } });
      if (!res.ok) throw new Error(`ECB HTTP ${res.status}`);
      const json = await res.json();
      const { latest, prev, timestamp } = parseLatestTwo(json);
      console.info(`[ecb:euribor12m] ${Date.now() - t0}ms value=${latest}`);
      return buildQuote(meta, latest, prev, timestamp);
    } catch (err) {
      console.error(`[ecb:euribor12m] error after ${Date.now() - t0}ms`, err);
      return buildQuote(
        meta,
        null,
        null,
        new Date().toISOString(),
        String(err),
      );
    }
  });
}
