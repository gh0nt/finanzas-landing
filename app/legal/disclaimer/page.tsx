import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Aviso Legal | Finanzas sin Ruido",
  description:
    "Aviso legal y descargo de responsabilidad de Finanzas sin Ruido. La información publicada es exclusivamente educativa y no constituye asesoramiento financiero personalizado.",
  alternates: { canonical: "https://www.finanzassinruido.co/legal/disclaimer" },
  openGraph: {
    title: "Aviso Legal | Finanzas sin Ruido",
    description:
      "Descargo de responsabilidad y limitaciones de la información publicada por Finanzas sin Ruido S.A.S.",
    url: "https://www.finanzassinruido.co/legal/disclaimer",
    type: "website",
  },
};

const LAST_UPDATED = "10 de marzo de 2026";

const sections = [
  {
    id: "naturaleza",
    number: "1",
    title: "Naturaleza Informativa del Contenido",
    content: (
      <>
        <div className={styles.highlight}>
          <strong>Aviso importante:</strong> Todo el contenido publicado en este
          sitio web tiene carácter exclusivamente informativo y educativo. No
          constituye asesoramiento financiero, de inversión, legal ni tributario
          personalizado.
        </div>
        <p>
          Finanzas sin Ruido S.A.S. es una plataforma de educación e información
          financiera. Las comparaciones, análisis, guías y datos de mercado
          publicados tienen como único propósito facilitar la comprensión del
          entorno financiero colombiano e internacional por parte del usuario.
        </p>
        <p>
          Cada situación financiera es única. Antes de tomar cualquier decisión
          de inversión, ahorro o endeudamiento, le recomendamos consultar con un
          asesor financiero certificado que evalúe sus circunstancias
          particulares.
        </p>
      </>
    ),
  },
  {
    id: "no-asesoria",
    number: "2",
    title: "No Constituye Asesoramiento Financiero",
    content: (
      <>
        <p>
          La información disponible en este sitio, incluyendo pero no limitada a
          comparaciones de productos financieros, indicadores de mercado,
          artículos educativos y análisis macroeconómicos,{" "}
          <strong>no debe interpretarse como</strong>:
        </p>
        <ul>
          <li>
            Recomendación de compra, venta o tenencia de ningún activo
            financiero.
          </li>
          <li>
            Consejo sobre la conveniencia de contratar ningún producto bancario.
          </li>
          <li>Proyección o garantía de rendimientos futuros.</li>
          <li>Asesoramiento legal, tributario ni contable.</li>
          <li>Oferta pública de inversión en ningún instrumento financiero.</li>
        </ul>
        <p>
          Finanzas sin Ruido no está registrada como asesor de inversión ante la
          Superintendencia Financiera de Colombia. Nuestra actividad es
          exclusivamente informativa y educativa.
        </p>
      </>
    ),
  },
  {
    id: "exactitud-datos",
    number: "3",
    title: "Exactitud y Actualidad de los Datos",
    content: (
      <>
        <p>
          Si bien nos esforzamos por garantizar la exactitud y actualidad de la
          información publicada, los datos de mercado (tasas de cambio, precios
          de commodities, indicadores macroeconómicos, etc.) son proporcionados
          por fuentes externas y pueden presentar:
        </p>
        <ul>
          <li>Retrasos con respecto a los valores en tiempo real.</li>
          <li>
            Diferencias frente a cotizaciones de entidades financieras
            oficiales.
          </li>
          <li>
            Inexactitudes temporales derivadas de errores en la fuente o en la
            transmisión de datos.
          </li>
        </ul>
        <p>
          Para fines comerciales o de inversión, consulte siempre las
          cotizaciones oficiales de la entidad financiera o el proveedor de
          mercado correspondiente.
        </p>
        <div className={styles.highlightAccent}>
          Las tasas publicadas en nuestros comparadores son referenciales. Las
          condiciones definitivas de cualquier producto financiero serán las
          establecidas por cada entidad en el contrato individual.
        </div>
      </>
    ),
  },
  {
    id: "enlaces-externos",
    number: "4",
    title: "Enlaces a Sitios de Terceros",
    content: (
      <>
        <p>
          Este sitio web puede contener enlaces a sitios web de terceros
          (entidades financieras, organismos reguladores, fuentes de datos,
          etc.) con fines informativos. Finanzas sin Ruido no tiene control
          sobre el contenido, políticas de privacidad ni prácticas de esos
          sitios y no asume ninguna responsabilidad por:
        </p>
        <ul>
          <li>La exactitud o legalidad del contenido de sitios enlazados.</li>
          <li>Daños derivados del acceso o uso de dichos sitios.</li>
          <li>
            Cambios en los precios, productos o servicios publicados por
            terceros.
          </li>
        </ul>
        <p>
          La inclusión de un enlace no implica respaldo ni relación comercial
          con el sitio de destino.
        </p>
      </>
    ),
  },
  {
    id: "limitacion-responsabilidad",
    number: "5",
    title: "Limitación de Responsabilidad",
    content: (
      <>
        <p>
          En la máxima medida permitida por la legislación colombiana, Finanzas
          sin Ruido S.A.S. y sus directivos, empleados y colaboradores no serán
          responsables por:
        </p>
        <ul>
          <li>
            Pérdidas económicas, pérdida de datos o daños de cualquier tipo
            derivados del uso o imposibilidad de uso del sitio.
          </li>
          <li>
            Decisiones de inversión, ahorro o consumo financiero tomadas con
            base en el contenido del sitio.
          </li>
          <li>
            Interrupciones del servicio por mantenimiento, fallos técnicos o
            causas de fuerza mayor.
          </li>
          <li>
            Daños causados por virus o software malicioso introducido por
            terceros en el sitio.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    number: "6",
    title: "Propiedad Intelectual",
    content: (
      <>
        <p>
          Los nombres, logotipos, marcas, diseño gráfico y contenidos del sitio
          son propiedad de Finanzas sin Ruido S.A.S. o de sus proveedores de
          contenido, y están protegidos por la normativa colombiana e
          internacional de propiedad intelectual.
        </p>
        <p>
          Queda expresamente prohibida la reproducción total o parcial, la
          distribución, transformación o comunicación pública de cualquier
          elemento del sitio sin la autorización escrita previa de la Empresa.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    number: "7",
    title: "Ley Aplicable",
    content: (
      <>
        <p>
          El presente aviso legal se rige por las leyes de la República de
          Colombia. Cualquier controversia derivada de su interpretación o
          aplicación se someterá a la jurisdicción de los tribunales competentes
          de Bogotá D.C.
        </p>
        <p>
          Para consultas legales adicionales, puede contactarnos en{" "}
          <a
            href="mailto:legal@finanzassinruido.co"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            legal@finanzassinruido.co
          </a>
          .
        </p>
      </>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <div>
      <Navbar />

      {/* ── Hero ─────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Documento Legal
          </div>
          <h1 className={styles.heroTitle}>Aviso Legal</h1>
          <p className={styles.heroMeta}>
            Última actualización: <strong>{LAST_UPDATED}</strong> · Descargo de
            responsabilidad — Colombia
          </p>
        </div>
        <div className={styles.heroDecor} aria-hidden="true">
          <div className={styles.heroDecorCircle1} />
          <div className={styles.heroDecorCircle2} />
        </div>
      </section>

      {/* ── Body ─────────────────────────────────── */}
      <div className="container">
        <div className={styles.layout}>
          {/* ── Sidebar TOC ── */}
          <nav className={styles.toc} aria-label="Tabla de contenido">
            <p className={styles.tocTitle}>Contenido</p>
            <ol className={styles.tocList}>
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>
                    {s.number}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
            <div className={styles.tocDivider} />
            <p className={styles.tocFooter}>
              ¿Tienes dudas?{" "}
              <Link
                href="/contact"
                style={{ color: "var(--accent)", fontWeight: 600 }}
              >
                Contáctanos
              </Link>
            </p>
          </nav>

          {/* ── Article ── */}
          <article className={styles.article}>
            {sections.map((s) => (
              <section key={s.id} id={s.id} className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionNumber}>{s.number}</span>
                  <h2 className={styles.sectionTitle}>{s.title}</h2>
                </div>
                <div className={styles.sectionBody}>{s.content}</div>
              </section>
            ))}

            {/* Contact card */}
            <div className={styles.contactCard}>
              <p className={styles.contactCardTitle}>
                ¿Preguntas sobre este aviso?
              </p>
              <p className={styles.contactCardText}>
                Si tienes dudas sobre el alcance de este aviso legal o sobre los
                datos publicados en nuestra plataforma, escríbenos.
              </p>
              <a
                href="mailto:legal@finanzassinruido.co"
                className={styles.contactCardLink}
              >
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: "1rem" }}
                >
                  mail
                </span>
                legal@finanzassinruido.co
              </a>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
