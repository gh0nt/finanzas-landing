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
import { fetchFxHistory } from "@/lib/providers/fxCdn";
import { fetchFredCommodity } from "@/lib/providers/fred";
import { fetchUVR, fetchIBR } from "@/lib/providers/banrep";
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
  // Fetch all data in parallel; individual failures don't break the page
  const [
    usdEurRes,
    eurUsdRes,
    gbpEurRes,
    brlEurRes,
    wtiRes,
    goldRes,
    uvrRes,
    ibrRes,
  ] = await Promise.allSettled([
    fetchFxHistory("USD", "EUR", 60),
    fetchFxHistory("EUR", "USD", 60),
    fetchFxHistory("GBP", "EUR", 60),
    fetchFxHistory("BRL", "EUR", 60),
    fetchFredCommodity("wti"),
    fetchFredCommodity("gold"),
    fetchUVR(),
    fetchIBR(),
  ]);

  const usdEur: IndicatorData = {
    ...settled(usdEurRes, fallbackIndicator("usd-eur", "USD/EUR", "EUR")),
    indicatorId: "usd-eur",
    label: "USD/EUR",
    unit: "EUR",
  };
  const eurUsd = settled(
    eurUsdRes,
    fallbackIndicator("eur-usd", "EUR/USD", "USD"),
  );
  const gbpEur = settled(
    gbpEurRes,
    fallbackIndicator("gbp-eur", "GBP/EUR", "EUR"),
  );
  const brlEur = settled(
    brlEurRes,
    fallbackIndicator("brl-eur", "BRL/EUR", "EUR"),
  );
  const wti = settled(
    wtiRes,
    fallbackIndicator("wti", "Petróleo WTI", "USD/barril"),
  );
  const gold = settled(goldRes, fallbackIndicator("gold", "Oro", "USD/oz"));
  const uvr = settled(uvrRes, fallbackIndicator("uvr", "UVR", "EUR"));
  const ibr = settled(ibrRes, fallbackIndicator("ibr", "IBR O/N", "%"));
  // Coffee: not on FRED; show informative placeholder
  const coffee = fallbackIndicator("coffee", "Café (ICO)", "USD/libra");
  // COLCAP: no free public API
  const colcap = fallbackIndicator("colcap", "MSCI COLCAP", "puntos");

  const keyIndicators: Array<{ data: IndicatorData; description: string }> = [
    { data: usdEur, description: "Tipo de Cambio USD/EUR" },
    {
      data: colcap,
      description: "Índice Principal BVC – sin datos API gratuita",
    },
    { data: uvr, description: "Unidad de Valor Real" },
    { data: ibr, description: "Indicador Bancario de Referencia" },
  ];

  const fxRatesLive: IndicatorData[] = [usdEur, eurUsd, gbpEur, brlEur];

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
              Mercados <span>Europeos</span>
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
                <span className={styles.panelMeta}>Precio en EUR</span>
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
                  Los precios de acciones de la BVC no tienen fuente de datos
                  gratuita disponible.
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
                  <span className={styles.panelMeta}>Fawazahmed0 / BanRep</span>
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
            son meramente informativos y provienen de fuentes públicas
            (fawazahmed0/exchange-api, FRED / St. Louis Fed). Los datos se
            actualizan periódicamente mediante ISR; no representan precios en
            tiempo real. Finanzas Sin Ruido no garantiza la exactitud,
            completitud o puntualidad de la información. Consulta fuentes
            oficiales antes de tomar decisiones de inversión. Este contenido no
            constituye asesoría financiera.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
