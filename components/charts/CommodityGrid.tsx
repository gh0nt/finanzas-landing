/**
 * CommodityGrid
 *
 * Renders commodity price cards (WTI, Coffee, Gold, etc.)
 * with inline sparklines. Replaces the static commodityPrices tiles.
 */

import type { IndicatorData } from "@/lib/indicators";
import { deriveTrend, percentChange, formatValue } from "@/lib/chartUtils";
import { LineChart } from "./LineChart";

interface CommodityGridProps {
  commodities: Array<IndicatorData & { icon: string }>;
  locale?: string;
}

const TREND_CSS: Record<string, string> = {
  up: "trend-up",
  down: "trend-down",
  flat: "trend-flat",
};

export function CommodityGrid({
  commodities,
  locale = "es-CO",
}: CommodityGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
        gap: "0.75rem",
      }}
    >
      {commodities.map((c, i) => {
        const trend = deriveTrend(c.points);
        const lastPoint = c.points.at(-1);
        const pct = percentChange(c.points);
        const formattedValue = lastPoint
          ? formatValue(lastPoint.v, c.unit, locale)
          : "—";
        const formattedChange =
          pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : "—";

        return (
          <div
            key={c.indicatorId}
            style={{
              background: "var(--background)",
              borderRadius: "var(--radius-sm)",
              padding: "0.85rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.4rem",
            }}
          >
            {/* Icon + name */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span
                className="material-icons-outlined"
                style={{
                  fontSize: "1.1rem",
                  color: "var(--muted)",
                }}
                aria-hidden="true"
              >
                {c.icon}
              </span>
              <div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--navy)",
                    lineHeight: 1.2,
                  }}
                >
                  {c.label}
                </div>
                {c.unit && (
                  <div style={{ fontSize: "0.65rem", color: "var(--muted)" }}>
                    {c.unit}
                  </div>
                )}
              </div>
            </div>

            {/* Value + change */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "var(--navy)",
                }}
              >
                {c.stale && c.points.length === 0 ? (
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--muted)",
                      fontWeight: 400,
                    }}
                  >
                    N/D
                  </span>
                ) : (
                  formattedValue
                )}
              </span>
              <span
                className={
                  c.stale && c.points.length === 0
                    ? "trend-flat"
                    : TREND_CSS[trend]
                }
                style={{ fontSize: "0.75rem" }}
              >
                {formattedChange}
              </span>
            </div>

            {/* Sparkline */}
            <div style={{ height: 32 }} aria-hidden="true">
              <LineChart
                points={c.points.slice(-30)}
                trend={trend}
                gradientId={`commodity-grad-${i}`}
                width={160}
                height={32}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
