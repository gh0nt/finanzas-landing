import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GuideEditor } from "@/app/cms/GuideEditor";
import { CMS_COOKIE_NAME, isValidCmsSessionToken } from "@/lib/cms/auth";
import { getCmsDatabaseStatus } from "@/lib/cms/guides";
import styles from "@/app/cms/cms.module.css";

export const metadata = {
  title: "CMS Creador de Guias",
  description: "Panel interno para crear y publicar guias SEO en /guides.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CmsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_COOKIE_NAME)?.value;

  if (!isValidCmsSessionToken(token)) {
    redirect("/cms/login");
  }

  const dbStatus = await getCmsDatabaseStatus();

  return (
    <div>
      <Navbar />
      <main className={styles.cmsMain}>
        <div className="container">
          <div className={styles.cmsHeaderRow}>
            <div>
              <p className={styles.loginEyebrow}>CMS</p>
              <h1 className={styles.cmsTitle}>Blog Creator - SEO Guides</h1>
              <p className={styles.cmsSubtitle}>
                Crea, guarda y publica guias con metadata SEO completa en
                Supabase.
              </p>
            </div>
            <form method="POST" action="/api/cms/logout">
              <button type="submit" className={styles.secondaryButton}>
                Cerrar sesion
              </button>
            </form>
          </div>

          <p
            className={`${styles.cmsStatus} ${
              dbStatus.connected ? styles.cmsStatusOk : styles.cmsStatusError
            }`}
          >
            {dbStatus.connected ? "DB conectada" : "DB no conectada"}:{" "}
            {dbStatus.message}
          </p>

          <p
            className={`${styles.cmsStatus} ${
              dbStatus.writeEnabled ? styles.cmsStatusOk : styles.cmsStatusError
            }`}
          >
            {dbStatus.writeEnabled
              ? "CMS escritura habilitada"
              : "CMS escritura deshabilitada"}
            : {dbStatus.writeMessage}
          </p>

          <GuideEditor canWrite={dbStatus.writeEnabled} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
