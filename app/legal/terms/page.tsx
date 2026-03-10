import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Finanzas sin Ruido",
  description:
    "Conoce los términos y condiciones que rigen el uso del sitio web y los servicios de Finanzas sin Ruido. Información clara, transparente y conforme a la legislación colombiana.",
  alternates: { canonical: "https://www.finanzassinruido.co/legal/terms" },
  openGraph: {
    title: "Términos y Condiciones | Finanzas sin Ruido",
    description:
      "Términos de uso del sitio web y servicios de Finanzas sin Ruido S.A.S.",
    url: "https://www.finanzassinruido.co/legal/terms",
    type: "website",
  },
};

const LAST_UPDATED = "10 de marzo de 2026";

const sections = [
  {
    id: "objeto",
    number: "1",
    title: "Objeto y Aceptación",
    content: (
      <>
        <p>
          Los presentes Términos y Condiciones regulan el acceso y uso del sitio
          web <strong>www.finanzassinruido.co</strong> y los servicios ofrecidos
          por <strong>Finanzas sin Ruido S.A.S.</strong> (en adelante, "la
          Empresa"), sociedad domiciliada en Bogotá D.C., Colombia.
        </p>
        <p>
          El simple acceso o uso del sitio web implica la aceptación plena,
          incondicional y sin reservas de los presentes Términos. Si no está de
          acuerdo con alguna de las condiciones, le pedimos abstenerse de usar
          la plataforma.
        </p>
      </>
    ),
  },
  {
    id: "servicios",
    number: "2",
    title: "Descripción de los Servicios",
    content: (
      <>
        <p>
          Finanzas sin Ruido ofrece los siguientes servicios a través de su
          plataforma digital:
        </p>
        <ul>
          <li>
            <strong>Comparadores financieros:</strong> herramientas para
            comparar tasas, rendimientos y condiciones de productos financieros
            como cuentas de ahorro, CDTs, créditos, tarjetas de crédito y
            brókers de inversión.
          </li>
          <li>
            <strong>Indicadores de mercado:</strong> visualización de datos
            macroeconómicos y financieros en tiempo real, incluyendo TRM, IBR,
            commodities y divisas.
          </li>
          <li>
            <strong>Contenido educativo:</strong> guías, artículos y análisis
            sobre finanzas personales e inversión.
          </li>
          <li>
            <strong>Asesoría financiera:</strong> sesiones de consultoría
            personalizadas con expertos certificados, sujetas a condiciones
            específicas del servicio contratado.
          </li>
        </ul>
        <p>
          La Empresa se reserva el derecho de modificar, suspender o
          discontinuar cualquier servicio en cualquier momento, con previo aviso
          cuando sea posible.
        </p>
      </>
    ),
  },
  {
    id: "uso-permitido",
    number: "3",
    title: "Uso Permitido y Prohibiciones",
    content: (
      <>
        <p>
          El usuario se compromete a utilizar el sitio web y sus servicios de
          conformidad con la ley, la moral y el orden público, y en particular
          queda <strong>expresamente prohibido</strong>:
        </p>
        <ul>
          <li>
            Reproducir, distribuir o comercializar los contenidos del sitio sin
            autorización escrita de la Empresa.
          </li>
          <li>
            Utilizar sistemas automatizados (bots, scrapers) para extraer datos
            de la plataforma de manera masiva.
          </li>
          <li>Suplantar la identidad de otros usuarios o de la Empresa.</li>
          <li>
            Introducir virus, malware o código malicioso que pueda dañar los
            sistemas de la Empresa o de terceros.
          </li>
          <li>
            Utilizar la información del sitio para ofrecer productos o servicios
            competidores sin un acuerdo previo.
          </li>
          <li>
            Publicar contenidos falsos, difamatorios o que vulneren derechos de
            terceros.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "propiedad-intelectual",
    number: "4",
    title: "Propiedad Intelectual",
    content: (
      <>
        <p>
          Todos los contenidos del sitio web — incluyendo textos, gráficas,
          logotipos, iconos, imágenes, código fuente, diseño y arquitectura de
          la información — son propiedad exclusiva de Finanzas sin Ruido S.A.S.
          o de sus proveedores de contenido, y están protegidos por la Ley 23 de
          1982 y demás normas sobre derechos de autor aplicables en Colombia.
        </p>
        <p>
          Se otorga al usuario una licencia limitada, no exclusiva e
          intransferible para acceder y usar el sitio con fines personales y no
          comerciales. Queda expresamente prohibida cualquier otra forma de
          explotación sin autorización escrita.
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
        <div className={styles.highlight}>
          <strong>Importante:</strong> La información publicada en este sitio
          tiene carácter exclusivamente informativo y educativo. No constituye
          asesoramiento financiero, legal ni tributario personalizado ni es una
          oferta de inversión.
        </div>
        <p>La Empresa no será responsable por:</p>
        <ul>
          <li>
            Pérdidas o daños derivados de decisiones financieras tomadas con
            base en los datos o contenidos del sitio.
          </li>
          <li>
            Inexactitudes temporales en los datos de mercado en tiempo real,
            dada su naturaleza dinámica y la dependencia de proveedores
            externos.
          </li>
          <li>
            Interrupciones del servicio ocasionadas por mantenimiento, fallas
            técnicas o causas ajenas al control de la Empresa.
          </li>
          <li>
            Daños derivados del acceso a sitios web de terceros enlazados desde
            nuestra plataforma.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "privacidad",
    number: "6",
    title: "Tratamiento de Datos Personales",
    content: (
      <>
        <p>
          El tratamiento de datos personales se rige por nuestra{" "}
          <Link
            href="/legal/privacy"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            Política de Privacidad
          </Link>
          , la cual es parte integral de estos Términos y Condiciones.
        </p>
        <p>
          Al utilizar nuestros servicios, el usuario autoriza el tratamiento de
          sus datos conforme a lo descrito en dicha política y en cumplimiento
          de la Ley 1581 de 2012 y el Decreto 1377 de 2013.
        </p>
      </>
    ),
  },
  {
    id: "modificaciones",
    number: "7",
    title: "Modificaciones a los Términos",
    content: (
      <>
        <p>
          Finanzas sin Ruido S.A.S. se reserva el derecho de modificar, en
          cualquier momento y sin previo aviso, los presentes Términos y
          Condiciones. Las modificaciones entrarán en vigor desde su publicación
          en el sitio web.
        </p>
        <p>
          Se recomienda a los usuarios revisar periódicamente esta página. El
          uso continuado del sitio tras la publicación de cualquier cambio
          implica la aceptación de los nuevos Términos.
        </p>
      </>
    ),
  },
  {
    id: "ley-aplicable",
    number: "8",
    title: "Ley Aplicable y Jurisdicción",
    content: (
      <>
        <p>
          Los presentes Términos se rigen e interpretan conforme a las leyes de
          la República de Colombia. Para la resolución de cualquier controversia
          derivada del uso del sitio, las partes se someten a los jueces y
          tribunales competentes de Bogotá D.C., Colombia.
        </p>
        <p>
          Ante cualquier duda o reclamación, le invitamos a contactarnos en
          primera instancia a través de{" "}
          <a
            href="mailto:legal@finanzassinruido.co"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            legal@finanzassinruido.co
          </a>{" "}
          antes de iniciar acciones legales.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
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
          <h1 className={styles.heroTitle}>Términos y Condiciones</h1>
          <p className={styles.heroMeta}>
            Última actualización: <strong>{LAST_UPDATED}</strong> · Versión
            vigente para Colombia
          </p>
        </div>
        {/* Decorative */}
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
                ¿Preguntas sobre estos términos?
              </p>
              <p className={styles.contactCardText}>
                Nuestro equipo legal está disponible para resolver cualquier
                consulta sobre el alcance y aplicación de estos términos.
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
