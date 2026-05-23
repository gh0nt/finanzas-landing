"use client";

import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "fsr-cookie-consent";
const CONSENT_VERSION = 1;
const CONSENT_EVENT = "fsr-cookie-consent-change";
const AUTO_DISMISS_MS = 7000;
const CLOSE_ANIMATION_MS = 260;

type ConsentRecord = {
  analytics: boolean;
  updatedAt: string;
  version: number;
};

type CookieConsentProps = {
  analyticsEnabled: boolean;
  gaId?: string;
};

function parseConsent(rawValue: string | null): ConsentRecord | null {
  if (!rawValue) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<ConsentRecord>;

    if (
      parsed.version !== CONSENT_VERSION ||
      typeof parsed.analytics !== "boolean" ||
      typeof parsed.updatedAt !== "string"
    ) {
      return null;
    }

    return {
      analytics: parsed.analytics,
      updatedAt: parsed.updatedAt,
      version: parsed.version,
    };
  } catch {
    return null;
  }
}

function writeConsent(analytics: boolean): ConsentRecord {
  const nextRecord: ConsentRecord = {
    analytics,
    updatedAt: new Date().toISOString(),
    version: CONSENT_VERSION,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRecord));
  window.dispatchEvent(new Event(CONSENT_EVENT));

  return nextRecord;
}

function subscribeToConsent(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener(CONSENT_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
  };
}

function getConsentSnapshot() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(STORAGE_KEY);
}

export function CookieConsent({ analyticsEnabled, gaId }: CookieConsentProps) {
  const consentRaw = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    () => null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isManageDismissed, setIsManageDismissed] = useState(false);
  const [isManageClosing, setIsManageClosing] = useState(false);
  const closeTimeoutRef = useRef<number | null>(null);
  const manageCloseTimeoutRef = useRef<number | null>(null);
  const consent = parseConsent(consentRaw);
  const hasDecision = consent !== null;

  const closeBanner = useCallback(() => {
    if (isClosing) {
      return;
    }

    if (closeTimeoutRef.current !== null) {
      window.clearTimeout(closeTimeoutRef.current);
    }

    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      setIsClosing(false);
      setIsOpen(false);
      setIsDismissed(true);
      setIsManageDismissed(false);
      closeTimeoutRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, [isClosing]);

  const closeManageButton = useCallback(() => {
    if (isManageClosing) {
      return;
    }

    if (manageCloseTimeoutRef.current !== null) {
      window.clearTimeout(manageCloseTimeoutRef.current);
    }

    setIsManageClosing(true);
    manageCloseTimeoutRef.current = window.setTimeout(() => {
      setIsManageClosing(false);
      setIsManageDismissed(true);
      manageCloseTimeoutRef.current = null;
    }, CLOSE_ANIMATION_MS);
  }, [isManageClosing]);

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }

      if (manageCloseTimeoutRef.current !== null) {
        window.clearTimeout(manageCloseTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hasDecision || isOpen || isDismissed || isClosing) {
      return;
    }

    const autoDismissTimeout = window.setTimeout(() => {
      closeBanner();
    }, AUTO_DISMISS_MS);

    return () => {
      window.clearTimeout(autoDismissTimeout);
    };
  }, [closeBanner, hasDecision, isClosing, isDismissed, isOpen]);

  function handleConsent(analytics: boolean) {
    writeConsent(analytics);
    setIsOpen(false);
    setIsDismissed(false);
    setIsManageDismissed(false);
  }

  const analyticsAllowed =
    analyticsEnabled && Boolean(gaId) && consent?.analytics === true;
  const shouldShowBanner = (!hasDecision && !isDismissed) || isOpen || isClosing;
  const shouldShowManageButton =
    (((hasDecision || isDismissed) && !isManageDismissed && !isOpen) ||
      isManageClosing) &&
    !shouldShowBanner;

  useEffect(() => {
    if (!shouldShowManageButton || isManageClosing) {
      return;
    }

    const autoDismissTimeout = window.setTimeout(() => {
      closeManageButton();
    }, AUTO_DISMISS_MS);

    return () => {
      window.clearTimeout(autoDismissTimeout);
    };
  }, [closeManageButton, isManageClosing, shouldShowManageButton]);

  return (
    <>
      {analyticsAllowed ? <GoogleAnalytics gaId={gaId!} /> : null}

      {shouldShowBanner ? (
        <aside
          aria-label="Preferencias de cookies"
          className={`cookie-consent ${
            isClosing ? "cookie-consent--closing" : ""
          }`}
          role="dialog"
        >
          <div className="cookie-consent__panel">
            <div className="cookie-consent__header">
              <div>
                <p className="cookie-consent__eyebrow">Cookies y privacidad</p>
                <h2 className="cookie-consent__title">
                  Decide si activas analiticas
                </h2>
              </div>
              <button
                aria-label="Cerrar preferencias de cookies"
                className="cookie-consent__close"
                onClick={closeBanner}
                type="button"
              >
                <span className="material-icons-outlined" aria-hidden="true">
                  close
                </span>
              </button>
            </div>

            <p className="cookie-consent__copy">
              Usamos almacenamiento necesario para recordar tu eleccion. Las
              cookies analiticas solo se cargan si las aceptas. Mas detalle en
              nuestra <Link href="/legal/privacy">Politica de privacidad</Link>.
            </p>

            <div className="cookie-consent__list" aria-label="Categorias">
              <div className="cookie-consent__item">
                <div>
                  <h3>Necesarias</h3>
                  <p>
                    Siempre activas para guardar tu preferencia de
                    consentimiento.
                  </p>
                </div>
                <span className="cookie-consent__pill cookie-consent__pill--fixed">
                  Activas
                </span>
              </div>

              <div className="cookie-consent__item">
                <div>
                  <h3>Analiticas</h3>
                  <p>
                    Permiten medir uso y rendimiento del sitio con Google
                    Analytics.
                  </p>
                </div>
                <span
                  className={`cookie-consent__pill ${
                    consent?.analytics
                      ? "cookie-consent__pill--on"
                      : "cookie-consent__pill--off"
                  }`}
                >
                  {consent?.analytics ? "Activas" : "Desactivadas"}
                </span>
              </div>
            </div>

            <div className="cookie-consent__actions">
              <button
                className="btn cookie-consent__btn cookie-consent__btn--secondary"
                onClick={() => handleConsent(false)}
                type="button"
              >
                Solo necesarias
              </button>
              <button
                className="btn btn--primary cookie-consent__btn"
                onClick={() => handleConsent(true)}
                type="button"
              >
                Aceptar analiticas
              </button>
            </div>
          </div>
        </aside>
      ) : null}

      {shouldShowManageButton ? (
        <div
          className={`cookie-manage ${
            isManageClosing ? "cookie-manage--closing" : ""
          }`}
        >
          <button
            className="cookie-manage__trigger"
            onClick={() => {
              if (manageCloseTimeoutRef.current !== null) {
                window.clearTimeout(manageCloseTimeoutRef.current);
                manageCloseTimeoutRef.current = null;
              }

              setIsManageClosing(false);
              setIsManageDismissed(false);
              setIsDismissed(false);
              setIsOpen(true);
            }}
            type="button"
          >
            <span className="material-icons-outlined" aria-hidden="true">
              cookie
            </span>
            Gestionar cookies
          </button>
          <button
            aria-label="Ocultar gestionar cookies"
            className="cookie-manage__close"
            onClick={closeManageButton}
            type="button"
          >
            <span className="material-icons-outlined" aria-hidden="true">
              close
            </span>
          </button>
        </div>
      ) : null}
    </>
  );
}
