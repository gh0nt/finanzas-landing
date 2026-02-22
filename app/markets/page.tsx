/**
 * Markets page – Server Component
 *
 * All indicator data is fetched server-side with ISR caching.
 * No API keys are exposed to the client bundle.
 */

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { IndicatorCard } from "@/components/charts/IndicatorCard";
import { FxTable } from "@/components/charts/FxTable";
import { CommodityGrid } from "@/components/charts/CommodityGrid";
import {
  fetchFxDaily,
  fetchCommodity,
  fetchGold,
} from "@/lib/providers/alphaVantage";
import { fetchUVR, fetchIBR } from "@/lib/providers/banrep";
import type { IndicatorData } from "@/lib/indicators";
import styles from "./markets.module.css";

export const metadata = {
  title: "Mercados Financieros | Finanzas Sin Ruido",
  description:
    "TRM, COLCAP, acciones de la BVC, tasas de cambio y materias primas en tiempo real. Datos del mercado colombiano y global.",
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
  // Fetch all data in parallel; individual failures don't break the page
  const [
    trmRes,
    eurCopRes,
    gbpCopRes,
    brlCopRes,
    wtiRes,
    coffeeRes,
    goldRes,
    uvrRes,
    ibrRes,
  ] = await Promise.allSettled([
    fetchFxDaily("USD", "COP"),
    fetchFxDaily("EUR", "COP"),
    fetchFxDaily("GBP", "COP"),
    fetchFxDaily("BRL", "COP"),
    fetchCommodity("wti"),
    fetchCommodity("coffee"),
    fetchGold(),
    fetchUVR(),
    fetchIBR(),
  ]);

  const trm: IndicatorData = {
    ...settled(trmRes, fallbackIndicator("trm", "TRM (USD/COP)", "COP")),
    indicatorId: "trm",
    label: "TRM (USD/COP)",
    unit: "COP",
  };
  const eurCop = settled(
    eurCopRes,
    fallbackIndicator("eur-cop", "EUR/COP", "COP"),
  );
  const gbpCop = settled(
    gbpCopRes,
    fallbackIndicator("gbp-cop", "GBP/COP", "COP"),
  );
  const brlCop = settled(
    brlCopRes,
    fallbackIndicator("brl-cop", "BRL/COP", "COP"),
  );
  const wti = settled(
    wtiRes,
    fallbackIndicator("wti", "Petróleo WTI", "USD/barril"),
  );
  const coffee = settled(
    coffeeRes,
    fallbackIndicator("coffee", "Café", "USD/libra"),
  );
  const gold = settled(goldRes, fallbackIndicator("gold", "Oro", "USD/oz"));
  const uvr = settled(uvrRes, fallbackIndicator("uvr", "UVR", "COP"));
  const ibr = settled(ibrRes, fallbackIndicator("ibr", "IBR O/N", "%"));

  // COLCAP is not available from Alpha Vantage free tier → show stale card
  const colcap = fallbackIndicator("colcap", "MSCI COLCAP", "puntos");

  const keyIndicators: Array<{ data: IndicatorData; description: string }> = [
    { data: trm, description: "Tasa Representativa del Mercado" },
    {
      data: colcap,
      description: "Índice Principal BVC – sin datos API gratuita",
    },
    { data: uvr, description: "Unidad de Valor Real" },
    { data: ibr, description: "Indicador Bancario de Referencia" },
  ];

  const fxRatesLive: IndicatorData[] = [trm, eurCop, gbpCop, brlCop];

  const commoditiesLive = [
    { ...wti, icon: "water_drop" },
    { ...coffee, icon: "local_cafe" },
    { ...gold, icon: "diamond" },
    // Colombian coal — not in Alpha Vantage free tier
    {
      ...fallbackIndicator("coal", "Carbón Colombiano", "USD/ton"),
      icon: "factory",
    },
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
              Mercados <span>Colombianos</span>
            </h1>
            <p className={styles.heroSubtitle}>
              TRM, COLCAP, tasas de cambio y materias primas. Información
              actualizada para decisiones informadas.
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
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: "1rem",
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

      {/* Main data grid */}
      <section className={styles.mainSection}>
        <div className="container">
          <div className={styles.dataGrid}>
            {/* BVC Stocks – notice: prices not available from free API */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Acciones BVC</h2>
                <span className={styles.panelMeta}>Precio en COP</span>
              </div>
              <div
                style={{
                  padding: "2rem",
                  textAlign: "center",
                  color: "var(--muted)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
                role="status"
                aria-label="Precios de acciones BVC no disponibles"
              >
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: "2rem", color: "var(--muted-light)" }}
                >
                  show_chart
                </span>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Los precios de acciones de la BVC no están disponibles con la
                  clave gratuita de Alpha Vantage.
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem" }}>
                  Consulta directamente en{" "}
                  <a
                    href="https://www.bvc.com.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)" }}
                  >
                    bvc.com.co
                  </a>{" "}
                  o actualiza al plan premium de{"  "}
                  <a
                    href="https://www.alphavantage.co/premium/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--accent)" }}
                  >
                    Alpha Vantage
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* FX + Commodities */}
            <div style={{ display: "grid", gap: "2rem" }}>
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Tasas de Cambio</h2>
                  <span className={styles.panelMeta}>
                    Alpha Vantage / BanRep
                  </span>
                </div>
                <FxTable rates={fxRatesLive} />
              </div>

              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2 className={styles.panelTitle}>Materias Primas</h2>
                  <span className={styles.panelMeta}>
                    Precios Internacionales
                  </span>
                </div>
                <CommodityGrid commodities={commoditiesLive} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        <div className="container">
          <p className={styles.disclaimerText}>
            <strong>Aviso Legal:</strong> Los datos presentados en esta página
            son meramente informativos y provienen de fuentes públicas (Alpha
            Vantage, BanRep / Datos Abiertos Colombia). Los datos se actualizan
            periódicamente mediante ISR; no representan precios en tiempo real.
            Finanzas Sin Ruido no garantiza la exactitud, completitud o
            puntualidad de la información. Consulta fuentes oficiales —Banco de
            la República, SFC, BVC— antes de tomar decisiones de inversión. Este
            contenido no constituye asesoría financiera.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
