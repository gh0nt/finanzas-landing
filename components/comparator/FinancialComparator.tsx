"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type {
  ComparatorProduct,
  ComparatorProductsByType,
  ComparatorType,
} from "@/data/comparator/products";

interface ComparatorCategory {
  id: ComparatorType;
  label: string;
  icon: string;
  title: string;
  description: string;
}

const CATEGORIES: ComparatorCategory[] = [
  {
    id: "savings",
    label: "Cuentas de ahorro",
    icon: "savings",
    title: "Cuentas de ahorro",
    description:
      "Compara tasas de ahorro, bancos y puntajes para encontrar una opción clara para tu dinero.",
  },
  {
    id: "cards",
    label: "Tarjetas de crédito",
    icon: "credit_card",
    title: "Tarjetas de crédito",
    description:
      "Evalúa beneficios, tasas y entidades para elegir una tarjeta alineada con tu perfil de consumo.",
  },
  {
    id: "loans",
    label: "Créditos hipotecarios",
    icon: "account_balance",
    title: "Créditos hipotecarios",
    description:
      "Revisa tasas de referencia y puntajes de créditos de vivienda ordenados de mayor a menor.",
  },
];

const VALID_TYPES = new Set<ComparatorType>(["savings", "cards", "loans"]);

interface FinancialComparatorProps {
  productsByType: ComparatorProductsByType;
}

function getTypeFromParam(type: string | null): ComparatorType {
  return type && VALID_TYPES.has(type as ComparatorType)
    ? (type as ComparatorType)
    : "savings";
}

function getBenefit(product: ComparatorProduct, type: ComparatorType) {
  if (type === "cards") {
    return product.beneficio ?? product.tasa;
  }

  return product.tasa;
}

function formatScore(score: number) {
  return new Intl.NumberFormat("es-ES", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(score);
}

function Sidebar({
  activeType,
  counts,
  onSelect,
}: {
  activeType: ComparatorType;
  counts: Record<ComparatorType, number>;
  onSelect: (type: ComparatorType) => void;
}) {
  return (
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

      <nav aria-label="Categorías del comparador">
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {CATEGORIES.map((category) => {
            const isActive = category.id === activeType;

            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => onSelect(category.id)}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.65rem",
                    padding: "0.65rem 0.85rem",
                    borderRadius: "var(--radius-sm)",
                    border: "none",
                    background: isActive ? "var(--navy)" : "transparent",
                    color: isActive ? "var(--white)" : "var(--navy)",
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "0.9rem",
                    cursor: "pointer",
                    textAlign: "left",
                    transition:
                      "background 0.18s ease, color 0.18s ease, transform 0.18s ease",
                  }}
                >
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "1.1rem" }}
                    aria-hidden="true"
                  >
                    {category.icon}
                  </span>
                  <span style={{ flex: 1 }}>{category.label}</span>
                  <span
                    style={{
                      fontSize: "0.7rem",
                      background: isActive
                        ? "rgba(255,255,255,0.2)"
                        : "var(--muted-light)",
                      color: isActive ? "var(--white)" : "var(--muted)",
                      borderRadius: "999px",
                      padding: "0.1rem 0.45rem",
                      fontWeight: 600,
                    }}
                  >
                    {counts[category.id]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

function ProductTable({
  products,
  type,
}: {
  products: ComparatorProduct[];
  type: ComparatorType;
}) {
  if (products.length === 0) {
    return (
      <p style={{ color: "var(--muted)", padding: "1rem 0" }}>
        No hay productos para mostrar.
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="data-table comparator-products-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Banco</th>
            <th>Tasa / beneficio</th>
            <th style={{ textAlign: "right" }}>Puntaje</th>
            <th style={{ textAlign: "right" }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <TableRow
              key={`${type}-${product.banco}-${product.producto}`}
              product={product}
              type={type}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TableRow({
  product,
  type,
}: {
  product: ComparatorProduct;
  type: ComparatorType;
}) {
  return (
    <tr>
      <td>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.1rem",
          }}
        >
          <span style={{ fontWeight: 700, color: "var(--navy)" }}>
            {product.producto}
          </span>
          {type === "cards" && product.tasa ? (
            <span style={{ fontSize: "0.72rem", color: "var(--muted)" }}>
              {product.tasa}
            </span>
          ) : null}
        </div>
      </td>
      <td>
        <span style={{ color: "var(--muted)", fontWeight: 600 }}>
          {product.banco}
        </span>
      </td>
      <td style={{ color: "var(--navy)", fontWeight: 600 }}>
        {getBenefit(product, type)}
      </td>
      <td style={{ textAlign: "right" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            minWidth: "3.25rem",
            padding: "0.25rem 0.6rem",
            borderRadius: "999px",
            background: "rgba(var(--accent-rgb), 0.12)",
            color: "var(--accent-hover)",
            fontWeight: 800,
            fontSize: "0.82rem",
          }}
        >
          {formatScore(product.score)}
        </span>
      </td>
      <td style={{ textAlign: "right" }}>
        <button
          type="button"
          onClick={() =>
            window.open(product.url, "_blank", "noopener,noreferrer")
          }
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
            padding: "0.45rem 0.8rem",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--muted-light)",
            background: "var(--surface)",
            color: "var(--navy)",
            fontSize: "0.78rem",
            fontWeight: 700,
            cursor: "pointer",
            whiteSpace: "nowrap",
            transition:
              "border-color 0.18s ease, color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease",
          }}
          className="comparator-action"
        >
          Ver más
          <span
            className="material-icons-outlined"
            style={{ fontSize: "0.95rem" }}
            aria-hidden="true"
          >
            arrow_forward
          </span>
        </button>
      </td>
    </tr>
  );
}

export function FinancialComparator({
  productsByType,
}: FinancialComparatorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeType = getTypeFromParam(searchParams.get("type"));
  const activeCategory =
    CATEGORIES.find((category) => category.id === activeType) ?? CATEGORIES[0];

  const counts = useMemo(
    () => ({
      savings: productsByType.savings.length,
      cards: productsByType.cards.length,
      loans: productsByType.loans.length,
    }),
    [productsByType],
  );

  const sortedProducts = useMemo(
    () => [...productsByType[activeType]].sort((a, b) => b.score - a.score),
    [activeType, productsByType],
  );

  function handleTypeChange(type: ComparatorType) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("type", type);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="financial-comparator">
      <Sidebar
        activeType={activeType}
        counts={counts}
        onSelect={handleTypeChange}
      />

      <section
        style={{
          background: "var(--surface)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--muted-light)",
          padding: "1.5rem",
          boxShadow: "var(--shadow-sm)",
          minWidth: 0,
        }}
      >
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
              {activeCategory.title}
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--muted)",
                margin: "0.3rem 0 0",
                maxWidth: "44rem",
              }}
            >
              {activeCategory.description}
            </p>
          </div>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "999px",
              border: "1px solid rgba(var(--accent-rgb), 0.28)",
              background: "rgba(var(--accent-rgb), 0.08)",
              color: "var(--accent-hover)",
              fontSize: "0.78rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: "0.45rem",
                height: "0.45rem",
                borderRadius: "999px",
                background: "var(--accent)",
              }}
              aria-hidden="true"
            />
            {sortedProducts.length} productos
          </span>
        </div>

        <div key={activeType} className="comparator-fade">
          <ProductTable products={sortedProducts} type={activeType} />
        </div>
      </section>

      <style jsx>{`
        .financial-comparator {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: 240px minmax(0, 1fr);
        }

        .comparator-fade {
          animation: comparatorFade 180ms ease-out;
        }

        .comparator-products-table {
          min-width: 760px;
        }

        .comparator-action:hover {
          border-color: rgba(var(--accent-rgb), 0.45) !important;
          color: var(--accent-hover) !important;
          transform: translateY(-1px);
          box-shadow: var(--shadow-sm);
        }

        @keyframes comparatorFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 760px) {
          .financial-comparator {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
