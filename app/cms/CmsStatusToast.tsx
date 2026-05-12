"use client";

import { useEffect, useState } from "react";
import type { CmsDatabaseStatus } from "@/lib/cms/guides";
import styles from "@/app/cms/cms.module.css";

type CmsStatusToastProps = {
  dbStatus: CmsDatabaseStatus;
};

export function CmsStatusToast({ dbStatus }: CmsStatusToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isOk = dbStatus.connected && dbStatus.writeEnabled;

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => window.clearTimeout(timeoutId);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`${styles.cmsStatusToast} ${
        isOk ? styles.cmsStatusToastOk : styles.cmsStatusToastError
      }`}
      role="status"
      aria-live="polite"
    >
      <div className={styles.cmsStatusToastIcon}>
        <span className="material-icons-outlined" aria-hidden="true">
          {isOk ? "check_circle" : "error"}
        </span>
      </div>
      <div className={styles.cmsStatusToastBody}>
        <p className={styles.cmsStatusToastTitle}>
          {isOk ? "CMS conectado" : "Revisa la conexion del CMS"}
        </p>
        <p>
          {dbStatus.connected ? "DB conectada" : "DB no conectada"}:{" "}
          {dbStatus.message}
        </p>
        <p>
          {dbStatus.writeEnabled
            ? "Escritura habilitada"
            : "Escritura deshabilitada"}
          : {dbStatus.writeMessage}
        </p>
      </div>
      <button
        type="button"
        className={styles.cmsStatusToastClose}
        aria-label="Cerrar aviso del CMS"
        onClick={() => setIsVisible(false)}
      >
        <span className="material-icons-outlined" aria-hidden="true">
          close
        </span>
      </button>
    </div>
  );
}
