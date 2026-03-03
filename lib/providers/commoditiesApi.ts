/**
 * Commodities-API Adapter
 *
 * https://commodities-api.com/documentation
 *
 * Endpoint: GET https://commodities-api.com/api/latest
 *   ?access_key={key}&base=USD&symbols={BRENT,WTI,NG,...}
 *
 * ✅ Freemium — free tier gives latest rates, 1 req/min
 * ⚠️  base always USD on free tier
 *
 * Env var: COMMODITIES_API_KEY (required)
 *
 * TTL: 300 s (5 min) — free tier rate limit is lenient but we cache generously
 *
 * Supported symbols used in our catalog:
 *   BRENT, WTI, NG, API2, COPPER, COFFEE, WHEAT, CORN, COCOA
 */

import type { InstrumentQuote, InstrumentMeta } from "@/lib/comparator/types";
import { cacheFetch } from "@/lib/comparator/cache";

export const COMMODITY_TTL = 300; // 5 min

const BASE_URL = "https://commodities-api.com/api/latest";

function getKey(): string | null {
  return process.env.COMMODITIES_API_KEY ?? null;
}

// ─── types ───────────────────────────────────────────────────────────────────

interface CommoditiesApiResponse {
  data: {
    success: boolean;
    base: string;
    timestamp: number;
    rates: Record<string, number>;
  };
}

// ─── batch fetch ─────────────────────────────────────────────────────────────

async function fetchBatch(
  symbols: string[],
): Promise<{ rates: Record<string, number>; timestamp: number } | null> {
  const key = getKey();
  if (!key) {
    console.warn("[commodities_api] COMMODITIES_API_KEY not set");
    return null;
  }

  const cacheKey = `commodities_api:batch:${symbols.sort().join(",")}`;
  return cacheFetch(cacheKey, COMMODITY_TTL, async () => {
    const url =
      `${BASE_URL}?access_key=${key}` +
      `&base=USD&symbols=${symbols.join(",")}`;
    const t0 = Date.now();

    const res = await fetch(url, { next: { revalidate: COMMODITY_TTL } });
    if (!res.ok) throw new Error(`Commodities-API HTTP ${res.status}`);
    const json: CommoditiesApiResponse = await res.json();
    if (!json.data.success)
      throw new Error("Commodities-API returned success:false");
    console.info(
      `[commodities_api] ${Date.now() - t0}ms symbols=${symbols.join(",")}`,
    );
    return { rates: json.data.rates, timestamp: json.data.timestamp };
  });
}

// ─── public adapter ──────────────────────────────────────────────────────────

export async function fetchCommoditiesApi(
  meta: InstrumentMeta,
  allMetas: InstrumentMeta[],
): Promise<InstrumentQuote> {
  const symbols = allMetas
    .filter((m) => m.source === "commodities_api")
    .map((m) => m.providerSymbol);

  let batch: { rates: Record<string, number>; timestamp: number } | null;
  try {
    batch = await fetchBatch(symbols);
  } catch (err) {
    console.error("[commodities_api] batch fetch failed", err);
    return errorQuote(meta, String(err));
  }

  if (!batch) {
    const msg = "COMMODITIES_API_KEY no configurada";
    return errorQuote(meta, msg);
  }

  // Commodities-API returns rates as 1/price (amount of commodity per $1)
  // We invert to get price in USD.
  const raw = batch.rates[meta.providerSymbol];
  const value = raw != null && raw !== 0 ? 1 / raw : null;

  return {
    id: meta.id,
    category: meta.category,
    name: meta.name,
    symbol: meta.symbol,
    unit: meta.unit,
    currency: meta.currency,
    value,
    change_24h: null, // free tier doesn't provide change
    change_24h_pct: null,
    timestamp: new Date(batch.timestamp * 1000).toISOString(),
    source: "commodities_api",
    stale: value === null,
    error:
      value === null
        ? `Symbol ${meta.providerSymbol} not in response`
        : undefined,
  };
}

function errorQuote(meta: InstrumentMeta, error: string): InstrumentQuote {
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
    source: "commodities_api",
    stale: true,
    error,
  };
}
