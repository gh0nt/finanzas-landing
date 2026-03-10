import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  serviceProducts,
  processSteps,
  eligibilityItems,
} from "@/data/mockContent";
import styles from "./services.module.css";

export const metadata = {
  title: "Productos de Inversión | Finanzas Sin Ruido",
  description:
    "Explora CDTs, fondos de inversión, acciones de la BVC, pensiones voluntarias y más. Compara opciones y empieza a invertir hoy.",
};

const iconBgMap: Record<string, string> = {
  blue: styles.iconBlue,
  indigo: styles.iconIndigo,
  teal: styles.iconTeal,
  purple: styles.iconPurple,
  orange: styles.iconOrange,
  emerald: styles.iconEmerald,
};

const badgeVariantMap: Record<string, string> = {
  accent: styles.badgeAccent,
  warning: styles.badgeWarning,
  neutral: styles.badgeNeutral,
};

export default function ServicesPage() {
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
              Productos de Inversión
            </div>
            <h1 className={styles.heroTitle}>
              Tu dinero trabajando <br />
              para ti, con claridad
            </h1>
            <p className={styles.heroSubtitle}>
              Compara y accede a los mejores instrumentos financieros del
              mercado colombiano, supervisados y transparentes.
            </p>

            <div className={styles.trustRow}>
              <span className={styles.trustItem}>
                <span className="material-icons-outlined">verified</span>
                Supervisado por SFC
              </span>
              <span className={styles.trustItem}>
                <span className="material-icons-outlined">security</span>
                Seguridad Fogafín
              </span>
              <span className={styles.trustItem}>
                <span className="material-icons-outlined">bolt</span>
                Registro 100% Digital
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className={styles.productsSection}>
        <div className="container">
          <div className={styles.productsHeader}>
            <div>
              <div className="section-tag" style={{ marginBottom: "0.75rem" }}>
                Explora
              </div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Instrumentos disponibles
              </h2>
            </div>
            <p
              className="section-subtitle"
              style={{ maxWidth: "360px", marginBottom: 0 }}
            >
              Cada producto está curado y analizado por nuestro equipo para que
              tomes la mejor decisión.
            </p>
          </div>

          <div className={styles.prodGrid}>
            {serviceProducts.map((product) => (
              <article key={product.id} className={styles.prodCard}>
                <div className={styles.prodCardTop}>
                  <div
                    className={`${styles.prodIcon} ${iconBgMap[product.iconBg] ?? ""}`}
                  >
                    <span className="material-icons-outlined">
                      {product.icon}
                    </span>
                  </div>
                  <span
                    className={`${styles.prodBadge} ${badgeVariantMap[product.badgeVariant] ?? ""}`}
                  >
                    {product.badge}
                  </span>
                </div>
                <h3 className={styles.prodName}>{product.name}</h3>
                <p className={styles.prodDesc}>{product.description}</p>
                <ul className={styles.prodFeatures}>
                  {product.features.map((f, i) => (
                    <li key={i} className={styles.prodFeature}>
                      <span className="material-icons-outlined">check</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/services/${product.id}`}
                  className={styles.prodCta}
                >
                  {product.ctaLabel}
                  <span className="material-icons-outlined">arrow_forward</span>
                </Link>{" "}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How to start */}
      <section className={styles.howSection}>
        <div className="container">
          <div className={styles.howGrid}>
            {/* Timeline */}
            <div>
              <div className="section-tag" style={{ marginBottom: "1rem" }}>
                Proceso
              </div>
              <h2 className="section-title" style={{ marginBottom: "2.5rem" }}>
                ¿Cómo empezar a invertir?
              </h2>
              <ol className={styles.timeline}>
                {processSteps.map((step) => (
                  <li key={step.number} className={styles.step}>
                    <span
                      className={`${styles.stepBullet} ${
                        step.variant === "accent"
                          ? styles["stepBullet--accent"]
                          : ""
                      }`}
                    >
                      {step.number}
                    </span>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                    <p className={styles.stepDesc}>{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* Eligibility box */}
            <div className={styles.eligBox}>
              <h3 className={styles.eligTitle}>¿Quién puede invertir?</h3>
              <p className={styles.eligSubtitle}>
                Cualquier persona natural mayor de edad en Colombia. Solo
                necesitas:
              </p>
              <ul className={styles.eligList}>
                {eligibilityItems.map((item, i) => (
                  <li key={i} className={styles.eligItem}>
                    <span className="material-icons-outlined">{item.icon}</span>
                    {item.text}
                  </li>
                ))}
              </ul>
              <a href="/guides" className={styles.eligCta}>
                Ver guía de inicio
                <span className="material-icons-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
