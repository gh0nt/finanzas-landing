import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import styles from "./blog.module.css";

export const metadata = {
  title: "Blog | Finanzas sin Ruido",
  description:
    "Artículos, análisis y noticias sobre finanzas personales e inversiones en Colombia.",
};

const CATEGORIES = [
  "Todos",
  "Ahorro",
  "Inversión",
  "Crédito",
  "Mercados",
  "Seguros",
  "Impuestos",
];

const featuredPost = {
  slug: "como-afectara-la-inflacion-sus-inversiones-2025",
  category: "Inversión",
  title: "¿Cómo afectará la inflación sus inversiones en 2025?",
  excerpt:
    "Expertos analizan el panorama económico colombiano y dan recomendaciones clave para proteger su patrimonio ante la volatilidad del mercado.",
  readTime: "8 min",
  date: "22 de Feb, 2025",
  gradient: "linear-gradient(135deg, #0b1f3b 0%, #1a4a7a 50%, #0f3460 100%)",
};

const posts = [
  {
    slug: "10-trucos-para-ahorrar-mas",
    category: "Ahorro",
    categoryStyle: "",
    title: "10 trucos para ahorrar más cada mes sin sacrificar calidad de vida",
    excerpt:
      "Pequeños cambios de hábito que generan grandes diferencias en su bolsillo al final del año.",
    readTime: "4 min",
    date: "Hace 2 días",
    gradient: "linear-gradient(135deg, #064e3b 0%, #065f46 100%)",
  },
  {
    slug: "como-mejorar-historial-crediticio",
    category: "Crédito",
    categoryStyle: "blue",
    title: "Cómo mejorar su historial crediticio en Colombia: guía paso a paso",
    excerpt:
      "Desde pagar a tiempo hasta diversificar su perfil de crédito, le explicamos qué le reportan las centrales de riesgo.",
    readTime: "6 min",
    date: "Hace 1 semana",
    gradient: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)",
  },
  {
    slug: "fintechs-colombianas-ronda-inversion",
    category: "Mercados",
    categoryStyle: "purple",
    title: "Fintechs colombianas lideran ronda de inversión en Latinoamérica",
    excerpt:
      "El ecosistema fintech de Colombia consolida su posición regional con más de USD 120 millones captados en 2024.",
    readTime: "5 min",
    date: "Ayer",
    gradient: "linear-gradient(135deg, #3b0764 0%, #6d28d9 100%)",
  },
  {
    slug: "dolar-baja-momento-comprar",
    category: "Mercados",
    categoryStyle: "purple",
    title: "El dólar cierra a la baja: ¿Es el momento de comprar divisas?",
    excerpt:
      "Analizamos el comportamiento de la TRM en la última semana y proyecciones para el cierre de trimestre.",
    readTime: "4 min",
    date: "Hace 2 días",
    gradient: "linear-gradient(135deg, #1c1917 0%, #44403c 100%)",
  },
  {
    slug: "nuevas-regulaciones-billeteras-digitales",
    category: "Ahorro",
    categoryStyle: "",
    title: "Nuevas regulaciones para billeteras digitales en Colombia 2025",
    excerpt:
      "La Superintendencia Financiera anuncia límites de transacciones y requisitos de seguridad para Nequi, Daviplata y similares.",
    readTime: "3 min",
    date: "Hace 5 horas",
    gradient: "linear-gradient(135deg, #064e3b 0%, #14532d 100%)",
  },
  {
    slug: "cdts-mejor-rentabilidad-2025",
    category: "Inversión",
    categoryStyle: "orange",
    title: "CDTs: ¿Cuál banco ofrece la mejor rentabilidad en 2025?",
    excerpt:
      "Comparamos las tasas de 15 entidades financieras y le explicamos cuándo conviene más un CDT que una cuenta de ahorros.",
    readTime: "7 min",
    date: "Hace 3 días",
    gradient: "linear-gradient(135deg, #431407 0%, #9a3412 100%)",
  },
];

export default function BlogPage() {
  return (
    <div>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={`container ${styles.heroInner}`}>
            <div className={styles.heroBadge}>
              <span
                className="material-icons-outlined"
                style={{ fontSize: "1rem" }}
              >
                newspaper
              </span>
              Blog &amp; Análisis
            </div>
            <h1 className={styles.heroTitle}>
              Finanzas <span>con criterio</span>, sin ruido
            </h1>
            <p className={styles.heroSubtitle}>
              Artículos, análisis y noticias sobre el mercado financiero
              colombiano, escritos por expertos para que tome decisiones
              informadas.
            </p>
            <div className={styles.heroSearch}>
              <span
                className={`material-icons-outlined ${styles.heroSearchIcon}`}
              >
                search
              </span>
              <input type="text" placeholder="Buscar artículos..." />
            </div>
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
              <span className={styles.sortLabel}>
                Ordenar: <strong>Más recientes</strong>
              </span>
            </div>
          </div>
        </div>

        {/* ── Featured Post ── */}
        <section className={styles.featuredSection}>
          <div className="container">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className={styles.featuredCard}
            >
              <div className={styles.featuredImageWrapper}>
                <div
                  className={styles.imagePlaceholder}
                  style={{ background: featuredPost.gradient }}
                >
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "4rem", opacity: 0.25 }}
                  >
                    trending_up
                  </span>
                </div>
                <span className={styles.featuredBadge}>Destacado</span>
              </div>
              <div className={styles.featuredBody}>
                <div className={styles.featuredCategoryRow}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "1rem" }}
                  >
                    trending_up
                  </span>
                  {featuredPost.category}
                </div>
                <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                <div className={styles.featuredMeta}>
                  <span className={styles.featuredMetaItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      calendar_today
                    </span>
                    {featuredPost.date}
                  </span>
                  <span className={styles.featuredMetaItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      schedule
                    </span>
                    {featuredPost.readTime} de lectura
                  </span>
                </div>
                <span className={styles.featuredCta}>
                  Leer artículo
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

        {/* ── Posts Grid ── */}
        <section className={styles.postsSection}>
          <div className="container">
            <h2 className={styles.sectionHeading}>Últimos artículos</h2>
            <div className={styles.postsGrid}>
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.postCard}
                >
                  <div className={styles.postImageWrapper}>
                    <div
                      className={styles.imagePlaceholder}
                      style={{ background: post.gradient }}
                    >
                      <span
                        className="material-icons-outlined"
                        style={{ fontSize: "2.5rem", opacity: 0.2 }}
                      >
                        article
                      </span>
                    </div>
                  </div>
                  <div className={styles.postBody}>
                    <div className={styles.postMeta}>
                      <span
                        className={`${styles.postCategory} ${
                          post.categoryStyle
                            ? styles[post.categoryStyle as keyof typeof styles]
                            : ""
                        }`}
                      >
                        {post.category}
                      </span>
                      <span className={styles.postDate}>{post.date}</span>
                    </div>
                    <h3 className={styles.postTitle}>{post.title}</h3>
                    <p className={styles.postExcerpt}>{post.excerpt}</p>
                  </div>
                  <div className={styles.postFooter}>
                    <span className={styles.postReadTime}>
                      <span
                        className="material-icons-outlined"
                        style={{ fontSize: "1rem" }}
                      >
                        schedule
                      </span>
                      {post.readTime} de lectura
                    </span>
                    <span className={styles.postArrow}>
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

        {/* ── Newsletter ── */}
        <div className="container">
          <div className={styles.newsletter}>
            <div className={styles.newsletterInner}>
              <h3 className={styles.newsletterTitle}>
                Reciba nuestros análisis en su correo
              </h3>
              <p className={styles.newsletterSub}>
                Sin spam. Solo contenido financiero relevante para Colombia, una
                vez por semana.
              </p>
              <form className={styles.newsletterForm}>
                <input
                  type="email"
                  placeholder="su@correo.com"
                  className={styles.newsletterInput}
                />
                <button type="submit" className={styles.newsletterBtn}>
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
