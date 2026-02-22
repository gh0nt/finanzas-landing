/**
 * /api/commodities/[commodity]
 *
 * Supported slugs: wti, brent, natural-gas, copper, coffee, sugar, corn, wheat, cotton, gold
 *
 * cache: revalidated every 6 hours server-side.
 */

import { NextRequest, NextResponse } from "next/server";
import { fetchCommodity, fetchGold } from "@/lib/providers/alphaVantage";

// 6 hours — must be a static literal for Next.js segment config
export const revalidate = 21600;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ commodity: string }> },
) {
  const { commodity } = await params;
  const slug = commodity.toLowerCase();

  const data = slug === "gold" ? await fetchGold() : await fetchCommodity(slug);

  // If the provider explicitly says it's unsupported, return 404
  if (data.stale && data.error?.includes("no soportado")) {
    return NextResponse.json(
      { error: `Commodity no reconocida: ${slug}` },
      { status: 404 },
    );
  }

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "s-maxage=21600, stale-while-revalidate",
    },
  });
}
