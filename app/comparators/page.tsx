import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComparatorPanel } from "@/components/comparator/ComparatorPanel";

export const metadata: Metadata = {
  title: "Comparador de Mercados | Finanzas Sin Ruido",
  description:
    "Cotizaciones en tiempo real de materias primas, divisas, criptoactivos e indicadores económicos españoles. Compara Brent, Oro, Bitcoin, IBEX 35 y más.",
};

export default function ComparatorsPage() {
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
        {/* Page header */}
        <header style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              color: "var(--navy)",
              margin: "0 0 0.5rem",
            }}
          >
            Comparador de Mercados
          </h1>
          <p
            style={{
              color: "var(--muted)",
              fontSize: "0.95rem",
              maxWidth: "52rem",
              margin: 0,
            }}
          >
            Cotizaciones actualizadas de materias primas, divisas, criptoactivos
            e indicadores económicos. Todos los precios en euros (EUR).
          </p>
        </header>

        {/* Interactive comparator — client component */}
        <ComparatorPanel />
      </main>

      <Footer />
    </>
  );
}
