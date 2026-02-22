/**
 * ChartSkeleton – Animated loading placeholder for chart cards.
 * Used while server data is being fetched (Suspense fallback).
 */

interface ChartSkeletonProps {
  height?: number | string;
  rows?: number;
}

export function ChartSkeleton({ height = 80, rows = 3 }: ChartSkeletonProps) {
  return (
    <div
      role="status"
      aria-label="Cargando datos del indicador…"
      style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton-card"
          style={{
            height: typeof height === "number" ? `${height}px` : height,
            borderRadius: "var(--radius-md)",
            background:
              "linear-gradient(90deg, var(--muted-light) 25%, #e8ecf0 50%, var(--muted-light) 75%)",
            backgroundSize: "200% 100%",
            animation: "skeleton-shimmer 1.4s ease infinite",
          }}
        />
      ))}
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}

/** Inline skeleton for a single chart area */
export function ChartAreaSkeleton({ height = 60 }: { height?: number }) {
  return (
    <div
      role="status"
      aria-label="Cargando gráfico…"
      style={{
        height,
        borderRadius: "var(--radius-sm)",
        background:
          "linear-gradient(90deg, var(--muted-light) 25%, #e8ecf0 50%, var(--muted-light) 75%)",
        backgroundSize: "200% 100%",
        animation: "skeleton-shimmer 1.4s ease infinite",
      }}
    >
      <style>{`
        @keyframes skeleton-shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
