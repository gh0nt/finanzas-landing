"use client";

/**
 * EuropeanIndicatorsWidget
 *
 * Client Component that polls /api/indicators/european every 60 seconds
 * and renders three SparklineWidget cards for the European market indicators:
 *   - EURO STOXX 50
 *   - DAX (Germany)
 *   - German Bund 10Y
 *
 * Shows a spinning sync icon while refreshing and a "last updated" timestamp
 * below the grid.
 */

import { useState, useEffect, useCallback } from "react";
import type { IndicatorData } from "@/lib/indicators";
import { SparklineWidget } from "./SparklineWidget";

const REFRESH_MS = 60_000; // 60 seconds

function makeSkeleton(id: string, label: string): IndicatorData {
  return {
    indicatorId: id,
    label,
    unit: null,
    lastUpdated: new Date().toISOString(),
    points: [],
    stale: true,
    error: "Cargando...",
  };
}

const INITIAL_SKELETONS: IndicatorData[] = [
  makeSkeleton("euro-stoxx-50", "EURO STOXX 50"),
  makeSkeleton("dax", "DAX (Alemania)"),
  makeSkeleton("german-bund-10y", "Bono Alemán 10A"),
];

export function EuropeanIndicatorsWidget() {
  const [indicators, setIndicators] =
    useState<IndicatorData[]>(INITIAL_SKELETONS);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/indicators/european", {
        // Always ask for fresh data from the server (the server handles caching)
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: IndicatorData[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setIndicators(data);
        setLastRefreshed(new Date());
      }
    } catch {
      // Keep previous data on network error; next tick will retry
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch + auto-refresh interval
  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_MS);
    return () => clearInterval(id);
  }, [fetchData]);

  const lastUpdatedLabel = lastRefreshed
    ? new Intl.DateTimeFormat("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(lastRefreshed)
    : null;

  return (
    <section className="market-widgets">
      <div className="container">
        <div className="market-grid" role="list">
          {indicators.map((data, index) => (
            <SparklineWidget key={data.indicatorId} data={data} index={index} />
          ))}
        </div>

        {/* Refresh status bar */}
        <p
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.3rem",
            fontSize: "0.65rem",
            color: "var(--muted)",
            marginTop: "0.5rem",
          }}
          aria-live="polite"
        >
          <span
            className={`material-icons-outlined${isRefreshing ? " spin" : ""}`}
            style={{ fontSize: "0.85rem" }}
            aria-hidden="true"
          >
            {isRefreshing ? "sync" : "schedule"}
          </span>
          {isRefreshing
            ? "Actualizando datos..."
            : lastUpdatedLabel
              ? `Actualizado: ${lastUpdatedLabel} · Refresca cada 60 s`
              : "Cargando datos de mercado…"}
        </p>
      </div>
    </section>
  );
}
