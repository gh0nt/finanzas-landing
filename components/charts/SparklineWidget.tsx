/**
 * SparklineWidget
 *
 * A single market-widget card used on the home page hero area.
 * Accepts live IndicatorData and renders the value + trend pill + sparkline.
 * Gracefully degraded if data.stale === true.
 */

import type { IndicatorData } from "@/lib/indicators";
import {
  deriveTrend,
  percentChange,
  formatValue,
  formatDateTime,
} from "@/lib/chartUtils";
import { LineChart } from "./LineChart";
import { classNames } from "@/lib/classNames";

interface SparklineWidgetProps {
  data: IndicatorData;
  /** Index used to generate unique gradient IDs in SVG */
  index: number;
  locale?: string;
}

const TREND_PILL: Record<string, string> = {
  up: "market-pill--up",
  down: "market-pill--down",
  flat: "market-pill--flat",
};

const TREND_ICON: Record<string, string> = {
  up: "arrow_upward",
  down: "arrow_downward",
  flat: "remove",
};

export function SparklineWidget({
  data,
  index,
  locale = "es-CO",
}: SparklineWidgetProps) {
  const trend = deriveTrend(data.points);
  const pct = percentChange(data.points);
  const lastPoint = data.points.at(-1);
  const gradientId = `sparkline-grad-${index}`;

  const formattedValue = lastPoint
    ? formatValue(lastPoint.v, data.unit, locale)
    : "—";

  const formattedChange =
    pct !== null ? `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%` : "—";

  const lastUpdatedLabel = formatDateTime(data.lastUpdated, locale);

  return (
    <article className="market-item" role="listitem">
      <div className="market-header">
        <div>
          <p className="market-label">{data.label}</p>
          <p className="market-value">
            {data.stale && data.points.length === 0 ? (
              <span style={{ color: "var(--muted)", fontSize: "0.85em" }}>
                No disponible
              </span>
            ) : (
              formattedValue
            )}
          </p>
        </div>

        <span
          className={classNames(
            "market-pill",
            data.stale && data.points.length === 0
              ? "market-pill--flat"
              : TREND_PILL[trend],
          )}
          aria-label={`Cambio: ${formattedChange}`}
        >
          {data.stale && data.points.length === 0 ? "—" : formattedChange}
          <span className="material-icons-outlined" aria-hidden="true">
            {data.stale && data.points.length === 0
              ? "error_outline"
              : TREND_ICON[trend]}
          </span>
        </span>
      </div>

      {/* Sparkline */}
      <div
        className="market-chart"
        aria-hidden="true"
        style={{ height: 48, marginTop: "0.5rem" }}
      >
        {data.stale && data.points.length === 0 ? (
          <div
            style={{
              height: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              color: "var(--muted)",
              gap: "0.25rem",
            }}
          >
            <span
              className="material-icons-outlined"
              style={{ fontSize: "0.9rem" }}
            >
              cloud_off
            </span>
            Datos no disponibles
          </div>
        ) : (
          <LineChart
            points={data.points.slice(-30)}
            trend={trend}
            gradientId={gradientId}
            width={200}
            height={48}
          />
        )}
      </div>

      {/* Timestamp */}
      <p
        style={{
          fontSize: "0.65rem",
          color: "var(--muted)",
          marginTop: "0.35rem",
          textAlign: "right",
        }}
        title={`Última actualización: ${lastUpdatedLabel}`}
      >
        {data.stale ? (
          <span style={{ color: "var(--danger)", fontSize: "0.65rem" }}>
            ⚠ Sin actualizar
          </span>
        ) : (
          <>Act. {lastUpdatedLabel}</>
        )}
      </p>
    </article>
  );
}
