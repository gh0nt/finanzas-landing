/**
 * Shared type definitions for all market indicators.
 * Every internal /api/* endpoint returns IndicatorData.
 */

export interface IndicatorPoint {
  /** ISO-8601 timestamp */
  t: string;
  /** Numeric value */
  v: number;
}

export interface IndicatorData {
  indicatorId: string;
  label: string;
  /** Unit string, e.g. "EUR/USD", "USD/barril", "%" – or null */
  unit: string | null;
  /** ISO-8601 timestamp of the latest data point */
  lastUpdated: string;
  /** Array of time-series points, oldest first */
  points: IndicatorPoint[];
  /** True if the API call failed and we are returning stale cache or no data */
  stale?: boolean;
  /** Human-readable error description (only present when stale === true) */
  error?: string;
}

/** Trend derived from first vs last point in a series */
export type Trend = "up" | "down" | "flat";
