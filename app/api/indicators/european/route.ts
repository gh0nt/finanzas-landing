/**
 * GET /api/indicators/european
 *
 * Returns current data for market indicators used in home widgets:
 *   - EURO STOXX 50  (EUSTX50)
 *   - DAX Germany    (DAX)
 *   - German Bund 10Y (DE10Y)
 *   - Bitcoin        (BTC-USD)
 *
 * Rate-limit protection: responses are held in an in-memory cache for
 * CACHE_TTL seconds (15 min).  All concurrent requests within the same
 * window share the single in-flight promise (request coalescing via
 * cacheFetch).  This limits Twelve Data API calls to ≤ 576/day regardless
 * of traffic (6 calls per 15-min window × 96 windows/day).
 */

import { NextResponse } from "next/server";
import { cacheFetch } from "@/lib/comparator/cache";
import { fetchAllEuropeanIndicators } from "@/lib/providers/twelveData";

// 15-minute in-memory TTL – safe within the 800 req/day free-tier limit
const CACHE_TTL = 900;

export async function GET() {
  try {
    const data = await cacheFetch(
      "european-indicators",
      CACHE_TTL,
      fetchAllEuropeanIndicators,
    );

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `s-maxage=${CACHE_TTL}, stale-while-revalidate`,
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Error interno del servidor";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
