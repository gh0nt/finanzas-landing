import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import styles from "./guide.module.css";

type GuidePageProps = {
  params: { slug: string };
};

const tocItems = [
  { id: "intro", label: "¿Qué es una cuenta de ahorros?" },
  { id: "tasas", label: "Las tasas de interés E.A." },
  { id: "comparativa", label: "Bancos vs Neobancos" },
  { id: "fogafin", label: "Protección del Fogafín" },
  { id: "consejos", label: "Consejos para elegir" },
];

const relatedGuides = [
  {
    slug: "como-funcionan-los-cdts",
    category: "Inversión",
    title: "CDTs: Todo lo que necesita saber antes de invertir",
    gradient: "linear-gradient(135deg,#1e3a8a,#1d4ed8)",
    icon: "account_balance",
  },
  {
    slug: "pensiones-en-colombia-todo-lo-que-debe-saber",
    category: "Ahorro",
    title: "Pensiones en Colombia: RPM vs RAIS",
    gradient: "linear-gradient(135deg,#0f2027,#2c5364)",
    icon: "elderly",
  },
  {
    slug: "solicitar-credito-hipotecario-colombia",
    category: "Crédito",
    title: "Cómo solicitar un crédito hipotecario paso a paso",
    gradient: "linear-gradient(135deg,#3b0764,#6d28d9)",
    icon: "real_estate_agent",
  },
];

export default function GuidePage({ params }: GuidePageProps) {
  return (
    <div>
      {/* ── Progress Bar ── */}
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
            <Link href="/guides">Guías</Link>
            <span
              className="material-icons-outlined"
              style={{ fontSize: "0.85rem" }}
            >
              chevron_right
            </span>
            <span className={styles.current}>Guía: Cuentas de Ahorro</span>
          </nav>

          <div className={styles.guideLayout}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
              {/* Guide info card */}
              <div className={styles.guideInfoCard}>
                <div className={styles.guideInfoHero}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "4.5rem" }}
                  >
                    savings
                  </span>
                </div>
                <div className={styles.guideInfoBody}>
                  <p className={styles.guideInfoTitle}>
                    Cómo elegir la mejor cuenta de ahorros en Colombia
                  </p>
                  <div className={styles.guideInfoStats}>
                    <span className={styles.guideInfoStat}>
                      <span
                        className={`material-icons-outlined ${styles.statIcon}`}
                      >
                        schedule
                      </span>
                      10 min de lectura
                    </span>
                    <span className={styles.guideInfoStat}>
                      <span
                        className={`material-icons-outlined ${styles.statIcon}`}
                      >
                        list
                      </span>
                      5 capítulos
                    </span>
                    <span className={styles.guideInfoStat}>
                      <span
                        className={`material-icons-outlined ${styles.statIcon}`}
                      >
                        school
                      </span>
                      Nivel: Principiante
                    </span>
                    <span className={styles.guideInfoStat}>
                      <span
                        className={`material-icons-outlined ${styles.statIcon}`}
                      >
                        verified
                      </span>
                      Revisado por expertos
                    </span>
                  </div>
                </div>
              </div>

              {/* TOC */}
              <div>
                <p className={styles.tocLabel}>Contenido de la guía</p>
                <ul className={styles.tocList}>
                  {tocItems.map((item, i) => (
                    <li
                      key={item.id}
                      className={`${styles.tocItem} ${i === 0 ? styles.active : ""}`}
                    >
                      <span className={styles.tocNum}>{i + 1}</span>
                      <a href={`#${item.id}`}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Expert CTA */}
              <div className={styles.expertCta}>
                <p className={styles.expertCtaTitle}>¿Necesita ayuda?</p>
                <p className={styles.expertCtaText}>
                  Nuestros asesores pueden ayudarle a elegir la cuenta que mejor
                  se adapte a su perfil financiero.
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
                <div className={styles.headerTopRow}>
                  <div className={styles.articleCategory}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.85rem" }}
                    >
                      savings
                    </span>
                    Ahorro
                  </div>
                  <div className={styles.levelBadge}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.85rem" }}
                    >
                      school
                    </span>
                    Principiante
                  </div>
                </div>

                <h1 className={styles.articleTitle}>
                  Cómo elegir la mejor cuenta de ahorros en Colombia
                </h1>

                <div className={styles.articleByline}>
                  <div className={styles.authorChip}>
                    <div className={styles.authorAvatar}>MR</div>
                    <span className={styles.authorName}>Deiby Rodríguez</span>
                  </div>
                  <span className={styles.bylineItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      calendar_today
                    </span>
                    24 de Mayo, 2024
                  </span>
                  <span className={styles.bylineItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      schedule
                    </span>
                    10 min de lectura
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
                  style={{ fontSize: "6rem" }}
                >
                  savings
                </span>
              </div>

              {/* Body */}
              <div className={styles.body}>
                <p className={styles.lead} id="intro">
                  Una cuenta de ahorros no es solo un lugar donde guardar dinero
                  — es su primer instrumento de construcción de riqueza.
                  Elegirla mal puede costarte millones en tasas de manejo o
                  dejarte con rendimientos que no superan la inflación.
                </p>

                <h2 id="tasas">Entendiendo las tasas de interés E.A.</h2>
                <p>
                  La tasa E.A. (Efectiva Anual) es el porcentaje que el banco le
                  paga sobre el saldo promedio de su cuenta durante un año. A
                  diferencia de la tasa nominal, ya incorpora la capitalización
                  de los intereses, por lo que es la cifra que realmente importa
                  para comparar productos.
                </p>
                <p>
                  En Colombia, las tasas E.A. de cuentas de ahorro varían
                  enormemente: desde un <strong>0,5 % E.A.</strong> de algunos
                  bancos tradicionales hasta un <strong>13 % E.A.</strong> que
                  ofrecen algunos neobancos para saldos hasta cierto monto. La
                  diferencia, sobre $10 millones, puede ser de más de $1,2
                  millones anuales.
                </p>

                <div className={styles.inlineCta}>
                  <div className={styles.inlineCtaText}>
                    <h4>Compare tasas de 20 bancos ahora</h4>
                    <p>
                      Actualizamos las tasas de cuentas de ahorro cada 24 horas.
                    </p>
                  </div>
                  <Link href="/comparators">
                    <button className={styles.inlineCtaBtn}>
                      Ver comparador →
                    </button>
                  </Link>
                </div>

                <h2 id="comparativa">Bancos tradicionales vs Neobancos</h2>
                <p>
                  La elección entre un banco tradicional y un neobanco no es
                  binaria: cada uno ofrece ventajas concretas según su perfil de
                  uso.
                </p>

                <table className={styles.compTable}>
                  <thead>
                    <tr>
                      <th>Criterio</th>
                      <th>Bancos tradicionales</th>
                      <th>Neobancos</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tasa E.A. típica</td>
                      <td>0,5 % – 4 %</td>
                      <td className={styles.compBest}>8 % – 13 %</td>
                    </tr>
                    <tr>
                      <td>Red de cajeros</td>
                      <td className={styles.compBest}>Amplia (ATM propio)</td>
                      <td>Limitada o alianzas</td>
                    </tr>
                    <tr>
                      <td>Cuota de manejo</td>
                      <td>$0 – $25.000/mes</td>
                      <td className={styles.compBest}>Generalmente $0</td>
                    </tr>
                    <tr>
                      <td>Experiencia digital</td>
                      <td>Variable</td>
                      <td className={styles.compBest}>
                        Excelente (nativa digital)
                      </td>
                    </tr>
                    <tr>
                      <td>Cobertura Fogafín</td>
                      <td className={styles.compBest}>Sí (hasta 50 SMMLV)</td>
                      <td className={styles.compBest}>Sí (hasta 50 SMMLV)</td>
                    </tr>
                  </tbody>
                </table>

                <h2 id="fogafin">Protección del Fogafín</h2>
                <p>
                  El Fondo de Garantías de Instituciones Financieras (Fogafín)
                  protege sus depósitos en caso de liquidación de una entidad
                  vigilada. La cobertura es de hasta 50 SMMLV por persona por
                  entidad — equivalente a aproximadamente $65 millones en 2025.
                </p>

                <div className={styles.callout}>
                  <span
                    className={`material-icons-outlined ${styles.calloutIcon}`}
                  >
                    lightbulb
                  </span>
                  <div>
                    <h4>Pro-Tip: La regla de los bolsillos</h4>
                    <p>
                      Distribuya sus ahorros en tres "bolsillos" mentales: fondo
                      de emergencia (3-6 meses de gastos, en cuenta con alta
                      liquidez), ahorro a corto plazo (meta específica en 6-12
                      meses) y ahorro a largo plazo (CDTs o fondos con mejor
                      rentabilidad pero menor liquidez). No mezcle los tres en
                      la misma cuenta.
                    </p>
                  </div>
                </div>

                <h2 id="consejos">Consejos finales para elegir</h2>

                <ul className={styles.checkList}>
                  <li>
                    <span
                      className={`material-icons-outlined ${styles.checkIcon}`}
                    >
                      check_circle
                    </span>
                    <span>
                      <strong>Calcule su tasa real:</strong> Rest la inflación
                      proyectada (cercana al 4 % en 2025) de la tasa E.A.
                      ofrecida. Solo si es positiva, su dinero crece en términos
                      reales.
                    </span>
                  </li>
                  <li>
                    <span
                      className={`material-icons-outlined ${styles.checkIcon}`}
                    >
                      check_circle
                    </span>
                    <span>
                      <strong>Revise los límites de transacciones:</strong>{" "}
                      Algunos neobancos cobran a partir de cierta cantidad de
                      retiros mensuales. Si usa efectivo con frecuencia, esto
                      puede anular la ventaja de la tasa.
                    </span>
                  </li>
                  <li>
                    <span
                      className={`material-icons-outlined ${styles.checkIcon}`}
                    >
                      check_circle
                    </span>
                    <span>
                      <strong>Verifique el saldo mínimo:</strong> Algunos
                      productos aplican la tasa alta solo hasta un monto máximo.
                      Consulte el rango efectivo del rendimiento.
                    </span>
                  </li>
                  <li>
                    <span
                      className={`material-icons-outlined ${styles.checkIcon}`}
                    >
                      check_circle
                    </span>
                    <span>
                      <strong>No olvide el GMF (4x1000):</strong> El gravamen
                      aplica en retiros. Muchas cuentas tienen exención de un
                      retiro mensual. Use esa ventaja.
                    </span>
                  </li>
                </ul>
              </div>
            </article>
          </div>

          {/* ── Related Guides ── */}
          <section className={styles.related}>
            <h3 className={styles.relatedHeading}>Continúe aprendiendo</h3>
            <div className={styles.relatedGrid}>
              {relatedGuides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className={styles.relatedCard}
                >
                  <div
                    className={styles.relatedImageWrapper}
                    style={{ background: guide.gradient }}
                  >
                    <span
                      className="material-icons-outlined"
                      style={{
                        fontSize: "2.5rem",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {guide.icon}
                    </span>
                  </div>
                  <div className={styles.relatedBody}>
                    <p className={styles.relatedCategory}>{guide.category}</p>
                    <h4 className={styles.relatedTitle}>{guide.title}</h4>
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
