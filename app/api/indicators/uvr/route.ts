/**
 * /api/indicators/uvr
 *
 * Unidad de Valor Real (UVR)
 * Source: datos.gov.co (BanRep / SFC dataset)
 * Revalidate: 12 hours (updated daily)
 */

import { NextResponse } from "next/server";
import { fetchUVR } from "@/lib/providers/banrep";

// 12 hours — must be a static literal for Next.js segment config
export const revalidate = 43200;

export async function GET() {
  const data = await fetchUVR();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=43200, stale-while-revalidate",
    },
  });
}
