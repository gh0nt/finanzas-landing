import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de Tarjetas de Crédito Colombia",
  description:
    "Compara tarjetas de crédito en Colombia: cashback, millas, tasas de interés y cuotas de manejo. Encuentra la tarjeta perfecta según tu perfil de consumo.",
  alternates: {
    canonical: "https://www.finanzassinruido.co/comparators/cards",
  },
  openGraph: {
    title: "Comparador de Tarjetas de Crédito Colombia | Finanzas sin Ruido",
    description:
      "Compara beneficios, cashback, millas y tasas de las mejores tarjetas de crédito en Colombia.",
    url: "https://www.finanzassinruido.co/comparators/cards",
    type: "website",
  },
};

export default function CardsComparatorPage() {
  return (
    <main>
      <h1>Cards Comparator</h1>
      <p>Compare card options and benefits.</p>
    </main>
  );
}
