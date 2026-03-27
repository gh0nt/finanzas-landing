import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import styles from "@/app/cms/cms.module.css";

export const metadata = {
  title: "CMS Login",
  description: "Acceso interno para crear y publicar guias SEO.",
  robots: {
    index: false,
    follow: false,
  },
};

type LoginPageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function CmsLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = params.error === "1";

  return (
    <div>
      <Navbar />
      <main className={styles.loginMain}>
        <div className="container">
          <div className={styles.loginCard}>
            <p className={styles.loginEyebrow}>CMS Privado</p>
            <h1 className={styles.loginTitle}>Crear posts SEO para guias</h1>
            <p className={styles.loginSubtitle}>
              Este acceso valida contra variables de entorno y crea una sesion
              temporal por cookie.
            </p>

            {hasError ? (
              <p className={styles.loginError}>
                Credenciales invalidas. Revisa CMS_ACCOUNT y CMS_PASSWORD.
              </p>
            ) : null}

            <form
              className={styles.loginForm}
              method="POST"
              action="/api/cms/login"
            >
              <label className={styles.fieldLabel} htmlFor="account">
                Cuenta
              </label>
              <input
                id="account"
                name="account"
                type="text"
                className={styles.textField}
                autoComplete="username"
                required
              />

              <label className={styles.fieldLabel} htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={styles.textField}
                autoComplete="current-password"
                required
              />

              <button type="submit" className={styles.primaryButton}>
                Entrar al editor
              </button>
            </form>

            <p className={styles.loginHint}>
              Publicacion publica en <Link href="/guides">/guides</Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
