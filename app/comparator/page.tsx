import type { Metadata } from "next";
import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FinancialComparator } from "@/components/comparator/FinancialComparator";
import { COMPARATOR_PRODUCTS } from "@/data/comparator/products";

export const metadata: Metadata = {
  title: "Comparador Financiero",
  description:
    "Compara cuentas de ahorro, tarjetas de crédito y créditos hipotecarios por tasa, beneficio, banco y puntaje.",
  alternates: {
    canonical: "https://www.finanzassinruido.co/comparator",
  },
};

export default function ComparatorPage() {
  return (
    <>
      <Navbar />

      <main
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "2rem 1.5rem 4rem",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "1rem",
            flexWrap: "wrap",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 800,
                color: "var(--navy)",
                margin: "0 0 0.5rem",
              }}
            >
              Comparador Financiero
            </h1>
            <p
              style={{
                color: "var(--muted)",
                fontSize: "0.95rem",
                maxWidth: "52rem",
                margin: 0,
              }}
            >
              Compara cuentas de ahorro, tarjetas de crédito y créditos
              hipotecarios con datos ordenados por puntaje.
            </p>
          </div>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.45rem",
              padding: "0.45rem 0.85rem",
              borderRadius: "999px",
              border: "1px solid rgba(var(--accent-rgb), 0.35)",
              background: "rgba(var(--accent-rgb), 0.08)",
              color: "var(--accent-hover)",
              fontSize: "0.8rem",
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                width: "0.5rem",
                height: "0.5rem",
                borderRadius: "999px",
                background: "var(--accent)",
              }}
              aria-hidden="true"
            />
            Actualizado
          </span>
        </header>

        <Suspense
          fallback={
            <div
              style={{
                display: "grid",
                gap: "1.5rem",
                gridTemplateColumns: "240px 1fr",
              }}
            >
              <div
                style={{
                  minHeight: "16rem",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--surface)",
                  border: "1px solid var(--muted-light)",
                  boxShadow: "var(--shadow-sm)",
                }}
              />
              <div
                style={{
                  minHeight: "22rem",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--surface)",
                  border: "1px solid var(--muted-light)",
                  boxShadow: "var(--shadow-sm)",
                }}
              />
            </div>
          }
        >
          <FinancialComparator productsByType={COMPARATOR_PRODUCTS} />
        </Suspense>
      </main>

      <Footer />
    </>
  );
}
