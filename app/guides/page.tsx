import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import styles from "./guides.module.css";

export const metadata = {
  title: "Guías Educativas | Finanzas sin Ruido",
  description:
    "Guías completas y tutoriales para aprender finanzas personales e inversiones en Colombia.",
};

const CATEGORIES = [
  "Todas",
  "Ahorro",
  "Inversión",
  "Crédito",
  "Seguros",
  "Impuestos",
];

const featuredGuide = {
  slug: "guia-completa-cuentas-de-ahorro-colombia",
  category: "Ahorro",
  title: "Guía completa: Cómo elegir la mejor cuenta de ahorros en Colombia",
  excerpt:
    "Analizamos tasas E.A., cuotas de manejo, coberturas del Fogafín y beneficios adicionales de los 20 bancos más grandes del país para que su dinero rinda más.",
  readTime: "10 min",
  chapters: 5,
  level: "Principiante",
};

const learningPaths = [
  {
    icon: "savings",
    title: "Ahorro Inteligente",
    desc: "Aprenda a maximizar sus ahorros con las mejores cuentas y CDTs del mercado colombiano.",
    href: "/guides?cat=Ahorro",
    color: "#4caf91",
    bg: "rgba(76,175,145,0.1)",
  },
  {
    icon: "trending_up",
    title: "Inversión Básica",
    desc: "Desde acciones en la BVC hasta fondos de inversión: comience a invertir desde $100.000.",
    href: "/guides?cat=Inversión",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.1)",
  },
  {
    icon: "credit_score",
    title: "Manejo del Crédito",
    desc: "Entienda cómo funcionan las centrales de riesgo y aprenda a usar el crédito a su favor.",
    href: "/guides?cat=Crédito",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
  },
];

interface Guide {
  slug: string;
  category: string;
  categoryStyle: string;
  title: string;
  excerpt: string;
  readTime: string;
  chapters: number;
  level: "Principiante" | "Intermedio" | "Avanzado";
  levelDots: number;
  gradient: string;
  icon: string;
}

const guides: Guide[] = [
  {
    slug: "como-funcionan-los-cdts",
    category: "Inversión",
    categoryStyle: "blue",
    title: "CDTs: Todo lo que necesita saber antes de invertir",
    excerpt:
      "Tasas, plazos, riesgos, garantías del Fogafín y cuándo conviene más un CDT que una cuenta de ahorros.",
    readTime: "8 min",
    chapters: 6,
    level: "Principiante",
    levelDots: 1,
    gradient: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
    icon: "account_balance",
  },
  {
    slug: "solicitar-credito-hipotecario-colombia",
    category: "Crédito",
    categoryStyle: "purple",
    title: "Cómo solicitar un crédito hipotecario paso a paso en Colombia",
    excerpt:
      "Desde la preaprobación hasta el desembolso: documentos necesarios, tasas UVR vs tasa fija y simulador incluido.",
    readTime: "12 min",
    chapters: 7,
    level: "Intermedio",
    levelDots: 2,
    gradient: "linear-gradient(135deg,#3b0764,#6d28d9)",
    icon: "real_estate_agent",
  },
  {
    slug: "seguros-indispensables-familia-colombia",
    category: "Seguros",
    categoryStyle: "orange",
    title: "Los 5 seguros indispensables para proteger a su familia",
    excerpt:
      "Seguro de vida, salud complementaria, hogar y desempleo: comparamos primas y coberturas de las aseguradoras más grandes.",
    readTime: "7 min",
    chapters: 5,
    level: "Principiante",
    levelDots: 1,
    gradient: "linear-gradient(135deg,#431407,#9a3412)",
    icon: "shield",
  },
  {
    slug: "declarar-renta-empleado-colombia",
    category: "Impuestos",
    categoryStyle: "",
    title: "Cómo declarar renta siendo empleado en Colombia 2025",
    excerpt:
      "Guía paso a paso para la declaración de renta: quién debe declarar, deducciones permitidas y cómo evitar sanciones.",
    readTime: "9 min",
    chapters: 6,
    level: "Intermedio",
    levelDots: 2,
    gradient: "linear-gradient(135deg,#064e3b,#047857)",
    icon: "receipt_long",
  },
  {
    slug: "invertir-acciones-bvc-principiantes",
    category: "Inversión",
    categoryStyle: "blue",
    title: "Guía del inversionista principiante: Acciones en la BVC",
    excerpt:
      "Cómo abrir una cuenta en un comisionista, qué acciones colombianas analizar y cómo construir un portafolio diversificado.",
    readTime: "11 min",
    chapters: 8,
    level: "Intermedio",
    levelDots: 2,
    gradient: "linear-gradient(135deg,#1e1b4b,#4338ca)",
    icon: "candlestick_chart",
  },
  {
    slug: "pensiones-en-colombia-todo-lo-que-debe-saber",
    category: "Ahorro",
    categoryStyle: "",
    title: "Pensiones en Colombia: RPM vs RAIS y qué conviene más",
    excerpt:
      "Analizamos Colpensiones vs los fondos privados: cuánto ahorra, cuándo se pensiona y cómo maximizar su mesada.",
    readTime: "14 min",
    chapters: 9,
    level: "Avanzado",
    levelDots: 3,
    gradient: "linear-gradient(135deg,#0f2027,#2c5364)",
    icon: "elderly",
  },
];

function LevelDots({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span className={styles.guideLevel}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={`${styles.guideLevelDot} ${i < count ? styles.filled : ""}`}
        />
      ))}
    </span>
  );
}

export default function GuidesPage() {
  return (
    <div>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroInner}>
              <div>
                <div className={styles.heroBadge}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "1rem" }}
                  >
                    school
                  </span>
                  Centro Educativo
                </div>
                <h1 className={styles.heroTitle}>
                  Aprenda finanzas <span>de verdad</span>
                </h1>
                <p className={styles.heroSubtitle}>
                  Guías paso a paso escritas por expertos certificados, pensadas
                  para la realidad financiera colombiana. Sin jerga, sin letra
                  pequeña.
                </p>
              </div>
              <div className={styles.heroStats}>
                <div className={styles.heroStat}>
                  <span className={styles.heroStatNumber}>40+</span>
                  <span className={styles.heroStatLabel}>Guías</span>
                </div>
                <div className={styles.heroStat}>
                  <span className={styles.heroStatNumber}>12k</span>
                  <span className={styles.heroStatLabel}>Lectores</span>
                </div>
                <div className={styles.heroStat}>
                  <span className={styles.heroStatNumber}>98%</span>
                  <span className={styles.heroStatLabel}>Satisfacción</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Featured Guide ── */}
        <section className={styles.featuredSection}>
          <div className="container">
            <Link
              href={`/guides/${featuredGuide.slug}`}
              className={styles.featuredCard}
            >
              <div className={styles.featuredImageWrapper}>
                <span
                  className={`material-icons-outlined ${styles.featuredIconBg}`}
                  style={{ fontSize: "8rem" }}
                >
                  savings
                </span>
                <span className={styles.featuredBadge}>Guía Destacada</span>
                <span className={styles.featuredLevelBadge}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "0.85rem" }}
                  >
                    school
                  </span>
                  Principiante
                </span>
              </div>
              <div className={styles.featuredBody}>
                <div className={styles.featuredCategoryRow}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "1rem" }}
                  >
                    savings
                  </span>
                  {featuredGuide.category}
                </div>
                <h2 className={styles.featuredTitle}>{featuredGuide.title}</h2>
                <p className={styles.featuredExcerpt}>
                  {featuredGuide.excerpt}
                </p>
                <div className={styles.featuredMeta}>
                  <span className={styles.featuredMetaItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      schedule
                    </span>
                    {featuredGuide.readTime} de lectura
                  </span>
                  <span className={styles.featuredMetaItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      list
                    </span>
                    {featuredGuide.chapters} capítulos
                  </span>
                </div>
                <span className={styles.featuredCta}>
                  Empezar guía
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "1rem" }}
                  >
                    arrow_forward
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Filter Bar ── */}
        <div className={styles.filtersBar}>
          <div className="container">
            <div className={styles.filtersInner}>
              <div className={styles.filterTabs}>
                {CATEGORIES.map((cat, i) => (
                  <button
                    key={cat}
                    className={`${styles.filterBtn} ${i === 0 ? styles.filterBtnActive : ""}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Guides Grid ── */}
        <section className={styles.guidesSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Todas las guías</h2>
            <div className={styles.guidesGrid}>
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className={styles.guideCard}
                >
                  <div
                    className={styles.guideImageWrapper}
                    style={{ background: guide.gradient }}
                  >
                    <span
                      className={`material-icons-outlined ${styles.guidePlaceholderIcon}`}
                    >
                      {guide.icon}
                    </span>
                  </div>
                  <div className={styles.guideBody}>
                    <div className={styles.guideMeta}>
                      <span
                        className={`${styles.guideCategory} ${
                          guide.categoryStyle
                            ? styles[guide.categoryStyle as keyof typeof styles]
                            : ""
                        }`}
                      >
                        {guide.category}
                      </span>
                      <LevelDots count={guide.levelDots} />
                    </div>
                    <h3 className={styles.guideTitle}>{guide.title}</h3>
                    <p className={styles.guideExcerpt}>{guide.excerpt}</p>
                  </div>
                  <div className={styles.guideFooter}>
                    <div className={styles.guideStats}>
                      <span className={styles.guideStat}>
                        <span
                          className="material-icons-outlined"
                          style={{ fontSize: "1rem" }}
                        >
                          schedule
                        </span>
                        {guide.readTime}
                      </span>
                      <span className={styles.guideStat}>
                        <span
                          className="material-icons-outlined"
                          style={{ fontSize: "1rem" }}
                        >
                          list
                        </span>
                        {guide.chapters} capítulos
                      </span>
                    </div>
                    <span className={styles.guideArrow}>
                      <span className="material-icons-outlined">
                        arrow_forward
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Learning Paths ── */}
        <section className={styles.pathsSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Rutas de aprendizaje</h2>
            <div className={styles.pathsGrid}>
              {learningPaths.map((path) => (
                <div key={path.title} className={styles.pathCard}>
                  <div
                    className={styles.pathIconWrapper}
                    style={{ background: path.bg, color: path.color }}
                  >
                    <span className="material-icons-outlined">{path.icon}</span>
                  </div>
                  <h4 className={styles.pathTitle}>{path.title}</h4>
                  <p className={styles.pathDesc}>{path.desc}</p>
                  <Link
                    href={path.href}
                    className={styles.pathLink}
                    style={{ color: path.color }}
                  >
                    Explorar ruta
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      arrow_forward
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
