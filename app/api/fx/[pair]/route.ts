/**
 * /api/fx/[pair]
 *
 * Internal endpoint that exposes FX daily series data.
 * Pair format: "usd-eur", "eur-usd", "gbp-eur", "brl-eur", etc.
 *
 * Cache: revalidated every 4 hours server-side via fetch cache.
 * The route itself has no additional caching — callers use the provider cache.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchFxHistory } from "@/lib/providers/fxCdn";

// 4 hours — must be a static literal for Next.js segment config
export const revalidate = 14400;

/** Map slug → Alpha Vantage symbol pair */
const PAIR_MAP: Record<string, { from: string; to: string }> = {
  "usd-eur": { from: "USD", to: "EUR" },
  "eur-usd": { from: "EUR", to: "USD" },
  "gbp-eur": { from: "GBP", to: "EUR" },
  "brl-eur": { from: "BRL", to: "EUR" },
  "gbp-usd": { from: "GBP", to: "USD" },
  "usd-jpy": { from: "USD", to: "JPY" },
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ pair: string }> },
) {
  const { pair } = await params;
  const symbols = PAIR_MAP[pair.toLowerCase()];

  if (!symbols) {
    return NextResponse.json(
      { error: `Par no reconocido: ${pair}` },
      { status: 404 },
    );
  }

  const data = await fetchFxHistory(symbols.from, symbols.to, 60);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=14400, stale-while-revalidate",
    },
  });
}
