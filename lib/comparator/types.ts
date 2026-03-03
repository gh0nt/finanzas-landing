/**
 * Normalized instrument schema returned by every comparator endpoint.
 * All providers must map their raw response into this shape.
 */

export type AssetCategory =
  | "energy"
  | "metals"
  | "agriculture"
  | "fx"
  | "crypto"
  | "indicators";

export type ProviderName =
  | "ecb"
  | "coingecko"
  | "commodities_api"
  | "metals_api"
  | "yahoo"
  | "bde"; // Banco de España

/** Single normalized instrument quote */
export interface InstrumentQuote {
  /** Unique scoped id, e.g. "fx:EURUSD", "crypto:BTC", "energy:BRENT" */
  id: string;
  category: AssetCategory;
  /** Human-readable Spanish label */
  name: string;
  /** Provider symbol or common ticker */
  symbol: string;
  /** Unit description: "rate", "USD/barril", "USD/oz", "%", "puntos", "USD" */
  unit: string;
  /** The quote currency for the value (e.g. USD, EUR) */
  currency: string;
  /** Latest known value */
  value: number | null;
  /** Absolute change vs previous close (null if not available) */
  change_24h: number | null;
  /** Percent change vs previous close (null if not available) */
  change_24h_pct: number | null;
  /** ISO-8601 timestamp of the observation */
  timestamp: string;
  /** Which data provider served this quote */
  source: ProviderName;
  /** True if data is stale / came from fallback */
  stale?: boolean;
  /** Human-readable error if something went wrong */
  error?: string;
}

/** Catalog entry (static metadata for each instrument) */
export interface InstrumentMeta {
  id: string;
  category: AssetCategory;
  name: string;
  symbol: string;
  unit: string;
  currency: string;
  source: ProviderName;
  /** Symbol as understood by the upstream provider (may differ from our id) */
  providerSymbol: string;
}

/** Catalog grouped by category */
export interface CatalogResponse {
  energy: InstrumentMeta[];
  metals: InstrumentMeta[];
  agriculture: InstrumentMeta[];
  fx: InstrumentMeta[];
  crypto: InstrumentMeta[];
  indicators: InstrumentMeta[];
}

/** API error envelope */
export interface ApiError {
  error: string;
  code: number;
}
