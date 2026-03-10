/**
 * ComparatorPanel — Client Component
 *
 * Handles category selection and fetching via /api/v1/compare.
 * All provider calls happen server-side (through Next.js API routes).
 * This component only orchestrates the UI state.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import type { AssetCategory, InstrumentQuote } from "@/lib/comparator/types";
import { CategoryNav } from "./CategoryNav";
import { ComparatorTable } from "./ComparatorTable";

const CATEGORY_TITLES: Record<AssetCategory, string> = {
  energy: "Materias Primas — Energía",
  metals: "Materias Primas — Metales",
  agriculture: "Materias Primas — Agricultura",
  fx: "Divisas (EUR base)",
  crypto: "Criptoactivos",
  indicators: "Indicadores Económicos España",
};

const CATEGORY_DESCRIPTIONS: Record<AssetCategory, string> = {
  energy:
    "Precios internacionales del Brent, WTI, Gas Natural y Aluminio. Fuente: FRED (St. Louis Fed).",
  metals:
    "Oro y Plata vía Alpha Vantage (spot); Cobre desde FRED (St. Louis Fed).",
  agriculture:
    "Café Arábica, Trigo, Maíz y Azúcar. Fuente: FRED (St. Louis Fed).",
  fx: "Tipos de cambio EUR/USD, EUR/GBP, EUR/CHF, EUR/JPY publicados por el BCE.",
  crypto: "Precios en EUR con variación 24h. Fuente: CoinGecko.",
  indicators:
    "IBEX 35, Euríbor 12M, Bono España 10A, Euro Stoxx 50, DAX y Bono Alemán 10A.",
};

function useQuotes(category: AssetCategory) {
  const [quotes, setQuotes] = useState<InstrumentQuote[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (cat: AssetCategory) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/v1/compare?category=${cat}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Error de red" }));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      const body = await res.json();
      setQuotes(body.data);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(category);
  }, [category, load]);

  return { quotes, loading, error };
}

export function ComparatorPanel() {
  const [category, setCategory] = useState<AssetCategory>("fx");
  const { quotes, loading, error } = useQuotes(category);

  return (
    <div
      style={{
        display: "grid",
        gap: "1.5rem",
        gridTemplateColumns: "220px 1fr",
      }}
    >
      {/* Left nav */}
      <aside
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--muted-light)",
          padding: "1rem",
          alignSelf: "start",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        <p
          style={{
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--muted)",
            margin: "0 0 0.75rem 0.5rem",
          }}
        >
          Categorías
        </p>
        <CategoryNav selected={category} onChange={setCategory} />
      </aside>

      {/* Right panel */}
      <div
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--muted-light)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--navy)",
                margin: 0,
              }}
            >
              {CATEGORY_TITLES[category]}
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--muted)",
                margin: "0.3rem 0 0",
                maxWidth: "42rem",
              }}
            >
              {CATEGORY_DESCRIPTIONS[category]}
            </p>
          </div>
          <button
            onClick={() => {
              // Re-trigger the load by toggling category state
              const current = category;
              setCategory("energy"); // force re-render cycle
              setTimeout(() => setCategory(current), 0);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.3rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--muted-light)",
              background: "transparent",
              color: "var(--muted)",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
            title="Actualizar datos"
          >
            <span
              className="material-icons-outlined"
              style={{ fontSize: "0.95rem" }}
            >
              refresh
            </span>
            Actualizar
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "var(--muted)",
              padding: "2rem 0",
            }}
          >
            <span
              className="material-icons-outlined"
              style={{
                fontSize: "1.2rem",
                animation: "spin 1s linear infinite",
              }}
            >
              sync
            </span>
            Cargando datos…
          </div>
        )}

        {!loading && error && (
          <div
            style={{
              color: "var(--red, #e53e3e)",
              background: "rgba(229,62,62,0.06)",
              borderRadius: "var(--radius-sm)",
              padding: "0.75rem 1rem",
              fontSize: "0.875rem",
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
            }}
          >
            <span
              className="material-icons-outlined"
              style={{ fontSize: "1.1rem" }}
            >
              error_outline
            </span>
            {error}
          </div>
        )}

        {!loading && !error && quotes && <ComparatorTable quotes={quotes} />}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          /* Stack nav above table on mobile */
        }
      `}</style>
    </div>
  );
}
