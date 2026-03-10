import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparador de Cuentas de Ahorro Colombia",
  description:
    "Compara las mejores cuentas de ahorro y cuentas corrientes de los bancos colombianos. Encuentra la mayor tasa E.A., sin cuota de manejo y con los mejores beneficios.",
  alternates: {
    canonical: "https://www.finanzassinruido.co/comparators/accounts",
  },
  openGraph: {
    title: "Comparador de Cuentas de Ahorro Colombia | Finanzas sin Ruido",
    description:
      "Compara tasas, cuotas y beneficios de cuentas de ahorro en los principales bancos de Colombia.",
    url: "https://www.finanzassinruido.co/comparators/accounts",
    type: "website",
  },
};

export default function AccountsComparatorPage() {
  return (
    <main>
      <h1>Accounts Comparator</h1>
      <p>Compare account options side by side.</p>
    </main>
  );
}
