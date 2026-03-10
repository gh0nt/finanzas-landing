import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import styles from "../legal.module.css";

export const metadata: Metadata = {
  title: "Política de Privacidad | Finanzas sin Ruido",
  description:
    "Consulta nuestra política de privacidad y tratamiento de datos personales. Cumplimos con la Ley 1581 de 2012 (Habeas Data) y el Decreto 1377 de 2013 de Colombia.",
  alternates: { canonical: "https://www.finanzassinruido.co/legal/privacy" },
  openGraph: {
    title: "Política de Privacidad | Finanzas sin Ruido",
    description:
      "Tratamiento de datos personales conforme a la Ley 1581 de 2012 — Finanzas sin Ruido S.A.S.",
    url: "https://www.finanzassinruido.co/legal/privacy",
    type: "website",
  },
};

const LAST_UPDATED = "10 de marzo de 2026";

const sections = [
  {
    id: "responsable",
    number: "1",
    title: "Responsable del Tratamiento",
    content: (
      <>
        <p>
          <strong>Finanzas sin Ruido S.A.S.</strong>, con NIT 900.123.456-7,
          domiciliada en Calle 93 # 12-34, Oficina 302, Bogotá D.C., Colombia,
          es la empresa responsable del tratamiento de los datos personales
          recopilados a través del sitio web{" "}
          <strong>www.finanzassinruido.co</strong>.
        </p>
        <p>
          Para ejercer sus derechos o resolver consultas sobre esta política,
          puede contactarnos en:{" "}
          <a
            href="mailto:datos@finanzassinruido.co"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            datos@finanzassinruido.co
          </a>
        </p>
      </>
    ),
  },
  {
    id: "datos-recopilados",
    number: "2",
    title: "Datos Personales que Recopilamos",
    content: (
      <>
        <p>
          Dependiendo de la forma en que interactúe con nuestra plataforma,
          podemos recopilar los siguientes tipos de datos:
        </p>
        <ul>
          <li>
            <strong>Datos de identificación:</strong> nombre completo, correo
            electrónico y número de teléfono, cuando los proporcione al
            registrarse o contactarnos.
          </li>
          <li>
            <strong>Datos de navegación:</strong> dirección IP, tipo de
            navegador, páginas visitadas, tiempo de permanencia y fuente de
            acceso, recopilados automáticamente.
          </li>
          <li>
            <strong>Datos de preferencias:</strong> selecciones dentro de los
            comparadores (tipo de producto, montos, plazos) para personalizar
            los resultados.
          </li>
          <li>
            <strong>Datos de comunicación:</strong> mensajes enviados a través
            de formularios de contacto o correo electrónico.
          </li>
        </ul>
        <div className={styles.highlightAccent}>
          No recopilamos datos financieros sensibles como números de cuenta
          bancaria, contraseñas ni datos de tarjetas de crédito.
        </div>
      </>
    ),
  },
  {
    id: "finalidad",
    number: "3",
    title: "Finalidad del Tratamiento",
    content: (
      <>
        <p>Los datos personales son utilizados para:</p>
        <ul>
          <li>
            Proveer, personalizar y mejorar los servicios y herramientas de
            comparación financiera.
          </li>
          <li>
            Gestionar y atender solicitudes, consultas y asesorías solicitadas
            por el usuario.
          </li>
          <li>
            Enviar comunicaciones informativas, educativas y comerciales, cuando
            el usuario haya otorgado su autorización expresa.
          </li>
          <li>Realizar análisis estadísticos y de uso de la plataforma.</li>
          <li>
            Cumplir con obligaciones legales y regulatorias aplicables en
            Colombia.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "base-legal",
    number: "4",
    title: "Base Legal y Marco Normativo",
    content: (
      <>
        <p>El tratamiento de datos personales se realiza con fundamento en:</p>
        <ul>
          <li>
            <strong>Autorización expresa</strong> del titular al registrarse en
            el sitio o completar algún formulario.
          </li>
          <li>
            <strong>Interés legítimo</strong> de la Empresa para el análisis de
            navegación y mejora de la plataforma.
          </li>
          <li>
            <strong>Cumplimiento de obligaciones legales</strong> conforme a la
            normativa colombiana vigente.
          </li>
        </ul>
        <p>
          Esta política se elabora en cumplimiento de la{" "}
          <strong>Ley Estatutaria 1581 de 2012</strong> (Protección de Datos
          Personales), el <strong>Decreto 1377 de 2013</strong> y las circulares
          externas de la Superintendencia de Industria y Comercio (SIC).
        </p>
      </>
    ),
  },
  {
    id: "derechos",
    number: "5",
    title: "Derechos del Titular (Habeas Data)",
    content: (
      <>
        <p>Como titular de sus datos personales, usted tiene derecho a:</p>
        <ul>
          <li>
            <strong>Conocer</strong> los datos personales que tenemos sobre
            usted y la finalidad de su tratamiento.
          </li>
          <li>
            <strong>Actualizar y rectificar</strong> la información que resulte
            inexacta, incompleta o desactualizada.
          </li>
          <li>
            <strong>Suprimir</strong> sus datos cuando no sean necesarios para
            los fines del tratamiento o cuando haya revocado su autorización.
          </li>
          <li>
            <strong>Revocar</strong> la autorización otorgada para el
            tratamiento de sus datos.
          </li>
          <li>
            <strong>Presentar quejas</strong> ante la Superintendencia de
            Industria y Comercio (SIC) si considera que sus derechos han sido
            vulnerados.
          </li>
          <li>
            <strong>No recibir comunicaciones comerciales</strong> mediante el
            mecanismo de exclusión habilitado en cada comunicación.
          </li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, escríbanos a{" "}
          <a
            href="mailto:datos@finanzassinruido.co"
            style={{ color: "var(--accent)", fontWeight: 600 }}
          >
            datos@finanzassinruido.co
          </a>{" "}
          indicando su identificación y la solicitud específica. Atenderemos su
          petición en un plazo máximo de <strong>15 días hábiles</strong>.
        </p>
      </>
    ),
  },
  {
    id: "terceros",
    number: "6",
    title: "Transferencia y Transmisión a Terceros",
    content: (
      <>
        <p>Sus datos personales pueden ser compartidos con:</p>
        <ul>
          <li>
            <strong>Proveedores de servicios tecnológicos</strong> que actúan
            como encargados del tratamiento (alojamiento web, analítica,
            comunicaciones) bajo acuerdos de confidencialidad.
          </li>
          <li>
            <strong>Autoridades competentes</strong> cuando así lo exija la
            legislación colombiana.
          </li>
        </ul>
        <p>
          No vendemos, alquilamos ni transferimos sus datos a terceros con fines
          comerciales sin su autorización expresa.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    number: "7",
    title: "Cookies y Tecnologías de Rastreo",
    content: (
      <>
        <p>
          Utilizamos cookies y tecnologías similares para mejorar la experiencia
          de usuario, analizar el tráfico y personalizar el contenido. Las
          cookies utilizadas pueden ser:
        </p>
        <ul>
          <li>
            <strong>Esenciales:</strong> necesarias para el funcionamiento del
            sitio. No pueden desactivarse.
          </li>
          <li>
            <strong>Analíticas:</strong> permiten medir el uso del sitio (p.
            ej., Google Analytics). Pueden desactivarse.
          </li>
          <li>
            <strong>De preferencias:</strong> recuerdan sus configuraciones.
            Pueden desactivarse.
          </li>
        </ul>
        <p>
          Puede gestionar sus preferencias de cookies en la configuración de su
          navegador. Tenga en cuenta que desactivar ciertas cookies puede
          afectar la funcionalidad del sitio.
        </p>
      </>
    ),
  },
  {
    id: "conservacion",
    number: "8",
    title: "Conservación de los Datos",
    content: (
      <>
        <p>
          Los datos personales se conservarán durante el tiempo necesario para
          cumplir con la finalidad para la que fueron recopilados, o el tiempo
          requerido por las obligaciones legales y contractuales de la Empresa.
        </p>
        <p>
          Una vez cumplida la finalidad y transcurridos los plazos legales, los
          datos serán eliminados o anonimizados de manera segura.
        </p>
      </>
    ),
  },
  {
    id: "modificaciones",
    number: "9",
    title: "Cambios en la Política",
    content: (
      <>
        <p>
          Nos reservamos el derecho de actualizar esta política en cualquier
          momento. Cualquier cambio sustancial será notificado a los usuarios
          registrados por correo electrónico y publicado en esta página con la
          nueva fecha de vigencia.
        </p>
        <p>
          Le recomendamos revisar esta página periódicamente para mantenerse
          informado sobre cómo protegemos su información.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
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
          <h1 className={styles.heroTitle}>Política de Privacidad</h1>
          <p className={styles.heroMeta}>
            Última actualización: <strong>{LAST_UPDATED}</strong> · Ley 1581 de
            2012 — República de Colombia
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
                ¿Quieres ejercer tus derechos sobre tus datos?
              </p>
              <p className={styles.contactCardText}>
                Envíanos un correo con tu solicitud y tu identificación. Te
                responderemos en un plazo máximo de 15 días hábiles.
              </p>
              <a
                href="mailto:datos@finanzassinruido.co"
                className={styles.contactCardLink}
              >
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: "1rem" }}
                >
                  mail
                </span>
                datos@finanzassinruido.co
              </a>
            </div>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
