/**
 * /api/fx/[pair]
 *
 * Internal endpoint that exposes FX daily series data.
 * Pair format: "usd-cop", "eur-cop", "gbp-cop", "brl-cop", etc.
 *
 * Cache: revalidated every 4 hours server-side via fetch cache.
 * The route itself has no additional caching — callers use the provider cache.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchFxDaily } from "@/lib/providers/alphaVantage";

// 4 hours — must be a static literal for Next.js segment config
export const revalidate = 14400;

/** Map slug → Alpha Vantage symbol pair */
const PAIR_MAP: Record<string, { from: string; to: string }> = {
  "usd-cop": { from: "USD", to: "COP" },
  "eur-cop": { from: "EUR", to: "COP" },
  "gbp-cop": { from: "GBP", to: "COP" },
  "brl-cop": { from: "BRL", to: "COP" },
  "usd-eur": { from: "USD", to: "EUR" },
  "eur-usd": { from: "EUR", to: "USD" },
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

  const data = await fetchFxDaily(symbols.from, symbols.to);

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=14400, stale-while-revalidate",
    },
  });
}
