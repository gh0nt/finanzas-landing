/**
 * IndicatorCard
 *
 * Full-width indicator card with a larger line chart.
 * Used in the markets page "Key Indicators" grid.
 */

import type { IndicatorData } from "@/lib/indicators";
import {
  deriveTrend,
  percentChange,
  formatValue,
  formatDateTime,
} from "@/lib/chartUtils";
import { LineChart } from "./LineChart";

interface IndicatorCardProps {
  data: IndicatorData;
  description?: string;
  index: number;
  locale?: string;
}

const TREND_CSS: Record<string, string> = {
  up: "trend-up",
  down: "trend-down",
  flat: "trend-flat",
};

export function IndicatorCard({
  data,
  description,
  index,
  locale = "es-CO",
}: IndicatorCardProps) {
  const trend = deriveTrend(data.points);
  const pct = percentChange(data.points);
  const lastPoint = data.points.at(-1);
  const gradientId = `ind-grad-${index}`;

  const formattedValue = lastPoint
    ? formatValue(lastPoint.v, data.unit, locale)
    : "—";

  const formattedChange =
    pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : "—";

  const lastUpdatedLabel = formatDateTime(data.lastUpdated, locale);

  return (
    <div
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius-md)",
        padding: "1.25rem",
        boxShadow: "var(--shadow-sm)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              margin: 0,
            }}
          >
            {data.label}
          </p>
          <p
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "var(--navy)",
              margin: "0.2rem 0 0",
            }}
          >
            {data.stale && data.points.length === 0 ? (
              <span style={{ fontSize: "1rem", color: "var(--muted)" }}>
                No disponible
              </span>
            ) : (
              <>
                {formattedValue}
                {data.unit && (
                  <span
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 500,
                      color: "var(--muted)",
                      marginLeft: "0.3rem",
                    }}
                  >
                    {data.unit}
                  </span>
                )}
              </>
            )}
          </p>
        </div>

        {/* Change pill */}
        <span
          className={
            data.stale && data.points.length === 0
              ? "trend-flat"
              : TREND_CSS[trend]
          }
          style={{ fontWeight: 600, fontSize: "0.85rem" }}
          aria-label={`Variación: ${formattedChange}`}
        >
          {data.stale && data.points.length === 0 ? "—" : formattedChange}
        </span>
      </div>

      {/* Description */}
      {description && (
        <p style={{ fontSize: "0.75rem", color: "var(--muted)", margin: 0 }}>
          {description}
        </p>
      )}

      {/* Chart */}
      <div
        style={{ height: 70, marginTop: "0.25rem" }}
        aria-hidden="true"
        role="img"
        aria-label={`Gráfico de ${data.label}`}
      >
        {data.stale && data.points.length === 0 ? (
          <div
            style={{
              height: 70,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "var(--radius-sm)",
              background: "var(--background)",
              fontSize: "0.75rem",
              color: "var(--muted)",
              gap: "0.35rem",
            }}
          >
            <span
              className="material-icons-outlined"
              style={{ fontSize: "1rem" }}
            >
              cloud_off
            </span>
            Datos no disponibles
          </div>
        ) : (
          <LineChart
            points={data.points.slice(-60)}
            trend={trend}
            gradientId={gradientId}
            width={300}
            height={70}
          />
        )}
      </div>

      {/* Footer – timestamp */}
      <p
        style={{
          fontSize: "0.65rem",
          color: "var(--muted)",
          margin: 0,
          textAlign: "right",
        }}
      >
        {data.stale ? (
          <span style={{ color: "var(--danger)" }}>⚠ Sin actualizar</span>
        ) : (
          <>Act. {lastUpdatedLabel}</>
        )}
      </p>
    </div>
  );
}
