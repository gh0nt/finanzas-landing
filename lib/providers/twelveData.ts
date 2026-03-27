/**
 * twelveData.ts – Twelve Data API provider for European market indicators
 *
 * Fetches:
 *   - Euro Stoxx 50  (symbol: EUSTX50)
 *   - DAX Germany    (symbol: DAX)
 *   - German Bund 10Y (symbol: DE10Y)
 *   - Bitcoin (ticker: BTC-USD from Yahoo Finance)
 *
 * Free tier: 800 requests/day.  Two fetch calls are made per indicator
 * (quote + time_series), so the caller MUST cache at the route level.
 *
 * Cache strategy:
 *   - Quote     → next: { revalidate: 600 }   (10 min)
 *   - Time series → next: { revalidate: 86400 } (24 h – historical data)
 */

import type { IndicatorData, IndicatorPoint } from "@/lib/indicators";

const BASE_URL = "https://api.twelvedata.com";

export const TWELVE_DATA_QUOTE_REVALIDATE = 600; // 10 min
export const TWELVE_DATA_SERIES_REVALIDATE = 86400; // 24 h

// ─── Twelve Data response shapes ─────────────────────────────────────────────

interface TwelveDataQuote {
  symbol: string;
  name: string;
  exchange: string;
  currency: string;
  datetime: string;
  close: string;
  change: string;
  percent_change: string;
  previous_close: string;
  is_market_open: boolean;
  /** Present when the API returns an error */
  status?: string;
  message?: string;
  code?: number;
}

interface TwelveDataSeriesValue {
  datetime: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume?: string;
}

interface TwelveDataTimeSeries {
  meta?: {
    symbol: string;
    interval: string;
    currency: string;
  };
  values?: TwelveDataSeriesValue[];
  status?: string;
  message?: string;
  code?: number;
}

// ─── Indicator configuration ──────────────────────────────────────────────────

export interface EuropeanIndicatorConfig {
  indicatorId: string;
  symbol: string;
  label: string;
  description: string;
  unit: string | null;
}

export const EUROPEAN_INDICATORS: Record<string, EuropeanIndicatorConfig> = {
  "euro-stoxx-50": {
    indicatorId: "euro-stoxx-50",
    symbol: "EUSTX50",
    label: "EURO STOXX 50",
    description: "Eurozone Main Index",
    unit: "Pts",
  },
  dax: {
    indicatorId: "dax",
    symbol: "DAX",
    label: "DAX (Alemania)",
    description: "Frankfurt Stock Exchange",
    unit: "Pts",
  },
  "german-bund-10y": {
    indicatorId: "german-bund-10y",
    symbol: "DE10Y",
    label: "Bono Alemán 10A",
    description: "European Benchmark Bond",
    unit: "%",
  },
  bitcoin: {
    indicatorId: "bitcoin",
    symbol: "BTC-USD",
    label: "Bitcoin",
    description: "Precio spot BTC/USD",
    unit: "USD",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeFallback(
  cfg: EuropeanIndicatorConfig,
  error: string,
): IndicatorData {
  return {
    indicatorId: cfg.indicatorId,
    label: cfg.label,
    unit: cfg.unit,
    lastUpdated: new Date().toISOString(),
    points: [],
    stale: true,
    error,
  };
}

/** Parse a Twelve Data datetime string (may have a space instead of "T"). */
function parseDateTime(raw: string): string {
  return new Date(raw.replace(" ", "T")).toISOString();
}

// ─── Raw API calls ────────────────────────────────────────────────────────────

async function fetchQuote(
  symbol: string,
  apiKey: string,
): Promise<TwelveDataQuote> {
  const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${apiKey}`;
  const res = await fetch(url, {
    next: { revalidate: TWELVE_DATA_QUOTE_REVALIDATE },
  });
  if (!res.ok) throw new Error(`Quote HTTP ${res.status} for ${symbol}`);

  const data: TwelveDataQuote = await res.json();
  if (data.status === "error" || data.code !== undefined) {
    throw new Error(data.message ?? `Quote error for ${symbol}`);
  }
  return data;
}

async function fetchTimeSeries(
  symbol: string,
  apiKey: string,
  outputsize = 30,
): Promise<TwelveDataTimeSeries> {
  const url =
    `${BASE_URL}/time_series?symbol=${encodeURIComponent(symbol)}` +
    `&interval=1day&outputsize=${outputsize}&apikey=${apiKey}`;
  const res = await fetch(url, {
    next: { revalidate: TWELVE_DATA_SERIES_REVALIDATE },
  });
  if (!res.ok) throw new Error(`Series HTTP ${res.status} for ${symbol}`);

  const data: TwelveDataTimeSeries = await res.json();
  if (data.status === "error" || data.code !== undefined) {
    throw new Error(data.message ?? `Series error for ${symbol}`);
  }
  return data;
}

// ─── Public API ───────────────────────────────────────────────────────────────

const YAHOO_BASE =
  process.env.YAHOO_FINANCE_BASE_URL ??
  "https://query1.finance.yahoo.com/v8/finance/chart";

/**
 * Fetch an equity index (Euro Stoxx 50, DAX) from Yahoo Finance.
 * Uses the chart endpoint with range=1mo to get both live price and history.
 */
async function fetchYahooEquityIndicator(
  cfg: EuropeanIndicatorConfig,
  ticker: string,
): Promise<IndicatorData> {
  const url = `${YAHOO_BASE}/${encodeURIComponent(ticker)}?interval=1d&range=1mo`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; finanzas-sin-ruido/1.0)",
    },
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error(`Yahoo HTTP ${res.status} for ${ticker}`);
  const json = await res.json();

  if (json.chart?.error) {
    throw new Error(
      `Yahoo error for ${ticker}: ${json.chart.error.description}`,
    );
  }

  const result = json.chart?.result?.[0];
  if (!result) throw new Error(`Yahoo: no result for ${ticker}`);

  const timestamps: number[] = result.timestamp ?? [];
  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];
  const points: IndicatorPoint[] = timestamps
    .map((ts, i) => ({ t: new Date(ts * 1000).toISOString(), v: closes[i] }))
    .filter((p): p is IndicatorPoint => p.v !== null && !isNaN(p.v as number));

  const meta = result.meta;
  const lastValue: number = meta.regularMarketPrice;
  const lastDate = new Date(meta.regularMarketTime * 1000).toISOString();

  // Ensure the real-time quote is the last point
  const datePrefix = lastDate.slice(0, 10);
  const finalPoints = [
    ...points.filter((p) => !p.t.startsWith(datePrefix)),
    { t: lastDate, v: lastValue },
  ];

  return {
    indicatorId: cfg.indicatorId,
    label: cfg.label,
    unit: cfg.unit,
    lastUpdated: lastDate,
    points: finalPoints,
    stale: false,
  };
}

/**
 * Fetch a government bond yield from FRED.
 * Used for German Bund 10Y (IRLTLT01DEM156N — monthly, % per annum).
 */
async function fetchFredBondIndicator(
  cfg: EuropeanIndicatorConfig,
  fredSeriesId: string,
): Promise<IndicatorData> {
  const apiKey = process.env.FRED_API_KEY;
  if (!apiKey) return makeFallback(cfg, "FRED_API_KEY no configurado");

  const endDate = new Date().toISOString().slice(0, 10);
  const startDate = new Date(Date.now() - 90 * 24 * 3600 * 1000)
    .toISOString()
    .slice(0, 10);
  const url =
    `https://api.stlouisfed.org/fred/series/observations` +
    `?series_id=${fredSeriesId}` +
    `&observation_start=${startDate}` +
    `&observation_end=${endDate}` +
    `&sort_order=asc&file_type=json&api_key=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 86_400 } });
  if (!res.ok) throw new Error(`FRED HTTP ${res.status}`);
  const json = await res.json();
  if (json.error_message) throw new Error(json.error_message);

  const obs: Array<{ date: string; value: string }> = json.observations ?? [];
  const points: IndicatorPoint[] = obs
    .filter((o) => o.value !== "." && !isNaN(parseFloat(o.value)))
    .map((o) => ({ t: `${o.date}T00:00:00Z`, v: parseFloat(o.value) }));

  if (points.length === 0)
    return makeFallback(cfg, "FRED: sin datos disponibles");

  return {
    indicatorId: cfg.indicatorId,
    label: cfg.label,
    unit: cfg.unit,
    lastUpdated: points.at(-1)!.t,
    points,
    stale: false,
  };
}

/**
 * Fetch all European indicators in parallel using the most reliable free sources:
 *   Euro Stoxx 50 → Yahoo Finance ^STOXX50E
 *   DAX           → Yahoo Finance ^GDAXI
 *   German Bund   → FRED IRLTLT01DEM156N
 *   Bitcoin       → Yahoo Finance BTC-USD
 */
export async function fetchAllEuropeanIndicators(): Promise<IndicatorData[]> {
  const cfgEuroStoxx = EUROPEAN_INDICATORS["euro-stoxx-50"];
  const cfgDax = EUROPEAN_INDICATORS["dax"];
  const cfgBond = EUROPEAN_INDICATORS["german-bund-10y"];
  const cfgBitcoin = EUROPEAN_INDICATORS["bitcoin"];

  return Promise.all([
    fetchYahooEquityIndicator(cfgEuroStoxx, "^STOXX50E").catch((e) =>
      makeFallback(cfgEuroStoxx, e instanceof Error ? e.message : String(e)),
    ),
    fetchYahooEquityIndicator(cfgDax, "^GDAXI").catch((e) =>
      makeFallback(cfgDax, e instanceof Error ? e.message : String(e)),
    ),
    fetchFredBondIndicator(cfgBond, "IRLTLT01DEM156N").catch((e) =>
      makeFallback(cfgBond, e instanceof Error ? e.message : String(e)),
    ),
    fetchYahooEquityIndicator(cfgBitcoin, "BTC-USD").catch((e) =>
      makeFallback(cfgBitcoin, e instanceof Error ? e.message : String(e)),
    ),
  ]);
}
