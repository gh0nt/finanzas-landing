/**
 * CoinGecko Adapter — Crypto prices in EUR with 24h change
 *
 * Endpoint: https://api.coingecko.com/api/v3/simple/price
 *  ?ids={ids}&vs_currencies=eur&include_24hr_change=true
 *
 * ✅ Completely free — no API key for the public /simple/price endpoint
 * ✅ Returns EUR prices + 24h % change directly
 * ⚠️  Rate limit: ~30 req/min on free tier; we batch all coins in one call
 *
 * TTL: 60 s — CoinGecko updates prices ~every 60s
 */

import type { InstrumentQuote, InstrumentMeta } from "@/lib/comparator/types";
import { cacheFetch } from "@/lib/comparator/cache";

export const COINGECKO_TTL = 60; // 60 s

const CG_BASE =
  process.env.COINGECKO_BASE_URL ?? "https://api.coingecko.com/api/v3";

// ─── types ───────────────────────────────────────────────────────────────────

interface CgPriceEntry {
  eur: number;
  eur_24h_change?: number;
}

type CgPriceResponse = Record<string, CgPriceEntry>;

// ─── batch fetch ─────────────────────────────────────────────────────────────

const BATCH_CACHE_KEY = "coingecko:batch";

/**
 * Fetches all crypto instruments in a single API call.
 * Returns the raw CoinGecko price map, keyed by CoinGecko slug.
 */
async function fetchBatch(providerSymbols: string[]): Promise<CgPriceResponse> {
  return cacheFetch(BATCH_CACHE_KEY, COINGECKO_TTL, async () => {
    const ids = providerSymbols.join(",");
    const url =
      `${CG_BASE}/simple/price` +
      `?ids=${ids}&vs_currencies=eur&include_24hr_change=true`;
    const t0 = Date.now();

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: COINGECKO_TTL },
    });
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
    const json: CgPriceResponse = await res.json();
    console.info(`[coingecko:batch] ${Date.now() - t0}ms ids=${ids}`);
    return json;
  });
}

// ─── public adapter ──────────────────────────────────────────────────────────

/**
 * Fetch a single crypto instrument.
 * We always batch all known coins to avoid multiple round-trips.
 */
export async function fetchCoinGecko(
  meta: InstrumentMeta,
  allMetas: InstrumentMeta[],
): Promise<InstrumentQuote> {
  const slugs = allMetas
    .filter((m) => m.source === "coingecko")
    .map((m) => m.providerSymbol);

  let priceMap: CgPriceResponse;
  try {
    priceMap = await fetchBatch(slugs);
  } catch (err) {
    console.error("[coingecko] batch fetch failed", err);
    return errorQuote(meta, String(err));
  }

  const entry = priceMap[meta.providerSymbol];
  if (!entry) {
    return errorQuote(
      meta,
      `CoinGecko: symbol not found (${meta.providerSymbol})`,
    );
  }

  const value = entry.eur ?? null;
  const change_24h_pct = entry.eur_24h_change ?? null;
  const change_24h =
    value !== null && change_24h_pct !== null
      ? (value / (1 + change_24h_pct / 100)) * (change_24h_pct / 100)
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
    timestamp: new Date().toISOString(),
    source: "coingecko",
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
    source: "coingecko",
    stale: true,
    error,
  };
}
