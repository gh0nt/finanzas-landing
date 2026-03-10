import { notFound } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServiceContactForm } from "@/components/ServiceContactForm";
import { serviceProducts, serviceArticles } from "@/data/mockContent";
import styles from "./service.module.css";
import type { Metadata } from "next";

const iconBgMap: Record<string, string> = {
  blue: styles.iconBlue,
  indigo: styles.iconIndigo,
  teal: styles.iconTeal,
  purple: styles.iconPurple,
  orange: styles.iconOrange,
  emerald: styles.iconEmerald,
};

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = serviceArticles.find((a) => a.id === slug);
  if (!article) return { title: "Servicio no encontrado" };
  return {
    title: `${article.headline} | Finanzas Sin Ruido`,
    description: article.intro.slice(0, 160),
  };
}

export function generateStaticParams() {
  return serviceArticles.map((a) => ({ slug: a.id }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = serviceArticles.find((a) => a.id === slug);
  const product = serviceProducts.find((p) => p.id === slug);

  if (!article || !product) notFound();

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroInner}>
            <Link href="/services" className={styles.backLink}>
              <span className="material-icons-outlined">arrow_back</span>
              Todos los servicios
            </Link>

            <div
              className={`${styles.heroIcon} ${iconBgMap[product.iconBg] ?? ""}`}
            >
              <span className="material-icons-outlined">{product.icon}</span>
            </div>

            <div className={styles.heroBadge}>
              <span className="material-icons-outlined">verified</span>
              {product.badge}
            </div>

            <h1 className={styles.heroTitle}>{article.headline}</h1>
            <p className={styles.heroTagline}>{article.tagline}</p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────── */}
      <div className={styles.statsBar}>
        <div className="container">
          <div className={styles.statsGrid}>
            {article.stats.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <div className={styles.statItemIcon}>
                  <span className="material-icons-outlined">{stat.icon}</span>
                </div>
                <div>
                  <p className={styles.statValue}>{stat.value}</p>
                  <p className={styles.statLabel}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main: article + form ─────────────────── */}
      <section className={styles.mainSection}>
        <div className="container">
          <div className={styles.contentGrid}>
            {/* Article column */}
            <div className={styles.article}>
              {/* Intro */}
              <div className={styles.intro}>
                <p className={styles.introText}>{article.intro}</p>
              </div>

              {/* Body sections */}
              <div className={styles.sectionBlock}>
                {article.sections.map((sec, i) => (
                  <div key={i}>
                    <h2 className={styles.sectionTitle}>{sec.title}</h2>
                    <p className={styles.sectionBody}>{sec.body}</p>
                  </div>
                ))}
              </div>

              {/* How it works */}
              <div className={styles.howBlock}>
                <p className={styles.blockLabel}>Proceso</p>
                <h2 className={styles.blockTitle}>¿Cómo empezar?</h2>
                <ol className={styles.stepsList}>
                  {article.howItWorks.map((step) => (
                    <li key={step.step} className={styles.stepItem}>
                      <span className={styles.stepBullet}>{step.step}</span>
                      <div className={styles.stepContent}>
                        <p className={styles.stepTitle}>{step.title}</p>
                        <p className={styles.stepDesc}>{step.description}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Benefits */}
              <div className={styles.benefitsBlock}>
                <h2 className={styles.benefitsTitle}>
                  ¿Por qué este producto?
                </h2>
                <div className={styles.benefitsGrid}>
                  {article.benefits.map((b) => (
                    <div key={b.title} className={styles.benefitItem}>
                      <div className={styles.benefitIcon}>
                        <span className="material-icons-outlined">
                          {b.icon}
                        </span>
                      </div>
                      <div>
                        <p className={styles.benefitTitle}>{b.title}</p>
                        <p className={styles.benefitDesc}>{b.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Considerations */}
              <div className={styles.considerationsBlock}>
                <h3 className={styles.considerationsTitle}>
                  <span className="material-icons-outlined">warning_amber</span>
                  Consideraciones importantes
                </h3>
                <ul className={styles.considerationsList}>
                  {article.considerations.map((c, i) => (
                    <li key={i} className={styles.considerationsItem}>
                      <span className="material-icons-outlined">info</span>
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* For whom */}
              <div className={styles.forWhomBlock}>
                <span
                  className={`material-icons-outlined ${styles.forWhomIcon}`}
                >
                  person_check
                </span>
                <div>
                  <p className={styles.forWhomLabel}>¿Para quién es?</p>
                  <p className={styles.forWhomText}>{article.forWhom}</p>
                </div>
              </div>
            </div>

            {/* CTA Form column (sticky on desktop) */}
            <div className={styles.formColumn}>
              <p className={styles.formColumnLabel}>
                ¿Te interesa este servicio?
              </p>
              <ServiceContactForm defaultServiceId={product.id} />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
