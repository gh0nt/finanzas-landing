import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { MarketWidgets } from "@/components/MarketWidgets";
import { Navbar } from "@/components/Navbar";
import { NewsSection } from "@/components/NewsSection";
import { ServicesSection } from "@/components/ServicesSection";

export default function Home() {
  return (
    <div>
      <Navbar />
      <main>
        <Hero />
        <MarketWidgets />
        <ServicesSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
}
