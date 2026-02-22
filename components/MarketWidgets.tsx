/**
 * MarketWidgets – Server Component
 *
 * Fetches live market data from the Alpha Vantage and BanRep providers
 * server-side. Data is cached with Next.js fetch cache (revalidate in
 * each provider). No API keys are ever sent to the browser.
 */

import { fetchFxDaily } from "@/lib/providers/alphaVantage";
import { fetchUVR } from "@/lib/providers/banrep";
import { SparklineWidget } from "@/components/charts/SparklineWidget";
import type { IndicatorData } from "@/lib/indicators";

export async function MarketWidgets() {
  // Fetch all three widgets in parallel; each settles independently
  const [trmResult, eurCopResult, uvrResult] = await Promise.allSettled([
    fetchFxDaily("USD", "COP"),
    fetchFxDaily("EUR", "COP"),
    fetchUVR(),
  ]);

  const trm: IndicatorData =
    trmResult.status === "fulfilled"
      ? {
          ...trmResult.value,
          indicatorId: "trm",
          label: "TRM (USD/COP)",
          unit: "COP",
        }
      : {
          indicatorId: "trm",
          label: "TRM (USD/COP)",
          unit: "COP",
          lastUpdated: new Date().toISOString(),
          points: [],
          stale: true,
          error: "Error al obtener TRM",
        };

  const eurCop: IndicatorData =
    eurCopResult.status === "fulfilled"
      ? eurCopResult.value
      : {
          indicatorId: "eur-cop",
          label: "EUR/COP",
          unit: "COP",
          lastUpdated: new Date().toISOString(),
          points: [],
          stale: true,
          error: "Error al obtener EUR/COP",
        };

  const uvr: IndicatorData =
    uvrResult.status === "fulfilled"
      ? uvrResult.value
      : {
          indicatorId: "uvr",
          label: "UVR",
          unit: "COP",
          lastUpdated: new Date().toISOString(),
          points: [],
          stale: true,
          error: "Error al obtener UVR",
        };

  const widgets = [trm, eurCop, uvr];

  return (
    <section className="market-widgets">
      <div className="container">
        <div className="market-grid" role="list">
          {widgets.map((data, index) => (
            <SparklineWidget key={data.indicatorId} data={data} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
