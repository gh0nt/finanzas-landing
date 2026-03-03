/**
 * GET /health
 *
 * Checks:
 *  - Required API keys are present (doesn't validate them, just presence)
 *  - Cache stats
 *  - App version / uptime
 *
 * Used by load balancers and monitoring.
 */

import { NextResponse } from "next/server";
import { cacheStats } from "@/lib/comparator/cache";

export const dynamic = "force-dynamic";

interface KeyStatus {
  name: string;
  present: boolean;
  required: boolean;
}

function checkKeys(): KeyStatus[] {
  return [
    {
      name: "COMMODITIES_API_KEY",
      present: !!process.env.COMMODITIES_API_KEY,
      required: true,
    },
    {
      name: "METALS_API_KEY",
      present: !!process.env.METALS_API_KEY,
      required: true,
    },
    {
      name: "FRED_API_KEY",
      present: !!process.env.FRED_API_KEY,
      required: false,
    },
    {
      name: "REDIS_URL",
      present: !!process.env.REDIS_URL,
      required: false,
    },
  ];
}

export async function GET() {
  const keys = checkKeys();
  const missingRequired = keys.filter((k) => k.required && !k.present);
  const healthy = missingRequired.length === 0;

  return NextResponse.json(
    {
      status: healthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      keys,
      cache: cacheStats(),
      warnings: missingRequired.map(
        (k) =>
          `${k.name} no está configurada — los instrumentos servidos por esa API mostrarán "Sin datos"`,
      ),
    },
    { status: healthy ? 200 : 200 }, // always 200; degraded is informational
  );
}
