import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Noticias Financieras Colombia",
  description:
    "Últimas noticias sobre el mercado financiero colombiano: banca, inversiones, divisas, economía y regulaciones de la Superintendencia Financiera.",
  alternates: { canonical: "https://www.finanzassinruido.co/news" },
  openGraph: {
    title: "Noticias Financieras Colombia | Finanzas sin Ruido",
    description:
      "Últimas noticias sobre el mercado financiero colombiano: banca, inversiones y economía.",
    url: "https://www.finanzassinruido.co/news",
    type: "website",
  },
};

export default function NewsPage() {
  return (
    <main>
      <h1>News</h1>
      <p>Latest news and announcements.</p>
    </main>
  );
}
