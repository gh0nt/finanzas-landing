/**
 * LineChart – SVG line chart with gradient fill.
 *
 * Server-renderable (no "use client" needed).
 * ViewBox is always 0 0 200 60 regardless of rendered size,
 * allowing CSS to control the actual dimensions.
 */

import type { IndicatorPoint } from "@/lib/indicators";
import type { Trend } from "@/lib/indicators";
import { pointsToSvgPath } from "@/lib/chartUtils";

interface LineChartProps {
  points: IndicatorPoint[];
  trend: Trend;
  /** Unique id used for SVG gradient (must be DOM-id-safe) */
  gradientId: string;
  /** ViewBox height. Defaults to 60. */
  height?: number;
  /** ViewBox width. Defaults to 200. */
  width?: number;
}

const STROKE_COLOR: Record<Trend, string> = {
  up: "var(--success)",
  down: "var(--danger)",
  flat: "var(--neutral)",
};

const FILL_COLOR: Record<Trend, string> = {
  up: "var(--success)",
  down: "var(--danger)",
  flat: "var(--neutral)",
};

export function LineChart({
  points,
  trend,
  gradientId,
  height = 60,
  width = 200,
}: LineChartProps) {
  if (points.length === 0) {
    return (
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="var(--muted-light)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
      </svg>
    );
  }

  // Re-scale pointsToSvgPath for the given width/height
  const scaledPoints = rescalePoints(points, width, height);
  const linePath = scaledPoints;
  const areaPath = `${scaledPoints} V${height} H0 Z`;
  const stroke = STROKE_COLOR[trend];
  const fill = FILL_COLOR[trend];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: "100%", height: "100%", display: "block" }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: fill, stopOpacity: 0.3 }} />
          <stop offset="100%" style={{ stopColor: fill, stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/* Area fill */}
      {trend !== "flat" && (
        <path d={areaPath} fill={`url(#${gradientId})`} stroke="none" />
      )}

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        strokeDasharray={trend === "flat" ? "4 4" : undefined}
      />
    </svg>
  );
}

/** Build an SVG path scaled to the target width/height */
function rescalePoints(
  points: IndicatorPoint[],
  width: number,
  height: number,
): string {
  if (points.length === 0) return `M0,${height / 2} L${width},${height / 2}`;
  if (points.length === 1) return `M0,${height / 2} L${width},${height / 2}`;

  const values = points.map((p) => p.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;
  const pad = height * 0.05; // 5% padding top/bottom

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y =
      range === 0
        ? height / 2
        : height - pad - ((p.v - min) / range) * (height - pad * 2);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return `M${coords.join(" L")}`;
}
