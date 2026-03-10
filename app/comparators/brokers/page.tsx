import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de Brókers de Inversión Colombia",
  description:
    "Compara las comisiones, productos y servicios de los principales brókers de inversión disponibles en Colombia. Encuentra el bróker ideal para invertir en acciones y ETFs.",
  alternates: {
    canonical: "https://www.finanzassinruido.co/comparators/brokers",
  },
  openGraph: {
    title: "Comparador de Brókers de Inversión Colombia | Finanzas sin Ruido",
    description:
      "Compara comisiones y servicios de los mejores brókers de inversión en Colombia.",
    url: "https://www.finanzassinruido.co/comparators/brokers",
    type: "website",
  },
};

export default function BrokersComparatorPage() {
  return (
    <main>
      <h1>Brokers Comparator</h1>
      <p>Compare broker fees and services.</p>
    </main>
  );
}
