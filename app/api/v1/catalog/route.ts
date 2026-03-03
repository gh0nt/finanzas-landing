/**
 * GET /api/v1/catalog
 *
 * Returns the full instrument catalog grouped by category.
 * This endpoint is static metadata — no provider calls needed.
 *
 * Response:
 * {
 *   "energy":      [ { id, category, name, symbol, unit, currency, source, providerSymbol }, ... ],
 *   "metals":      [...],
 *   "agriculture": [...],
 *   "fx":          [...],
 *   "crypto":      [...],
 *   "indicators":  [...],
 *   "total":       26
 * }
 */

import { NextResponse } from "next/server";
import { CATALOG, ALL_INSTRUMENTS } from "@/lib/comparator/catalog";

// Revalidate once per day — catalog is static metadata
export const revalidate = 86_400;

export async function GET() {
  return NextResponse.json(
    {
      ...CATALOG,
      total: ALL_INSTRUMENTS.length,
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=3600",
      },
    },
  );
}
