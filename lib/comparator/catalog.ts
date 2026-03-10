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
// Source: FRED (St. Louis Fed) — free, 120 req/min, no daily limit
// Series: DCOILBRENTEU | DCOILWTICO | DHHNGSP | PALUMUSDM

const ENERGY: InstrumentMeta[] = [
  {
    id: "energy:BRENT",
    category: "energy",
    name: "Petróleo Brent",
    symbol: "BRENT",
    unit: "USD/barril",
    currency: "USD",
    source: "fred",
    providerSymbol: "BRENT",
  },
  {
    id: "energy:WTI",
    category: "energy",
    name: "Petróleo WTI",
    symbol: "WTI",
    unit: "USD/barril",
    currency: "USD",
    source: "fred",
    providerSymbol: "WTI",
  },
  {
    id: "energy:NG",
    category: "energy",
    name: "Gas Natural (Henry Hub)",
    symbol: "NG",
    unit: "USD/MMBtu",
    currency: "USD",
    source: "fred",
    providerSymbol: "NATURAL_GAS",
  },
  {
    id: "energy:ALUMINUM",
    category: "energy",
    name: "Aluminio",
    symbol: "ALUMINUM",
    unit: "USD/TM",
    currency: "USD",
    source: "fred",
    providerSymbol: "ALUMINUM",
  },
];

// ─── METALS ──────────────────────────────────────────────────────────────────
// XAU, XAG, XPT → Alpha Vantage FX_DAILY (current, confirmed working)
// COPPER        → FRED PCOPPUSDM (World Bank monthly, confirmed working)

const METALS: InstrumentMeta[] = [
  {
    id: "metals:XAU",
    category: "metals",
    name: "Oro (XAU/USD)",
    symbol: "XAU",
    unit: "USD/oz",
    currency: "USD",
    source: "alpha_vantage",
    providerSymbol: "XAU", // routed via AV GOLD_SILVER_SPOT
  },
  {
    id: "metals:XAG",
    category: "metals",
    name: "Plata (XAG/USD)",
    symbol: "XAG",
    unit: "USD/oz",
    currency: "USD",
    source: "alpha_vantage",
    providerSymbol: "XAG", // routed via AV GOLD_SILVER_SPOT
  },
  {
    id: "metals:COPPER",
    category: "metals",
    name: "Cobre",
    symbol: "COPPER",
    unit: "USD/TM",
    currency: "USD",
    source: "fred",
    providerSymbol: "COPPER", // FRED PCOPPUSDM
  },
];

// ─── AGRICULTURE ─────────────────────────────────────────────────────────────
// Source: FRED (St. Louis Fed) — free, 120 req/min, no daily limit
// COFFEE → PCOFFOTMUSDM (USD/lb) | WHEAT → PWHEAMTUSDM (USD/MT)
// CORN → PMAIZMTUSDM (USD/MT)   | SUGAR → PSUGAISAUSDM (USD/lb)

const AGRICULTURE: InstrumentMeta[] = [
  {
    id: "agriculture:COFFEE",
    category: "agriculture",
    name: "Café Arábica",
    symbol: "COFFEE",
    unit: "USD/libra",
    currency: "USD",
    source: "fred",
    providerSymbol: "COFFEE",
  },
  {
    id: "agriculture:WHEAT",
    category: "agriculture",
    name: "Trigo",
    symbol: "WHEAT",
    unit: "USD/TM",
    currency: "USD",
    source: "fred",
    providerSymbol: "WHEAT",
  },
  {
    id: "agriculture:CORN",
    category: "agriculture",
    name: "Maíz",
    symbol: "CORN",
    unit: "USD/TM",
    currency: "USD",
    source: "fred",
    providerSymbol: "CORN",
  },
  {
    id: "agriculture:SUGAR",
    category: "agriculture",
    name: "Azúcar",
    symbol: "SUGAR",
    unit: "USD/libra",
    currency: "USD",
    source: "fred",
    providerSymbol: "SUGAR",
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

// ─── INDICATORS ─────────────────────────────────────────────────────────────
// IBEX 35       → Yahoo Finance ^IBEX
// Euribor 12M   → FRED EUR12MD156N (12-month EURIBOR, monthly)
// Spain 10Y bond → FRED IRLTLT01ESM156N
// Euro Stoxx 50 → Yahoo Finance ^STOXX50E
// DAX           → Yahoo Finance ^GDAXI
// German Bund   → FRED IRLTLT01DEM156N

export const YAHOO_TICKER_MAP: Record<string, string> = {};

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
    source: "fred",
    providerSymbol: "EURIBOR12M_FRED",
  },
  {
    id: "indicators:ES10Y",
    category: "indicators",
    name: "Bono España 10 Años",
    symbol: "ES10Y",
    unit: "%",
    currency: "EUR",
    source: "fred",
    providerSymbol: "ES10Y",
  },
  {
    id: "indicators:STOXX50",
    category: "indicators",
    name: "Euro Stoxx 50",
    symbol: "STOXX50",
    unit: "puntos",
    currency: "EUR",
    source: "yahoo",
    providerSymbol: "^STOXX50E",
  },
  {
    id: "indicators:DAX",
    category: "indicators",
    name: "DAX (Alemania)",
    symbol: "DAX",
    unit: "puntos",
    currency: "EUR",
    source: "yahoo",
    providerSymbol: "^GDAXI",
  },
  {
    id: "indicators:DE10Y",
    category: "indicators",
    name: "Bono Alemán 10 Años",
    symbol: "DE10Y",
    unit: "%",
    currency: "EUR",
    source: "fred",
    providerSymbol: "DE10Y",
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
