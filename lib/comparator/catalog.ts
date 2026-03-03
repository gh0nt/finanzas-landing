/**
 * Master catalog of all instruments supported by the comparator.
 *
 * Each entry declares:
 *  - our internal id (category:SYMBOL)
 *  - human-readable Spanish name
 *  - which provider serves it
 *  - providerSymbol: exact symbol the upstream API expects
 *
 * Symbol mapping rationale is documented inline.
 */

import type { InstrumentMeta, CatalogResponse } from "./types";

// ─── ENERGY ──────────────────────────────────────────────────────────────────
// Source: Commodities-API  https://commodities-api.com
// Symbols match the Commodities-API spec exactly.

const ENERGY: InstrumentMeta[] = [
  {
    id: "energy:BRENT",
    category: "energy",
    name: "Petróleo Brent",
    symbol: "BRENT",
    unit: "USD/barril",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "BRENT",
  },
  {
    id: "energy:WTI",
    category: "energy",
    name: "Petróleo WTI",
    symbol: "WTI",
    unit: "USD/barril",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "WTI",
  },
  {
    id: "energy:NG",
    category: "energy",
    name: "Gas Natural (Henry Hub)",
    symbol: "NG",
    unit: "USD/MMBtu",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "NG",
  },
  {
    id: "energy:API2",
    category: "energy",
    name: "Carbón Rotterdam (API2)",
    symbol: "API2",
    unit: "USD/ton",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "API2",
  },
];

// ─── METALS ──────────────────────────────────────────────────────────────────
// Gold/Silver/Platinum → Metals-API  https://metals-api.com
//   Symbols: XAU (Gold), XAG (Silver), XPT (Platinum)
// Copper → Commodities-API
//   Symbol: COPPER

const METALS: InstrumentMeta[] = [
  {
    id: "metals:XAU",
    category: "metals",
    name: "Oro (XAU/USD)",
    symbol: "XAU",
    unit: "USD/oz",
    currency: "USD",
    source: "metals_api",
    providerSymbol: "XAU", // Metals-API symbol
  },
  {
    id: "metals:XAG",
    category: "metals",
    name: "Plata (XAG/USD)",
    symbol: "XAG",
    unit: "USD/oz",
    currency: "USD",
    source: "metals_api",
    providerSymbol: "XAG",
  },
  {
    id: "metals:XPT",
    category: "metals",
    name: "Platino",
    symbol: "XPT",
    unit: "USD/oz",
    currency: "USD",
    source: "metals_api",
    providerSymbol: "XPT",
  },
  {
    id: "metals:COPPER",
    category: "metals",
    name: "Cobre",
    symbol: "COPPER",
    unit: "USD/libra",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "COPPER", // Commodities-API symbol
  },
];

// ─── AGRICULTURE ─────────────────────────────────────────────────────────────
// Source: Commodities-API
// Symbols match Commodities-API spec.
//   COFFEE → "CC" in some providers; we use Commodities-API which accepts COFFEE.
//   Arabica coffee is commonly coded COFFEE on Commodities-API.

const AGRICULTURE: InstrumentMeta[] = [
  {
    id: "agriculture:COFFEE",
    category: "agriculture",
    name: "Café Arábica",
    symbol: "COFFEE",
    unit: "USD/libra",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "COFFEE",
  },
  {
    id: "agriculture:WHEAT",
    category: "agriculture",
    name: "Trigo",
    symbol: "WHEAT",
    unit: "USD/bushel",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "WHEAT",
  },
  {
    id: "agriculture:CORN",
    category: "agriculture",
    name: "Maíz",
    symbol: "CORN",
    unit: "USD/bushel",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "CORN",
  },
  {
    id: "agriculture:COCOA",
    category: "agriculture",
    name: "Cacao",
    symbol: "COCOA",
    unit: "USD/ton",
    currency: "USD",
    source: "commodities_api",
    providerSymbol: "COCOA",
  },
];

// ─── FX ──────────────────────────────────────────────────────────────────────
// Source: ECB Statistical Data Warehouse (free, no key)
// ECB publishes EUR-base rates. Pair format: EUR/XXX.
// ECB SDMX key format: EXR/D.{currency}.EUR.SP00.A
//   USD → D.USD.EUR.SP00.A
//   GBP → D.GBP.EUR.SP00.A  etc.

const FX: InstrumentMeta[] = [
  {
    id: "fx:EURUSD",
    category: "fx",
    name: "EUR/USD",
    symbol: "EURUSD",
    unit: "rate",
    currency: "USD",
    source: "ecb",
    providerSymbol: "USD", // ECB currency code against EUR base
  },
  {
    id: "fx:EURGBP",
    category: "fx",
    name: "EUR/GBP",
    symbol: "EURGBP",
    unit: "rate",
    currency: "GBP",
    source: "ecb",
    providerSymbol: "GBP",
  },
  {
    id: "fx:EURCHF",
    category: "fx",
    name: "EUR/CHF",
    symbol: "EURCHF",
    unit: "rate",
    currency: "CHF",
    source: "ecb",
    providerSymbol: "CHF",
  },
  {
    id: "fx:EURJPY",
    category: "fx",
    name: "EUR/JPY",
    symbol: "EURJPY",
    unit: "rate",
    currency: "JPY",
    source: "ecb",
    providerSymbol: "JPY",
  },
];

// ─── CRYPTO ──────────────────────────────────────────────────────────────────
// Source: CoinGecko (free, no key for public endpoints)
// CoinGecko uses slugs ("bitcoin", "ethereum") not symbols for the simple price API.
// We map our symbol → CoinGecko id below.

export const COINGECKO_ID_MAP: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
  XRP: "ripple",
  ADA: "cardano",
};

const CRYPTO: InstrumentMeta[] = [
  {
    id: "crypto:BTC",
    category: "crypto",
    name: "Bitcoin",
    symbol: "BTC",
    unit: "EUR",
    currency: "EUR",
    source: "coingecko",
    providerSymbol: "bitcoin",
  },
  {
    id: "crypto:ETH",
    category: "crypto",
    name: "Ethereum",
    symbol: "ETH",
    unit: "EUR",
    currency: "EUR",
    source: "coingecko",
    providerSymbol: "ethereum",
  },
  {
    id: "crypto:SOL",
    category: "crypto",
    name: "Solana",
    symbol: "SOL",
    unit: "EUR",
    currency: "EUR",
    source: "coingecko",
    providerSymbol: "solana",
  },
  {
    id: "crypto:XRP",
    category: "crypto",
    name: "XRP",
    symbol: "XRP",
    unit: "EUR",
    currency: "EUR",
    source: "coingecko",
    providerSymbol: "ripple",
  },
  {
    id: "crypto:ADA",
    category: "crypto",
    name: "Cardano",
    symbol: "ADA",
    unit: "EUR",
    currency: "EUR",
    source: "coingecko",
    providerSymbol: "cardano",
  },
];

// ─── INDICATORS ───────────────────────────────────────────────────────────────
// IBEX 35        → Yahoo Finance, ticker: ^IBEX
//                  Limitations: unofficial API, may rate-limit.
// Euribor 12M    → ECB SDW series: FM/B.U2.EUR.RT0.MM.EURIBOR12MD_.HSTA
//                  Free, official, daily.
// Spain 10Y bond → Yahoo Finance, ticker: ^TNX is US; Spain 10Y: ESPAGNE10YT=RR
//                  (Yahoo shortname varies by region; we use ESP10Y as fallback)
//                  Documented as best-effort MVP.

export const YAHOO_TICKER_MAP: Record<string, string> = {
  IBEX35: "^IBEX",
  ES10Y: "^ES10YT=RR", // Spain 10-year bond yield — Yahoo unofficial ticker
};

const INDICATORS: InstrumentMeta[] = [
  {
    id: "indicators:IBEX35",
    category: "indicators",
    name: "IBEX 35",
    symbol: "IBEX35",
    unit: "puntos",
    currency: "EUR",
    source: "yahoo",
    providerSymbol: "^IBEX",
  },
  {
    id: "indicators:EURIBOR12M",
    category: "indicators",
    name: "Euríbor 12M",
    symbol: "EURIBOR12M",
    unit: "%",
    currency: "EUR",
    source: "ecb",
    providerSymbol: "FM/B.U2.EUR.RT0.MM.EURIBOR12MD_.HSTA", // full ECB flow key
  },
  {
    id: "indicators:ES10Y",
    category: "indicators",
    name: "Bono España 10 Años",
    symbol: "ES10Y",
    unit: "%",
    currency: "EUR",
    source: "yahoo",
    providerSymbol: "^ES10YT=RR",
  },
];

// ─── Full catalog ────────────────────────────────────────────────────────────

export const CATALOG: CatalogResponse = {
  energy: ENERGY,
  metals: METALS,
  agriculture: AGRICULTURE,
  fx: FX,
  crypto: CRYPTO,
  indicators: INDICATORS,
};

/** Flat list of all instruments */
export const ALL_INSTRUMENTS: InstrumentMeta[] = [
  ...ENERGY,
  ...METALS,
  ...AGRICULTURE,
  ...FX,
  ...CRYPTO,
  ...INDICATORS,
];

/** Look up a single instrument by its internal id */
export function findById(id: string): InstrumentMeta | undefined {
  return ALL_INSTRUMENTS.find((i) => i.id === id);
}

/** Return all instruments in a given category */
export function findByCategory(
  category: keyof CatalogResponse,
): InstrumentMeta[] {
  return CATALOG[category] ?? [];
}
