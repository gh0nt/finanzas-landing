/**
 * ComparatorTable
 *
 * Renders a table of InstrumentQuote results.
 * Used by the comparator page for each category panel.
 */

import type { InstrumentQuote } from "@/lib/comparator/types";

interface Props {
  quotes: InstrumentQuote[];
  locale?: string;
}

const CHANGE_COLOR: Record<string, string> = {
  up: "var(--green)",
  down: "var(--red, #e53e3e)",
  flat: "var(--muted)",
};

function formatNum(v: number | null, decimals = 4): string {
  if (v === null) return "—";
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(v);
}

function changeColor(pct: number | null): string {
  if (pct === null) return "var(--muted)";
  if (pct > 0) return CHANGE_COLOR.up;
  if (pct < 0) return CHANGE_COLOR.down;
  return CHANGE_COLOR.flat;
}

function changeIcon(pct: number | null): string {
  if (pct === null) return "remove";
  if (pct > 0) return "arrow_upward";
  if (pct < 0) return "arrow_downward";
  return "remove";
}

function formatTimestamp(iso: string, locale = "es-ES"): string {
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: "short",
      timeStyle: "short",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function sourceLabel(src: string): string {
  const map: Record<string, string> = {
    ecb: "BCE",
    coingecko: "CoinGecko",
    commodities_api: "Commodities-API",
    metals_api: "Metals-API",
    yahoo: "Yahoo Finance",
    bde: "BdE",
  };
  return map[src] ?? src;
}

function valueDecimals(unit: string): number {
  if (unit === "puntos") return 2;
  if (unit === "%") return 4;
  if (unit === "EUR" || unit === "USD") return 2;
  return 4;
}

export function ComparatorTable({ quotes, locale = "es-ES" }: Props) {
  if (quotes.length === 0) {
    return (
      <p style={{ color: "var(--muted)", padding: "1rem 0" }}>
        No hay instrumentos para mostrar.
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th style={{ textAlign: "right" }}>Último</th>
            <th style={{ textAlign: "right" }}>Var. 24h</th>
            <th style={{ textAlign: "right" }}>Var. %</th>
            <th style={{ textAlign: "right" }}>Actualizado</th>
            <th style={{ textAlign: "right" }}>Fuente</th>
          </tr>
        </thead>
        <tbody>
          {quotes.map((q) => {
            const decimals = valueDecimals(q.unit);
            const color = changeColor(q.change_24h_pct);
            const icon = changeIcon(q.change_24h_pct);

            return (
              <tr key={q.id} style={{ opacity: q.stale ? 0.5 : 1 }}>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.1rem",
                    }}
                  >
                    <span style={{ fontWeight: 600 }}>{q.name}</span>
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--muted)",
                        fontFamily: "monospace",
                      }}
                    >
                      {q.symbol}
                    </span>
                  </div>
                </td>

                <td
                  style={{
                    textAlign: "right",
                    fontWeight: 700,
                    color: "var(--navy)",
                  }}
                >
                  {q.stale && q.value === null ? (
                    <span
                      title={q.error}
                      style={{
                        color: "var(--muted)",
                        fontWeight: 400,
                        fontSize: "0.8rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                      }}
                    >
                      <span
                        className="material-icons-outlined"
                        style={{ fontSize: "0.9rem" }}
                      >
                        error_outline
                      </span>
                      Sin datos
                    </span>
                  ) : (
                    <>
                      {formatNum(q.value, decimals)}
                      <span
                        style={{
                          marginLeft: "0.3rem",
                          fontSize: "0.7rem",
                          color: "var(--muted)",
                          fontWeight: 400,
                        }}
                      >
                        {q.currency}
                      </span>
                    </>
                  )}
                </td>

                <td style={{ textAlign: "right", color }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.1rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {icon}
                    </span>
                    {formatNum(q.change_24h, decimals)}
                  </span>
                </td>

                <td
                  style={{
                    textAlign: "right",
                    color,
                    fontWeight: 600,
                    fontSize: "0.875rem",
                  }}
                >
                  {q.change_24h_pct !== null
                    ? `${q.change_24h_pct >= 0 ? "+" : ""}${q.change_24h_pct.toFixed(2)}%`
                    : "—"}
                </td>

                <td
                  style={{
                    textAlign: "right",
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                  }}
                >
                  {formatTimestamp(q.timestamp, locale)}
                </td>

                <td
                  style={{
                    textAlign: "right",
                    fontSize: "0.72rem",
                    color: "var(--muted)",
                  }}
                >
                  {sourceLabel(q.source)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
