import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de Créditos y Préstamos Colombia",
  description:
    "Compara tasas de créditos de libre inversión, hipotecarios y vehículo en los principales bancos colombianos. Simula tu cuota y elige la mejor opción para tu bolsillo.",
  alternates: {
    canonical: "https://www.finanzassinruido.co/comparators/loans",
  },
  openGraph: {
    title: "Comparador de Créditos Colombia | Finanzas sin Ruido",
    description:
      "Compara tasas de créditos de libre inversión, hipotecarios y de vehículo en Colombia.",
    url: "https://www.finanzassinruido.co/comparators/loans",
    type: "website",
  },
};

export default function LoansComparatorPage() {
  return (
    <main>
      <h1>Loans Comparator</h1>
      <p>Compare loan terms and rates.</p>
    </main>
  );
}
