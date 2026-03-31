import type { IndicatorPoint, Trend } from "./indicators";

function normalizeDateTimeLabel(value: string): string {
  return value.replace(/[\u00A0\u202F\s]+/gu, " ").trim();
}

/**
 * Convert an array of IndicatorPoints to an SVG path string
 * suitable for a viewBox="0 0 100 20" sparkline.
 */
export function pointsToSvgPath(points: IndicatorPoint[]): string {
  if (points.length === 0) return "M0,10 L100,10";
  if (points.length === 1) return `M0,10 L100,10`;

  const values = points.map((p) => p.v);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 100;
    // Map value to y: top = 1, bottom = 19 (leave 1px padding each side)
    const y = range === 0 ? 10 : 19 - ((p.v - min) / range) * 18;
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  });

  return `M${coords.join(" L")}`;
}

/**
 * Derive the trend (up/down/flat) by comparing the first and last point.
 */
export function deriveTrend(points: IndicatorPoint[]): Trend {
  if (points.length < 2) return "flat";
  const first = points[0].v;
  const last = points[points.length - 1].v;
  const diff = (last - first) / Math.abs(first || 1);
  if (diff > 0.0005) return "up";
  if (diff < -0.0005) return "down";
  return "flat";
}

/**
 * Percentage change from first to last point.
 */
export function percentChange(points: IndicatorPoint[]): number | null {
  if (points.length < 2) return null;
  const first = points[0].v;
  const last = points[points.length - 1].v;
  if (first === 0) return null;
  return ((last - first) / first) * 100;
}

/** Format a number according to a locale */
export function formatValue(
  value: number,
  unit: string | null,
  locale: string = "es-CO",
): string {
  // Currency-like units
  if (unit && /eur/i.test(unit)) {
    return new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  if (unit && /usd/i.test(unit)) {
    return new Intl.NumberFormat(locale, {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
  if (unit === "%") {
    return `${value.toFixed(2)}%`;
  }
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Format an ISO timestamp to a human-readable date */
export function formatDate(iso: string, locale: string = "es-CO"): string {
  try {
    return normalizeDateTimeLabel(
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(iso)),
    );
  } catch {
    return iso.slice(0, 10);
  }
}

/** Format with time */
export function formatDateTime(iso: string, locale: string = "es-CO"): string {
  try {
    return normalizeDateTimeLabel(
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(iso)),
    );
  } catch {
    return iso.slice(0, 16).replace("T", " ");
  }
}

/** Format a Date object with time */
export function formatDateTimeValue(
  value: Date,
  locale: string = "es-CO",
): string {
  try {
    return normalizeDateTimeLabel(
      new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(value),
    );
  } catch {
    return value.toISOString().slice(0, 16).replace("T", " ");
  }
}
