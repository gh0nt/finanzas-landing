import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import styles from "./guides.module.css";
import { categoryToStyle, levelToDots } from "@/lib/cms/utils";
import { getPublishedGuides } from "@/lib/cms/guides";

export const metadata = {
  title: "Guías Educativas | Finanzas sin Ruido",
  description:
    "Guías completas y tutoriales para aprender finanzas personales e inversiones en Colombia.",
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
  readTime: number;
  chapters: number;
  level: "Principiante" | "Intermedio" | "Avanzado";
  levelDots: number;
  gradient: string;
  icon: string;
}

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

type GuidesPageProps = {
  searchParams: Promise<{ cat?: string }>;
};

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const params = await searchParams;
  const selectedCategory = params.cat ?? "Todas";

  const allGuidesData = await getPublishedGuides();

  const categories = [
    "Todas",
    ...new Set(allGuidesData.map((guide) => guide.category).filter(Boolean)),
  ];

  const featuredGuideData =
    allGuidesData.find((guide) => guide.featured) ?? allGuidesData[0] ?? null;

  const visibleGuidesData =
    selectedCategory === "Todas"
      ? allGuidesData
      : allGuidesData.filter((guide) => guide.category === selectedCategory);

  const guides: Guide[] = visibleGuidesData.map((guide) => ({
    slug: guide.slug,
    category: guide.category,
    categoryStyle: categoryToStyle(guide.category),
    title: guide.title,
    excerpt: guide.excerpt,
    readTime: guide.reading_minutes,
    chapters: guide.chapters,
    level: guide.level,
    levelDots: levelToDots(guide.level),
    gradient: guide.cover_gradient,
    icon: guide.cover_icon,
  }));

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
            {featuredGuideData ? (
              <Link
                href={`/guides/${featuredGuideData.slug}`}
                className={styles.featuredCard}
              >
                <div className={styles.featuredImageWrapper}>
                  <span
                    className={`material-icons-outlined ${styles.featuredIconBg}`}
                    style={{ fontSize: "8rem" }}
                  >
                    {featuredGuideData.cover_icon}
                  </span>
                  <span className={styles.featuredBadge}>Guía Destacada</span>
                  <span className={styles.featuredLevelBadge}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.85rem" }}
                    >
                      school
                    </span>
                    {featuredGuideData.level}
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
                    {featuredGuideData.category}
                  </div>
                  <h2 className={styles.featuredTitle}>
                    {featuredGuideData.title}
                  </h2>
                  <p className={styles.featuredExcerpt}>
                    {featuredGuideData.excerpt}
                  </p>
                  <div className={styles.featuredMeta}>
                    <span className={styles.featuredMetaItem}>
                      <span
                        className="material-icons-outlined"
                        style={{ fontSize: "0.9rem" }}
                      >
                        schedule
                      </span>
                      {featuredGuideData.reading_minutes} min de lectura
                    </span>
                    <span className={styles.featuredMetaItem}>
                      <span
                        className="material-icons-outlined"
                        style={{ fontSize: "0.9rem" }}
                      >
                        list
                      </span>
                      {featuredGuideData.chapters} capítulos
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
            ) : null}
          </div>
        </section>

        {/* ── Filter Bar ── */}
        <div className={styles.filtersBar}>
          <div className="container">
            <div className={styles.filtersInner}>
              <div className={styles.filterTabs}>
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={
                      cat === "Todas"
                        ? "/guides"
                        : `/guides?cat=${encodeURIComponent(cat)}`
                    }
                    className={`${styles.filterBtn} ${selectedCategory === cat ? styles.filterBtnActive : ""}`}
                  >
                    {cat}
                  </Link>
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
                        {guide.readTime} min
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

              {!guides.length ? (
                <div className={styles.pathCard}>
                  <h4 className={styles.pathTitle}>
                    No hay guias en esta categoria
                  </h4>
                  <p className={styles.pathDesc}>
                    Crea una nueva guia desde /cms y publícala para verla aquí.
                  </p>
                </div>
              ) : null}
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
