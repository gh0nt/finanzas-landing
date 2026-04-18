import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MarketWidgets } from "@/components/MarketWidgets";
import { Navbar } from "@/components/Navbar";
import { NewsSection } from "@/components/NewsSection";
import { ServicesHighlightSection } from "@/components/ServicesHighlightSection";
import { ServicesSection } from "@/components/ServicesSection";

export const metadata: Metadata = {
  title: "Finanzas sin Ruido — Comparador Financiero",
  description:
    "Compara cuentas de ahorro, CDTs, créditos y tarjetas. Consulta la TRM, IBR y precios de materias primas en tiempo real. Plataforma educativa financiera #1 en Colombia.",
  alternates: { canonical: "https://www.finanzassinruido.co" },
  openGraph: {
    title: "Finanzas sin Ruido — Comparador Financiero",
    description:
      "Compara productos financieros y aprende finanzas personales con datos en tiempo real.",
    url: "https://www.finanzassinruido.co",
    type: "website",
  },
};

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <MarketWidgets />
        <ServicesSection />
        <NewsSection />
        <ServicesHighlightSection />
      </main>
      <Footer />
    </div>
  );
}
