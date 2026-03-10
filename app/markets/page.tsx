/**
 * Markets page – Server Component
 *
 * All indicator data is fetched server-side with ISR caching.
 * No API keys are exposed to the client bundle.
 */

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IndicatorCard } from "@/components/charts/IndicatorCard";
import { ComparatorPanel } from "@/components/comparator/ComparatorPanel";
import { fetchFxHistory } from "@/lib/providers/fxCdn";
import {
  fetchAllEuropeanIndicators,
  EUROPEAN_INDICATORS,
} from "@/lib/providers/twelveData";
import type { IndicatorData } from "@/lib/indicators";
import styles from "./markets.module.css";

export const metadata = {
  title: "Mercados Financieros | Finanzas Sin Ruido",
  description:
    "EUR/USD, GBP/EUR, tasas de cambio y materias primas en tiempo real. Datos del mercado europeo y global.",
};

// ─── helpers ────────────────────────────────────────────────────────────────

function settled<T>(result: PromiseSettledResult<T>, fallback: T): T {
  return result.status === "fulfilled" ? result.value : fallback;
}

function fallbackIndicator(
  id: string,
  label: string,
  unit: string,
): IndicatorData {
  return {
    indicatorId: id,
    label,
    unit,
    lastUpdated: new Date().toISOString(),
    points: [],
    stale: true,
    error: "No disponible",
  };
}

// ─── page ────────────────────────────────────────────────────────────────────

export default async function MarketsPage() {
  // Only the 3 key-indicator cards need server-side data;
  // the full comparator fetches on the client via /api/v1/compare.
  const [eurUsdRes, europeanRes] = await Promise.allSettled([
    fetchFxHistory("EUR", "USD", 60),
    fetchAllEuropeanIndicators(),
  ]);

  const eurUsd = settled(
    eurUsdRes,
    fallbackIndicator("eur-usd", "EUR/USD", "USD"),
  );

  // European indicators
  const europeanRaw: IndicatorData[] =
    europeanRes.status === "fulfilled" ? europeanRes.value : [];

  function findEuropean(id: string): IndicatorData {
    return (
      europeanRaw.find((d) => d.indicatorId === id) ??
      fallbackIndicator(
        id,
        EUROPEAN_INDICATORS[id]?.label ?? id,
        EUROPEAN_INDICATORS[id]?.unit ?? "—",
      )
    );
  }

  const dax = findEuropean("dax");
  const germanBund10y = findEuropean("german-bund-10y");

  const keyIndicators: Array<{ data: IndicatorData; description: string }> = [
    { data: eurUsd, description: "Tipo de cambio Euro / Dólar" },
    { data: dax, description: "Frankfurt Stock Exchange" },
    { data: germanBund10y, description: "European Benchmark Bond" },
  ];

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div
              className="section-tag section-tag--live"
              style={{
                marginBottom: "1.5rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
              }}
            >
              <span className={styles.liveDot} />
              Datos actualizados (ISR)
            </div>
            <h1 className={styles.heroTitle}>
              Mercados <span>Financieros</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Índices europeos, divisas, materias primas, cripto e indicadores
              macroeconómicos. Todo en un solo lugar, actualizado en tiempo
              real.
            </p>
          </div>
        </div>
      </section>

      {/* Key Indicators */}
      <div className={styles.indicatorsOuter}>
        <div className="container">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(230px, 1fr))",
              gap: "1rem",
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            {keyIndicators.map(({ data, description }, idx) => (
              <IndicatorCard
                key={data.indicatorId}
                data={data}
                description={description}
                index={idx}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Full market comparator ─────────────────────────── */}
      <section className={styles.marketsSection}>
        <div className="container">
          <div className={styles.marketsSectionHeader}>
            <div>
              <h2 className={styles.marketsSectionTitle}>Todos los Mercados</h2>
              <p className={styles.marketsSectionSubtitle}>
                6 categorías · más de 24 instrumentos · datos en tiempo real
              </p>
            </div>
            <span className={styles.liveChip}>
              <span className={styles.liveDot} />
              En vivo
            </span>
          </div>
          <ComparatorPanel />
        </div>
      </section>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        <div className="container">
          <p className={styles.disclaimerText}>
            <strong>Aviso Legal:</strong> Los datos presentados en esta página
            son meramente informativos y provienen de fuentes públicas
            (fawazahmed0/exchange-api, FRED / St. Louis Fed) y de Twelve Data
            (índices europeos). Los datos se actualizan periódicamente mediante
            ISR; no representan precios en tiempo real. Finanzas Sin Ruido no
            garantiza la exactitud, completitud o puntualidad de la información.
            Consulta fuentes oficiales antes de tomar decisiones de inversión.
            Este contenido no constituye asesoría financiera.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
