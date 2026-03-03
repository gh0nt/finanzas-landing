/**
 * GET /api/v1/compare
 *
 * Query params:
 *   category  (optional) – energy | metals | agriculture | fx | crypto | indicators
 *   ids       (optional) – comma-separated internal ids, e.g. "fx:EURUSD,crypto:BTC"
 *
 * If both are provided, `ids` takes precedence.
 * If neither is provided, returns all instruments.
 *
 * Rate-limited per client IP.
 */

import { NextRequest, NextResponse } from "next/server";
import { CATALOG } from "@/lib/comparator/catalog";
import {
  fetchCategory,
  fetchByIds,
  fetchQuotes,
} from "@/lib/comparator/service";
import { ALL_INSTRUMENTS } from "@/lib/comparator/catalog";
import type { AssetCategory } from "@/lib/comparator/types";
import { rateLimit, getClientIp } from "@/lib/comparator/rateLimit";

export const dynamic = "force-dynamic"; // never statically cache this route

const VALID_CATEGORIES = new Set<AssetCategory>([
  "energy",
  "metals",
  "agriculture",
  "fx",
  "crypto",
  "indicators",
]);

export async function GET(req: NextRequest) {
  // ── Rate limit ────────────────────────────────────────────────────────────
  const ip = getClientIp(req.headers);
  const rl = rateLimit(ip);
  const rlHeaders = {
    "X-RateLimit-Remaining": String(rl.remaining),
    "X-RateLimit-Reset": String(Math.ceil(rl.resetAt / 1000)),
  };

  if (!rl.allowed) {
    return NextResponse.json(
      {
        error: "Demasiadas peticiones. Intenta de nuevo más tarde.",
        code: 429,
      },
      { status: 429, headers: rlHeaders },
    );
  }

  // ── Parse params ──────────────────────────────────────────────────────────
  const { searchParams } = req.nextUrl;
  const idsParam = searchParams.get("ids");
  const categoryParam = searchParams.get("category");

  const t0 = Date.now();

  try {
    let quotes;

    if (idsParam) {
      const ids = idsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (ids.length === 0) {
        return NextResponse.json(
          { error: "ids vacío", code: 400 },
          { status: 400, headers: rlHeaders },
        );
      }
      quotes = await fetchByIds(ids);
    } else if (categoryParam) {
      if (!VALID_CATEGORIES.has(categoryParam as AssetCategory)) {
        return NextResponse.json(
          {
            error: `Categoría inválida: "${categoryParam}". Válidas: ${[...VALID_CATEGORIES].join(", ")}`,
            code: 400,
          },
          { status: 400, headers: rlHeaders },
        );
      }
      quotes = await fetchCategory(categoryParam as AssetCategory);
    } else {
      // Return everything
      quotes = await fetchQuotes(ALL_INSTRUMENTS);
    }

    console.info(
      `[/api/v1/compare] ip=${ip} category=${categoryParam ?? "all"} ids=${idsParam ?? "-"} count=${quotes.length} ms=${Date.now() - t0}`,
    );

    return NextResponse.json(
      {
        data: quotes,
        count: quotes.length,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          ...rlHeaders,
          "Cache-Control": "no-store", // We manage caching ourselves
        },
      },
    );
  } catch (err) {
    console.error("[/api/v1/compare] unexpected error", err);
    return NextResponse.json(
      { error: "Error interno del servidor", code: 500 },
      { status: 500, headers: rlHeaders },
    );
  }
}
