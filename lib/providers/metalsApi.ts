/**
 * Metals-API Adapter
 *
 * https://metals-api.com/documentation
 *
 * Endpoint: GET https://metals-api.com/api/latest
 *   ?access_key={key}&base=USD&symbols={XAU,XAG,XPT}
 *
 * ✅ Freemium — free tier: latest rates for precious metals
 * ⚠️  Rates are returned as units of metal per 1 USD (must invert)
 *
 * Env var: METALS_API_KEY (required)
 *
 * TTL: 300 s (5 min)
 *
 * Symbols used:
 *   XAU  → Gold (troy oz)
 *   XAG  → Silver (troy oz)
 *   XPT  → Platinum (troy oz)
 */

import type { InstrumentQuote, InstrumentMeta } from "@/lib/comparator/types";
import { cacheFetch } from "@/lib/comparator/cache";

export const METALS_TTL = 300; // 5 min

const BASE_URL = "https://metals-api.com/api/latest";

function getKey(): string | null {
  return process.env.METALS_API_KEY ?? null;
}

// ─── types ───────────────────────────────────────────────────────────────────

interface MetalsApiResponse {
  success: boolean;
  base: string;
  timestamp: number;
  rates: Record<string, number>;
}

// ─── batch fetch ─────────────────────────────────────────────────────────────

async function fetchBatch(
  symbols: string[],
): Promise<{ rates: Record<string, number>; timestamp: number } | null> {
  const key = getKey();
  if (!key) {
    console.warn("[metals_api] METALS_API_KEY not set");
    return null;
  }

  const cacheKey = `metals_api:batch:${symbols.sort().join(",")}`;
  return cacheFetch(cacheKey, METALS_TTL, async () => {
    const url =
      `${BASE_URL}?access_key=${key}` +
      `&base=USD&symbols=${symbols.join(",")}`;
    const t0 = Date.now();

    const res = await fetch(url, { next: { revalidate: METALS_TTL } });
    if (!res.ok) throw new Error(`Metals-API HTTP ${res.status}`);
    const json: MetalsApiResponse = await res.json();
    if (!json.success) throw new Error("Metals-API returned success:false");
    console.info(
      `[metals_api] ${Date.now() - t0}ms symbols=${symbols.join(",")}`,
    );
    return { rates: json.rates, timestamp: json.timestamp };
  });
}

// ─── public adapter ──────────────────────────────────────────────────────────

export async function fetchMetalsApi(
  meta: InstrumentMeta,
  allMetas: InstrumentMeta[],
): Promise<InstrumentQuote> {
  const symbols = allMetas
    .filter((m) => m.source === "metals_api")
    .map((m) => m.providerSymbol);

  let batch: { rates: Record<string, number>; timestamp: number } | null;
  try {
    batch = await fetchBatch(symbols);
  } catch (err) {
    console.error("[metals_api] batch fetch failed", err);
    return errorQuote(meta, String(err));
  }

  if (!batch) {
    return errorQuote(meta, "METALS_API_KEY no configurada");
  }

  // Metals-API rates: amount of XAU/XAG per 1 USD  →  invert to get USD/oz
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
    change_24h: null,
    change_24h_pct: null,
    timestamp: new Date(batch.timestamp * 1000).toISOString(),
    source: "metals_api",
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
    source: "metals_api",
    stale: true,
    error,
  };
}
