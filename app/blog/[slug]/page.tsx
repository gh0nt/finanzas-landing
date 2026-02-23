import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import styles from "./article.module.css";

type BlogPostPageProps = {
  params: { slug: string };
};

const tocItems = [
  { id: "intro", label: "Introducción", icon: "info" },
  { id: "contexto", label: "Contexto económico", icon: "bar_chart" },
  { id: "estrategias", label: "Estrategias", icon: "lightbulb" },
  { id: "portafolio", label: "Su portafolio", icon: "account_balance_wallet" },
  { id: "conclusion", label: "Conclusión", icon: "check_circle" },
];

const relatedPosts = [
  {
    slug: "10-trucos-para-ahorrar-mas",
    category: "Ahorro",
    title: "10 trucos para ahorrar más cada mes",
    gradient: "linear-gradient(135deg,#064e3b,#065f46)",
  },
  {
    slug: "cdts-mejor-rentabilidad-2025",
    category: "Inversión",
    title: "CDTs: ¿Cuál banco ofrece la mejor rentabilidad?",
    gradient: "linear-gradient(135deg,#431407,#9a3412)",
  },
  {
    slug: "dolar-baja-momento-comprar",
    category: "Mercados",
    title: "El dólar cierra a la baja: ¿Es el momento de comprar divisas?",
    gradient: "linear-gradient(135deg,#1c1917,#44403c)",
  },
];

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <div>
      {/* ── Reading Progress ── */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} />
      </div>

      <Navbar />

      <main>
        <div className="container">
          {/* ── Breadcrumbs ── */}
          <nav className={styles.breadcrumbs}>
            <Link href="/">Inicio</Link>
            <span
              className="material-icons-outlined"
              style={{ fontSize: "0.85rem" }}
            >
              chevron_right
            </span>
            <Link href="/blog">Blog</Link>
            <span
              className="material-icons-outlined"
              style={{ fontSize: "0.85rem" }}
            >
              chevron_right
            </span>
            <span className="current">Inflación e inversiones 2025</span>
          </nav>

          <div className={styles.articleLayout}>
            {/* ── Sidebar TOC ── */}
            <aside className={styles.sidebar}>
              <p className={styles.tocLabel}>Contenido del artículo</p>
              <ul className={styles.tocList}>
                {tocItems.map((item, i) => (
                  <li
                    key={item.id}
                    className={`${styles.tocItem} ${i === 0 ? styles.active : ""}`}
                  >
                    <a href={`#${item.id}`}>
                      <span
                        className={`material-icons-outlined ${styles.tocIcon}`}
                      >
                        {item.icon}
                      </span>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>

              <div className={styles.expertCta}>
                <p className={styles.expertCtaTitle}>¿Necesita asesoría?</p>
                <p className={styles.expertCtaText}>
                  Nuestros asesores financieros pueden ayudarle a proteger su
                  patrimonio ante la inflación.
                </p>
                <Link href="/contact">
                  <button className={styles.expertCtaBtn}>
                    Hablar con un experto
                  </button>
                </Link>
              </div>
            </aside>

            {/* ── Article ── */}
            <article className={styles.article}>
              <header className={styles.articleHeader}>
                <div className={styles.articleCategory}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "0.85rem" }}
                  >
                    trending_up
                  </span>
                  Inversión
                </div>

                <h1 className={styles.articleTitle}>
                  ¿Cómo afectará la inflación sus inversiones en 2025?
                </h1>

                <div className={styles.articleByline}>
                  <div className={styles.authorChip}>
                    <div className={styles.authorAvatar}>AR</div>
                    <span className={styles.authorName}>Andrés Rivera</span>
                  </div>
                  <span className={styles.bylineItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      calendar_today
                    </span>
                    22 de febrero, 2025
                  </span>
                  <span className={styles.bylineItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      schedule
                    </span>
                    8 min de lectura
                  </span>
                  <span className={styles.bylineVerified}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      verified
                    </span>
                    Revisado por expertos
                  </span>
                </div>
              </header>

              {/* Hero image */}
              <div className={styles.articleHeroImage}>
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: "5rem", opacity: 0.2 }}
                >
                  trending_up
                </span>
              </div>

              {/* Body */}
              <div className={styles.body}>
                <p className={styles.lead} id="intro">
                  La inflación es el impuesto silencioso que erosiona el poder
                  adquisitivo de su dinero. Entender cómo protegerse de ella no
                  es opcional — es indispensable para cualquier colombiano que
                  quiera construir riqueza a largo plazo.
                </p>

                <h2 id="contexto">El contexto económico colombiano</h2>
                <p>
                  Luego de un ciclo alcista de tasas del Banco de la República
                  entre 2022 y 2024, Colombia inicia 2025 con una inflación que
                  cede gradualmente hacia el rango objetivo del 3 % anual. Sin
                  embargo, los precios de arrendamientos, servicios y alimentos
                  siguen presionados, lo que afecta directamente el rendimiento
                  real de los portafolios de ahorro e inversión.
                </p>
                <p>
                  Para el inversionista promedio, esto significa que una cuenta
                  de ahorros con tasa del 7 % E.A. puede estar entregando un
                  rendimiento real negativo si la inflación se mantiene por
                  encima de ese nivel. Por eso, la composición del portafolio
                  importa más que nunca.
                </p>

                <div className={styles.inlineCta}>
                  <div className={styles.inlineCtaText}>
                    <h4>Compare tasas en tiempo real</h4>
                    <p>
                      Actualizamos las tasas de todos los bancos y fondos
                      colombianos cada 24 horas.
                    </p>
                  </div>
                  <Link href="/comparators">
                    <button className={styles.inlineCtaBtn}>
                      Ver comparador →
                    </button>
                  </Link>
                </div>

                <h2 id="estrategias">
                  Estrategias para protegerse de la inflación
                </h2>
                <p>
                  No existe una fórmula universal, pero sí hay principios
                  probados que aplican para la realidad financiera colombiana:
                </p>

                <ul className={styles.checkList}>
                  <li>
                    <span
                      className={`material-icons-outlined ${styles.checkIcon}`}
                    >
                      check_circle
                    </span>
                    <span>
                      <strong>CDTs indexados a IBR:</strong> Ofrecen tasas
                      variables atadas al Indicador Bancario de Referencia,
                      protegiéndole cuando las tasas suben.
                    </span>
                  </li>
                  <li>
                    <span
                      className={`material-icons-outlined ${styles.checkIcon}`}
                    >
                      check_circle
                    </span>
                    <span>
                      <strong>Títulos TES UVR:</strong> Su capital crece con la
                      inflación. Son instrumentos de deuda pública indexados a
                      la Unidad de Valor Real.
                    </span>
                  </li>
                  <li>
                    <span
                      className={`material-icons-outlined ${styles.checkIcon}`}
                    >
                      check_circle
                    </span>
                    <span>
                      <strong>Fondos de inversión colectiva:</strong>{" "}
                      Diversifican automáticamente en activos reales, acciones y
                      deuda, reduciendo el impacto de la inflación en el
                      portafolio global.
                    </span>
                  </li>
                  <li>
                    <span
                      className={`material-icons-outlined ${styles.checkIcon}`}
                    >
                      check_circle
                    </span>
                    <span>
                      <strong>Propiedad raíz:</strong> Históricamente el
                      arrendamiento sube con el IPC. Si no puede comprar, los
                      FICs inmobiliarios son una alternativa accesible desde $1
                      millón.
                    </span>
                  </li>
                </ul>

                <div className={styles.callout}>
                  <span
                    className={`material-icons-outlined ${styles.calloutIcon}`}
                  >
                    lightbulb
                  </span>
                  <div>
                    <h4>Pro-Tip: La regla del 100 menos su edad</h4>
                    <p>
                      Un método sencillo: reste su edad a 100 y ese porcentaje
                      colóquelo en activos de mayor riesgo (acciones, ETFs). El
                      resto, en renta fija y CDTs. A los 35 años: 65 % en renta
                      variable, 35 % en renta fija. Ajuste según su tolerancia
                      real al riesgo.
                    </p>
                  </div>
                </div>

                <h2 id="portafolio">Cómo revisar su portafolio hoy</h2>
                <p>
                  Antes de hacer cualquier movimiento, hágase tres preguntas
                  fundamentales: ¿cuánto dinero necesita líquido en los próximos
                  12 meses? ¿Qué porcentaje de sus ahorros puede inmovilizar por
                  más de 3 años? ¿Tiene deudas con tasa variable que puedan
                  subir si el entorno inflacionario empeora?
                </p>
                <p>
                  Con esas respuestas claras, la construcción de un portafolio
                  anti-inflacionario se vuelve mucho más sencilla y
                  personalizada.
                </p>

                <h2 id="conclusion">Conclusión</h2>
                <p>
                  La inflación no desaparecerá. Lo que sí puede controlar es qué
                  hace con su dinero mientras tanto. Diversifique, indexe parte
                  de su portafolio al IPC o al IBR, y no deje que los ahorros
                  duerman en productos que rinden por debajo de la inflación. Su
                  dinero futuro depende de las decisiones de hoy.
                </p>
              </div>
            </article>

            {/* ── Share Column ── */}
            <div className={styles.shareCol}>
              <span className={styles.shareLabel}>Compartir</span>
              {["share", "link", "bookmark"].map((icon) => (
                <button
                  key={icon}
                  className={styles.shareBtn}
                  aria-label={icon}
                >
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "1rem" }}
                  >
                    {icon}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Related Posts ── */}
          <section className={styles.related}>
            <h3 className={styles.relatedHeading}>También puede interesarle</h3>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={styles.relatedCard}
                >
                  <div
                    className={styles.relatedImageWrapper}
                    style={{
                      background: post.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,0.15)",
                    }}
                  >
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "2.5rem", opacity: 0.25 }}
                    >
                      article
                    </span>
                  </div>
                  <div className={styles.relatedBody}>
                    <p className={styles.relatedCategory}>{post.category}</p>
                    <h4 className={styles.relatedTitle}>{post.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
