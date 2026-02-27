/**
 * /api/indicators/trm
 *
 * USD/EUR Exchange Rate
 * Source: fxCdn (fawazahmed0/currency-api via jsDelivr)
 * Revalidate: 12 hours
 */

import { NextResponse } from "next/server";
import { fetchFxHistory } from "@/lib/providers/fxCdn";

// 12 hours — static literal required for Next.js segment config
export const revalidate = 43200;

export async function GET() {
  const trm = await fetchFxHistory("USD", "EUR", 60);

  return NextResponse.json(trm, {
    headers: {
      "Cache-Control": "s-maxage=43200, stale-while-revalidate",
    },
  });
}
