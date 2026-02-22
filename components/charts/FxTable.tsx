/**
 * FxTable
 *
 * Renders a table of FX rates with inline sparklines.
 * Replaces the static fxRates mockdata table in the markets page.
 */

import type { IndicatorData } from "@/lib/indicators";
import { deriveTrend, percentChange, formatValue } from "@/lib/chartUtils";
import { LineChart } from "./LineChart";

interface FxTableProps {
  rates: IndicatorData[];
  locale?: string;
}

const TREND_CSS: Record<string, string> = {
  up: "trend-up",
  down: "trend-down",
  flat: "trend-flat",
};

export function FxTable({ rates, locale = "es-CO" }: FxTableProps) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Par</th>
            <th style={{ textAlign: "right" }}>Tasa</th>
            <th style={{ textAlign: "right" }}>Var. (período)</th>
            <th style={{ textAlign: "right", minWidth: 100 }}>Tendencia</th>
          </tr>
        </thead>
        <tbody>
          {rates.map((fx, i) => {
            const trend = deriveTrend(fx.points);
            const lastPoint = fx.points.at(-1);
            const pct = percentChange(fx.points);
            const formattedValue = lastPoint
              ? formatValue(lastPoint.v, fx.unit, locale)
              : "—";
            const formattedChange =
              pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : "—";

            return (
              <tr key={fx.indicatorId}>
                <td style={{ fontWeight: 600 }}>{fx.label}</td>
                <td
                  style={{
                    textAlign: "right",
                    fontWeight: 700,
                    color: "var(--navy)",
                  }}
                >
                  {fx.stale && fx.points.length === 0 ? (
                    <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                      —
                    </span>
                  ) : (
                    formattedValue
                  )}
                </td>
                <td style={{ textAlign: "right" }}>
                  <span
                    className={
                      fx.stale && fx.points.length === 0
                        ? "trend-flat"
                        : TREND_CSS[trend]
                    }
                  >
                    {formattedChange}
                  </span>
                </td>
                <td
                  style={{
                    textAlign: "right",
                    width: 110,
                    paddingRight: "0.75rem",
                  }}
                  aria-hidden="true"
                >
                  <div
                    style={{
                      height: 28,
                      minWidth: 90,
                      display: "inline-block",
                      width: "100%",
                    }}
                  >
                    <LineChart
                      points={fx.points.slice(-30)}
                      trend={trend}
                      gradientId={`fx-sparkline-${i}`}
                      width={90}
                      height={28}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {rates.every((r) => r.stale) && (
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--muted)",
            textAlign: "center",
            padding: "0.5rem",
          }}
        >
          <span
            className="material-icons-outlined"
            style={{ fontSize: "0.9rem", verticalAlign: "middle" }}
          >
            cloud_off
          </span>{" "}
          No se pudieron cargar las tasas en este momento.
        </p>
      )}
    </div>
  );
}
