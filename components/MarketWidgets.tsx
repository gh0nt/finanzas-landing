/**
 * MarketWidgets – Server Component
 *
 * Fetches live market data from the Alpha Vantage and BanRep providers
 * server-side. Data is cached with Next.js fetch cache (revalidate in
 * each provider). No API keys are ever sent to the browser.
 */

import { fetchFxHistory } from "@/lib/providers/fxCdn";
import { SparklineWidget } from "@/components/charts/SparklineWidget";
import type { IndicatorData } from "@/lib/indicators";

export async function MarketWidgets() {
  // Free CDN provider — no API key, no rate limits
  const [usdEurResult, eurUsdResult, gbpEurResult] = await Promise.allSettled([
    fetchFxHistory("USD", "EUR", 30),
    fetchFxHistory("EUR", "USD", 30),
    fetchFxHistory("GBP", "EUR", 30),
  ]);

  const usdEur: IndicatorData =
    usdEurResult.status === "fulfilled"
      ? usdEurResult.value
      : {
          indicatorId: "usd-eur",
          label: "USD/EUR",
          unit: "EUR",
          lastUpdated: new Date().toISOString(),
          points: [],
          stale: true,
          error: "Error al obtener USD/EUR",
        };

  const eurUsd: IndicatorData =
    eurUsdResult.status === "fulfilled"
      ? eurUsdResult.value
      : {
          indicatorId: "eur-usd",
          label: "EUR/USD",
          unit: "USD",
          lastUpdated: new Date().toISOString(),
          points: [],
          stale: true,
          error: "Error al obtener EUR/USD",
        };

  const gbpEur: IndicatorData =
    gbpEurResult.status === "fulfilled"
      ? gbpEurResult.value
      : {
          indicatorId: "gbp-eur",
          label: "GBP/EUR",
          unit: "EUR",
          lastUpdated: new Date().toISOString(),
          points: [],
          stale: true,
          error: "Error al obtener GBP/EUR",
        };

  const widgets = [usdEur, eurUsd, gbpEur];

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
