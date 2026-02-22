/**
 * /api/indicators/ibr
 *
 * Indicador Bancario de Referencia – Overnight (IBR O/N)
 * Source: datos.gov.co (BanRep dataset)
 * Revalidate: 12 hours (updated daily)
 */

import { NextResponse } from "next/server";
import { fetchIBR } from "@/lib/providers/banrep";

// 12 hours — must be a static literal for Next.js segment config
export const revalidate = 43200;

export async function GET() {
  const data = await fetchIBR();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=43200, stale-while-revalidate",
    },
  });
}
