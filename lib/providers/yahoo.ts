/**
 * Yahoo Finance Adapter — IBEX 35 & Spain 10Y Bond Yield
 *
 * ⚠️  UNOFFICIAL API — Yahoo Finance does not publish a public API.
 *     We use the undocumented quoteSummary endpoint which powers the
 *     finance.yahoo.com website. It may break without notice.
 *     Isolated behind this adapter so it's easy to swap out.
 *
 * Tickers:
 *   IBEX 35     → ^IBEX
 *   Spain 10Y   → ^ES10YT=RR  (Yahoo's code for Spanish 10Y govt bond yield)
 *
 * Env var: YAHOO_FINANCE_BASE_URL (optional override)
 *
 * TTL: 300 s (5 min) — intra-day data, rate-limit friendly
 */

import type { InstrumentQuote, InstrumentMeta } from "@/lib/comparator/types";
import { cacheFetch } from "@/lib/comparator/cache";

export const YAHOO_TTL = 300; // 5 min

const YAHOO_BASE =
  process.env.YAHOO_FINANCE_BASE_URL ??
  "https://query1.finance.yahoo.com/v8/finance/chart";

// ─── types ───────────────────────────────────────────────────────────────────

interface YahooResult {
  meta: {
    regularMarketTime: number;
    regularMarketPrice: number;
    chartPreviousClose: number;
  };
}
interface YahooResponse {
  chart: {
    result: YahooResult[] | null;
    error: { code: string; description: string } | null;
  };
}

// ─── internal fetch ──────────────────────────────────────────────────────────

async function fetchYahooQuote(
  ticker: string,
): Promise<{ value: number; prev: number; timestamp: string }> {
  const cacheKey = `yahoo:${ticker}`;
  return cacheFetch(cacheKey, YAHOO_TTL, async () => {
    const url =
      `${YAHOO_BASE}/${encodeURIComponent(ticker)}` + `?interval=1d&range=2d`;
    const t0 = Date.now();

    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; finanzas-sin-ruido/1.0)",
      },
      next: { revalidate: YAHOO_TTL },
    });
    if (!res.ok) throw new Error(`Yahoo HTTP ${res.status} for ${ticker}`);
    const json: YahooResponse = await res.json();

    if (json.chart.error) {
      throw new Error(
        `Yahoo error for ${ticker}: ${json.chart.error.description}`,
      );
    }

    const result = json.chart.result?.[0];
    if (!result) throw new Error(`Yahoo: no result for ${ticker}`);

    const value = result.meta.regularMarketPrice;
    const prev = result.meta.chartPreviousClose;
    const timestamp = new Date(
      result.meta.regularMarketTime * 1000,
    ).toISOString();
    console.info(`[yahoo:${ticker}] ${Date.now() - t0}ms value=${value}`);
    return { value, prev, timestamp };
  });
}

// ─── public adapter ──────────────────────────────────────────────────────────

export async function fetchYahoo(
  meta: InstrumentMeta,
): Promise<InstrumentQuote> {
  const ticker = meta.providerSymbol;

  try {
    const { value, prev, timestamp } = await fetchYahooQuote(ticker);
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
      timestamp,
      source: "yahoo",
    };
  } catch (err) {
    console.error(`[yahoo:${ticker}] error`, err);
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
      source: "yahoo",
      stale: true,
      error: String(err),
    };
  }
}
