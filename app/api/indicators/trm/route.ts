/**
 * /api/indicators/trm
 *
 * Tasa Representativa del Mercado (USD/COP)
 * Source: Alpha Vantage FX_DAILY
 * Revalidate: 4 hours
 */

import { NextResponse } from "next/server";
import { fetchFxDaily } from "@/lib/providers/alphaVantage";

// 4 hours — must be a static literal for Next.js segment config
export const revalidate = 14400;

export async function GET() {
  const data = await fetchFxDaily("USD", "COP");
  const trm = {
    ...data,
    indicatorId: "trm",
    label: "TRM (USD/COP)",
    unit: "COP",
  };

  return NextResponse.json(trm, {
    headers: {
      "Cache-Control": "s-maxage=14400, stale-while-revalidate",
    },
  });
}
