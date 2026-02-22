import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import styles from "./company.module.css";

export const metadata: Metadata = {
  title: "Identidad Corporativa | Finanzas sin Ruido",
  description:
    "Información legal, regulatoria y de contacto oficial de Finanzas sin Ruido S.A.S. Transparencia total para nuestros usuarios y aliados en Colombia.",
};

const corporateData = {
  razonSocial: "Finanzas sin Ruido S.A.S.",
  nit: "900.123.456-7",
  matriculaMercantil: "03512398 — Cámara de Comercio de Bogotá",
  tipoSociedad: "Sociedad por Acciones Simplificada",
  direccion: "Calle 93 # 12-34, Oficina 302\nBogotá D.C., Colombia",
  emailLegal: "legal@finanzassinruido.com",
};

const complianceSections = [
  {
    icon: "verified_user",
    title: "Protección al Consumidor Financiero",
    body: "Aunque nuestra actividad principal es informativa, nos adherimos a los principios de transparencia de la Ley 1328 de 2009. Garantizamos que toda la información comparativa presentada es objetiva, clara y no engañosa. Contamos con canales de atención para resolver dudas sobre la información publicada.",
    link: null,
  },
  {
    icon: "lock",
    title: "Política de Tratamiento de Datos (Habeas Data)",
    body: "En cumplimiento de la Ley 1581 de 2012 y el Decreto 1377 de 2013, Finanzas sin Ruido es responsable del tratamiento de sus datos personales. Sus datos son utilizados exclusivamente para fines educativos y de comparación bajo su autorización expresa.",
    link: { label: "Leer política completa", href: "/legal/privacy" },
  },
  {
    icon: "gavel",
    title: "Vigilancia y Control",
    body: "Como sociedad comercial, estamos sujetos a la vigilancia de la Superintendencia de Sociedades. En temas de protección de datos personales y derechos del consumidor digital, estamos bajo la supervisión de la Superintendencia de Industria y Comercio (SIC).",
    link: null,
  },
];

const officialDocs = [
  {
    title: "Certificado Cámara de Comercio",
    meta: "Actualizado: Oct 2023 · PDF 1.2 MB",
    href: "#",
  },
  {
    title: "Registro Único Tributario (RUT)",
    meta: "Versión Pública · PDF 800 KB",
    href: "#",
  },
  {
    title: "Estados Financieros 2023",
    meta: "Cierre Fiscal · PDF 2.4 MB",
    href: "#",
  },
];

const trustBadges = [
  { label: "COLOMBIA FINTECH", sub: "Miembro Activo" },
  { label: "SIC", sub: "Vigilado" },
  { label: "CCB", sub: "Registrado" },
];

export default function CompanyPage() {
  return (
    <div>
      <Navbar />

      {/* ── Hero ──────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className="container">
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Transparencia Corporativa
          </div>
          <h1 className={styles.heroTitle}>Identidad Corporativa y Legal</h1>
          <p className={styles.heroSubtitle}>
            En Finanzas sin Ruido S.A.S., creemos que la confianza es la base de
            cualquier decisión financiera. Aquí presentamos nuestra información
            legal, regulatoria y de contacto oficial para garantizar total
            transparencia con nuestros usuarios y aliados en Colombia.
          </p>
        </div>
        <div aria-hidden className={styles.heroDecor}>
          <div className={styles.heroDecorCircle1} />
          <div className={styles.heroDecorCircle2} />
        </div>
      </section>

      {/* ── Main ──────────────────────────────────────── */}
      <main>
        <div className="container">
          <div className={styles.mainGrid}>
            {/* ── Sidebar ─────────────────────────────── */}
            <aside className={styles.sidebar}>
              {/* Identity card */}
              <div className={styles.identityCard}>
                <h2>Datos de Identificación</h2>
                <div className={styles.identityRow}>
                  <div className={styles.identityField}>
                    <p>Razón Social</p>
                    <p>{corporateData.razonSocial}</p>
                  </div>
                  <div className={styles.identityField}>
                    <p>NIT</p>
                    <p>{corporateData.nit}</p>
                  </div>
                  <div className={styles.identityField}>
                    <p>Matrícula Mercantil</p>
                    <p>{corporateData.matriculaMercantil}</p>
                  </div>
                  <div className={styles.identityField}>
                    <p>Tipo de Sociedad</p>
                    <p>{corporateData.tipoSociedad}</p>
                  </div>
                </div>
              </div>

              {/* Contact card */}
              <div className={styles.contactCard}>
                <h2>Domicilio y Contacto</h2>
                <div className={styles.contactRows}>
                  <div className={styles.contactRow}>
                    <span
                      className="material-icons-outlined"
                      aria-hidden="true"
                    >
                      location_on
                    </span>
                    <div>
                      <p>Dirección Principal</p>
                      <p style={{ whiteSpace: "pre-line" }}>
                        {corporateData.direccion}
                      </p>
                    </div>
                  </div>
                  <div className={styles.contactRow}>
                    <span
                      className="material-icons-outlined"
                      aria-hidden="true"
                    >
                      email
                    </span>
                    <div>
                      <p>Notificaciones Judiciales</p>
                      <p>{corporateData.emailLegal}</p>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Right content ────────────────────────── */}
            <div className={styles.content}>
              {/* Commitment */}
              <div className={styles.commitmentBox}>
                <h3>Nuestro Compromiso</h3>
                <p>
                  Finanzas sin Ruido actúa como un intermediario de información
                  y educación financiera. No somos un banco ni una entidad de
                  crédito directa. Nuestra misión es empoderar a los colombianos
                  con información veraz y transparente para que tomen mejores
                  decisiones.
                </p>
                <p>
                  A continuación detallamos nuestro marco de cumplimiento
                  normativo y las políticas que rigen nuestra operación digital.
                </p>
              </div>

              {/* Compliance */}
              <div>
                <h3 className={styles.sectionHeading}>
                  Transparencia y Cumplimiento
                </h3>
                <div className={styles.complianceList}>
                  {complianceSections.map((item) => (
                    <div key={item.title} className={styles.complianceItem}>
                      <div className={styles.complianceIcon}>
                        <span
                          className="material-icons-outlined"
                          aria-hidden="true"
                        >
                          {item.icon}
                        </span>
                      </div>
                      <div>
                        <h4>{item.title}</h4>
                        <p>{item.body}</p>
                        {item.link && (
                          <Link
                            href={item.link.href}
                            className={styles.complianceLink}
                          >
                            {item.link.label}
                            <span
                              className="material-icons-outlined"
                              aria-hidden="true"
                            >
                              arrow_forward
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Official docs */}
              <div>
                <h3 className={styles.sectionHeading}>Documentación Oficial</h3>
                <div className={styles.docsGrid}>
                  {officialDocs.map((doc) => (
                    <a
                      key={doc.title}
                      href={doc.href}
                      className={styles.docCard}
                      aria-label={`Descargar ${doc.title}`}
                    >
                      <span
                        className="material-icons-outlined"
                        aria-hidden="true"
                      >
                        picture_as_pdf
                      </span>
                      <div className={styles.docInfo}>
                        <strong>{doc.title}</strong>
                        <span>{doc.meta}</span>
                      </div>
                      <span
                        className={`material-icons-outlined ${styles.downloadIcon}`}
                        aria-hidden="true"
                      >
                        download
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Trust badges */}
              <div className={styles.trustSection}>
                <p className={styles.trustLabel}>Entidades Relacionadas</p>
                <div className={styles.trustBadges}>
                  {trustBadges.map((badge) => (
                    <div key={badge.label} className={styles.trustBadge}>
                      <div className={styles.trustBadgePlate}>
                        {badge.label}
                      </div>
                      <span>{badge.sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
