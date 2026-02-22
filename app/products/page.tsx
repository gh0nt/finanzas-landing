import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import PricingSection from "./PricingSection";
import { pricingFaqs } from "@/data/mockContent";
import styles from "./products.module.css";

export const metadata = {
  title: "Precios y Planes | Finanzas Sin Ruido",
  description:
    "Elige el plan que mejor se adapta a tus metas financieras. Desde acceso gratuito hasta asesoría ilimitada con expertos certificados.",
};

export default function ProductsPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <div
              className="section-tag section-tag--accent"
              style={{ marginBottom: "1.5rem" }}
            >
              Planes y Precios
            </div>
            <h1 className={styles.heroTitle}>
              Finanzas claras, sin <em>costos ocultos</em>
            </h1>
            <p className={styles.heroSubtitle}>
              Elige el plan que mejor se adapta a tus metas. Empieza gratis y
              escala cuando estés listo.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing cards + comparison toggle — client component */}
      <section className="section section--white">
        <div className="container">
          <PricingSection />
        </div>
      </section>

      {/* FAQ */}
      <section className={`${styles.faqSection} section`}>
        <div className="container">
          <div className="section-tag" style={{ marginBottom: "1rem" }}>
            FAQ
          </div>
          <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>
            Preguntas frecuentes
          </h2>
          <div className={styles.faqList}>
            {pricingFaqs.map((faq, i) => (
              <details key={i} className={styles.faqItem}>
                <summary className={styles.faqSummary}>
                  {faq.question}
                  <span className="material-icons-outlined">expand_more</span>
                </summary>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
