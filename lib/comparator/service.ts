/**
 * Comparator service — routes each instrument to its correct provider adapter.
 *
 * fetchQuote(meta)     → fetches a single instrument
 * fetchQuotes(metas)   → fetches multiple instruments in parallel
 *
 * Special cases handled here:
 *  - ECB serves both FX pairs AND the Euribor 12M indicator
 *  - IBEX 35 and Spain 10Y come from Yahoo
 *  - Copper comes from Commodities-API even though it's in the metals category
 */

import type {
  InstrumentQuote,
  InstrumentMeta,
  AssetCategory,
} from "@/lib/comparator/types";
import {
  ALL_INSTRUMENTS,
  findByCategory,
  CATALOG,
} from "@/lib/comparator/catalog";
import { fetchEcbFx, fetchEcbEuribor } from "@/lib/providers/ecb";
import { fetchCoinGecko } from "@/lib/providers/coingecko";
import { fetchCommoditiesApi } from "@/lib/providers/commoditiesApi";
import { fetchMetalsApi } from "@/lib/providers/metalsApi";
import { fetchYahoo } from "@/lib/providers/yahoo";

// Pre-built sublists passed to batching adapters
const ALL_COINGECKO = ALL_INSTRUMENTS.filter((m) => m.source === "coingecko");
const ALL_COMMODITIES = ALL_INSTRUMENTS.filter(
  (m) => m.source === "commodities_api",
);
const ALL_METALS = ALL_INSTRUMENTS.filter((m) => m.source === "metals_api");

// ─── single instrument dispatch ──────────────────────────────────────────────

export async function fetchQuote(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  switch (meta.source) {
    case "ecb":
      // Distinguish FX pair vs Euribor
      if (meta.category === "fx") return fetchEcbFx(meta);
      if (meta.id === "indicators:EURIBOR12M") return fetchEcbEuribor(meta);
      break;

    case "coingecko":
      return fetchCoinGecko(meta, ALL_COINGECKO);

    case "commodities_api":
      return fetchCommoditiesApi(meta, ALL_COMMODITIES);

    case "metals_api":
      return fetchMetalsApi(meta, ALL_METALS);

    case "yahoo":
      return fetchYahoo(meta);
  }

  // Unreachable — fallback stale
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
    source: meta.source,
    stale: true,
    error: `No adapter for source "${meta.source}"`,
  };
}

// ─── parallel multi-fetch ────────────────────────────────────────────────────

/**
 * Fetch all instruments in `metas` concurrently.
 * Individual failures are caught and returned as stale quotes.
 */
export async function fetchQuotes(
  metas: InstrumentMeta[],
): Promise<InstrumentQuote[]> {
  const results = await Promise.allSettled(metas.map((m) => fetchQuote(m)));
  return results.map((r, i) => {
    if (r.status === "fulfilled") return r.value;
    const meta = metas[i];
    console.error(`[comparator] fetchQuote(${meta.id}) threw`, r.reason);
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
      source: meta.source,
      stale: true,
      error: String(r.reason),
    };
  });
}

// ─── category-level fetch ────────────────────────────────────────────────────

export async function fetchCategory(
  category: AssetCategory,
): Promise<InstrumentQuote[]> {
  const metas = findByCategory(category as keyof typeof CATALOG);
  return fetchQuotes(metas);
}

// ─── ids-level fetch ─────────────────────────────────────────────────────────

/**
 * Fetch a subset of instruments by their internal ids.
 * Unknown ids are silently ignored.
 */
export async function fetchByIds(ids: string[]): Promise<InstrumentQuote[]> {
  const metas = ids
    .map((id) => ALL_INSTRUMENTS.find((m) => m.id === id))
    .filter((m): m is InstrumentMeta => m !== undefined);
  return fetchQuotes(metas);
}
