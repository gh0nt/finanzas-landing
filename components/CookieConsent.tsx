"use client";

import Link from "next/link";
import { GoogleAnalytics } from "@next/third-parties/google";
import { useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "fsr-cookie-consent";
const CONSENT_VERSION = 1;
const CONSENT_EVENT = "fsr-cookie-consent-change";

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
  const consent = parseConsent(consentRaw);

  function handleConsent(analytics: boolean) {
    writeConsent(analytics);
    setIsOpen(false);
  }

  const analyticsAllowed =
    analyticsEnabled && Boolean(gaId) && consent?.analytics === true;
  const hasDecision = consent !== null;
  const shouldShowBanner = !hasDecision || isOpen;

  return (
    <>
      {analyticsAllowed ? <GoogleAnalytics gaId={gaId!} /> : null}

      {shouldShowBanner ? (
        <aside
          aria-label="Preferencias de cookies"
          className="cookie-consent"
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
              {hasDecision ? (
                <button
                  aria-label="Cerrar preferencias de cookies"
                  className="cookie-consent__close"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  <span className="material-icons-outlined" aria-hidden="true">
                    close
                  </span>
                </button>
              ) : null}
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

      {hasDecision ? (
        <button
          className="cookie-manage"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <span className="material-icons-outlined" aria-hidden="true">
            cookie
          </span>
          Gestionar cookies
        </button>
      ) : null}
    </>
  );
}
