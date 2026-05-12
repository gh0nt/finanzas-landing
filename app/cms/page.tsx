import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CmsStatusToast } from "@/app/cms/CmsStatusToast";
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
    <div className={styles.cmsApp}>
      <main className={styles.cmsMain}>
        <header className={styles.cmsHeader}>
          <div>
            <p className={styles.cmsHeaderEyebrow}>CMS Privado</p>
            <h1 className={styles.cmsHeaderTitle}>Content Manager</h1>
          </div>
          <form method="POST" action="/api/cms/logout">
            <button type="submit" className={styles.logoutButton}>
              Cerrar sesion
            </button>
          </form>
        </header>

        <CmsStatusToast dbStatus={dbStatus} />

        <GuideEditor canWrite={dbStatus.writeEnabled} />
      </main>
    </div>
  );
}
