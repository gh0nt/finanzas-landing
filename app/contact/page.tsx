import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import styles from "./contact.module.css";

export const metadata = {
  title: "Contacto & Asesoría | Finanzas sin Ruido",
  description:
    "Agende una consulta con nuestros expertos financieros certificados. Le ayudamos a tomar decisiones financieras informadas.",
};

const trustItems = [
  {
    icon: "verified",
    title: "Expertos Certificados",
    desc: "Avalados por la Superintendencia Financiera y con más de 10 años de experiencia en el mercado colombiano.",
    iconBg: "rgba(16,185,129,0.1)",
    iconColor: "#059669",
  },
  {
    icon: "lock",
    title: "Datos 100% Seguros",
    desc: "Encriptación de nivel bancario. Su información personal nunca será compartida con terceros.",
    iconBg: "rgba(59,130,246,0.1)",
    iconColor: "#2563eb",
  },
  {
    icon: "timer",
    title: "Respuesta en 24 horas",
    desc: "Confirmamos su cita y le enviamos la agenda por correo en menos de un día hábil.",
    iconBg: "rgba(76,175,145,0.1)",
    iconColor: "#4caf91",
  },
  {
    icon: "workspace_premium",
    title: "Primera consulta Gratis",
    desc: "30 minutos de asesoría sin costo para que conozca a nuestro equipo y plantee sus inquietudes.",
    iconBg: "rgba(245,158,11,0.1)",
    iconColor: "#d97706",
  },
];

const TOPICS = [
  { value: "", label: "Selecciona una opción", disabled: true },
  { value: "ahorro", label: "Cuentas de Ahorro y CDTs" },
  { value: "inversion", label: "Estrategias de Inversión" },
  { value: "hipotecario", label: "Crédito de Vivienda" },
  { value: "deudas", label: "Saneamiento de Deudas" },
  { value: "pensiones", label: "Pensiones y Retiro" },
  { value: "seguros", label: "Seguros y Protección" },
  { value: "otro", label: "Otros servicios" },
];

const MODALITIES = ["Videollamada", "Presencial", "WhatsApp"];
const HOURS = [
  "9:00 – 11:00",
  "11:00 – 13:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
];

export default function ContactPage() {
  return (
    <div>
      <Navbar />

      <main className={styles.page}>
        {/* ── Hero strip ── */}
        <section className={styles.heroStrip}>
          <div className="container">
            <div className={styles.heroStripInner}>
              <div className={styles.heroBadge}>
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: "1rem" }}
                >
                  support_agent
                </span>
                Asesoría Personalizada
              </div>
              <h1 className={styles.heroTitle}>
                Tome decisiones financieras <span>con respaldo experto</span>
              </h1>
              <p className={styles.heroSub}>
                Agenda una cita con uno de nuestros asesores certificados. Le
                ayudamos a encontrar los mejores productos financieros para su
                situación particular en Colombia.
              </p>
            </div>
          </div>
        </section>

        {/* ── Main content ── */}
        <section className={styles.content}>
          <div className="container">
            <div className={styles.twoCol}>
              {/* ── Left: Trust + info ── */}
              <div className={styles.trustFeatures}>
                <div>
                  <h2 className={styles.trustTitle}>
                    ¿Por qué elegir nuestros asesores?
                  </h2>
                  <p className={styles.trustSubtitle}>
                    Más de 1.200 colombianos ya han tomado mejores decisiones
                    financieras con nuestra ayuda.
                  </p>
                </div>

                <div className={styles.trustItems}>
                  {trustItems.map((item) => (
                    <div key={item.title} className={styles.trustItem}>
                      <div
                        className={styles.trustIconWrapper}
                        style={{
                          background: item.iconBg,
                          color: item.iconColor,
                        }}
                      >
                        <span className="material-icons-outlined">
                          {item.icon}
                        </span>
                      </div>
                      <div className={styles.trustItemContent}>
                        <h4>{item.title}</h4>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* WhatsApp card */}
                <div className={styles.whatsappCard}>
                  <div className={styles.whatsappIconWrapper}>
                    <span className="material-icons-outlined">chat</span>
                  </div>
                  <div className={styles.whatsappContent}>
                    <h4>¿Necesita ayuda urgente?</h4>
                    <p>Escríbanos directamente por WhatsApp</p>
                  </div>
                  <a
                    href="https://wa.me/573001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className={styles.whatsappBtn}>Escribir</button>
                  </a>
                </div>

                {/* Social proof */}
                <div className={styles.socialProof}>
                  <div className={styles.avatarStack}>
                    {["AR", "MR", "JC"].map((initials, i) => (
                      <div
                        key={i}
                        className={styles.avatar}
                        style={{
                          background: `linear-gradient(135deg, ${
                            [
                              "#064e3b,#4caf91",
                              "#0b1f3b,#2563eb",
                              "#3b0764,#7c3aed",
                            ][i]
                          })`,
                        }}
                      >
                        {initials}
                      </div>
                    ))}
                  </div>
                  <p className={styles.socialProofText}>
                    <strong>+1.200 personas</strong> ya recibieron asesoría este
                    año
                  </p>
                </div>
              </div>

              {/* ── Right: Form ── */}
              <div>
                <div className={styles.formCard}>
                  <h3 className={styles.formTitle}>Agenda tu cita</h3>
                  <p className={styles.formSubtitle}>
                    Completa el formulario y nos pondremos en contacto en menos
                    de 24 horas.
                  </p>

                  <form action="#" method="POST">
                    {/* Name */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="name">
                        Nombre Completo
                      </label>
                      <div className={styles.inputWrapper}>
                        <span
                          className={`material-icons-outlined ${styles.inputIcon}`}
                        >
                          person
                        </span>
                        <input
                          className={styles.formInput}
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Ej. Juan Pérez"
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="email">
                        Correo Electrónico
                      </label>
                      <div className={styles.inputWrapper}>
                        <span
                          className={`material-icons-outlined ${styles.inputIcon}`}
                        >
                          mail
                        </span>
                        <input
                          className={styles.formInput}
                          id="email"
                          name="email"
                          type="email"
                          placeholder="correo@ejemplo.com"
                          autoComplete="email"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="phone">
                        Teléfono
                      </label>
                      <div className={styles.phoneRow}>
                        <select
                          className={styles.prefixSelect}
                          name="prefix"
                          id="prefix"
                        >
                          <option value="+57">🇨🇴 +57</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+52">🇲🇽 +52</option>
                        </select>
                        <div className={styles.inputWrapper}>
                          <span
                            className={`material-icons-outlined ${styles.inputIcon}`}
                          >
                            phone
                          </span>
                          <input
                            className={styles.formInput}
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="300 123 4567"
                            autoComplete="tel"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Topic */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="topic">
                        Tema de Consulta
                      </label>
                      <div className={styles.inputWrapper}>
                        <span
                          className={`material-icons-outlined ${styles.inputIcon}`}
                        >
                          topic
                        </span>
                        <select
                          className={styles.formSelect}
                          id="topic"
                          name="topic"
                          defaultValue=""
                        >
                          {TOPICS.map((t) => (
                            <option
                              key={t.value}
                              value={t.value}
                              disabled={t.disabled}
                            >
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Modality */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Modalidad de atención
                      </label>
                      <div className={styles.radioGroup}>
                        {MODALITIES.map((mod) => (
                          <label key={mod} className={styles.radioLabel}>
                            <input
                              type="radio"
                              name="modality"
                              value={mod.toLowerCase()}
                            />
                            {mod}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Preferred hour */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Horario preferido
                      </label>
                      <div className={styles.radioGroup}>
                        {HOURS.map((h) => (
                          <label key={h} className={styles.radioLabel}>
                            <input type="radio" name="hour" value={h} />
                            {h}
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel} htmlFor="message">
                        Cuéntenos más (opcional)
                      </label>
                      <textarea
                        className={`${styles.formTextarea} ${styles.noIcon}`}
                        id="message"
                        name="message"
                        placeholder="Describa brevemente su situación o las preguntas que tiene..."
                      />
                    </div>

                    {/* Consent */}
                    <div className={styles.consentRow}>
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        required
                      />
                      <label className={styles.consentText} htmlFor="consent">
                        Acepto la{" "}
                        <Link href="/legal/privacy">
                          política de privacidad
                        </Link>{" "}
                        y el tratamiento de mis datos personales conforme a la
                        Ley 1581 de 2012 (Habeas Data).
                      </label>
                    </div>

                    <button type="submit" className={styles.submitBtn}>
                      <span
                        className="material-icons-outlined"
                        style={{ fontSize: "1.1rem" }}
                      >
                        calendar_today
                      </span>
                      Agendar cita gratuita
                    </button>

                    <p className={styles.formNote}>
                      <span
                        className="material-icons-outlined"
                        style={{ fontSize: "0.9rem" }}
                      >
                        verified_user
                      </span>
                      Sus datos están protegidos con encriptación de nivel
                      bancario
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
