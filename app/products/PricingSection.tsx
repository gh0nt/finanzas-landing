"use client";

import { useState } from "react";
import { pricingPlans, comparisonFeatures } from "@/data/mockContent";
import styles from "./products.module.css";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <>
      {/* Billing toggle */}
      <div className={styles.toggleWrap}>
        <span
          className={isAnnual ? styles.toggleLabel : styles.toggleLabelActive}
        >
          Mensual
        </span>
        <button
          className={styles.toggleTrack}
          onClick={() => setIsAnnual((v) => !v)}
          aria-label="Cambiar periodo de facturación"
        >
          <span
            className={`${styles.toggleKnob} ${isAnnual ? styles.toggleKnobOn : ""}`}
          />
        </button>
        <span
          className={isAnnual ? styles.toggleLabelActive : styles.toggleLabel}
        >
          Anual
          <span className={styles.toggleDiscount}>–20%</span>
        </span>
      </div>

      {/* Plan cards */}
      <div className={styles.planGrid}>
        {pricingPlans.map((plan) => (
          <div
            key={plan.id}
            className={`${styles.planCard} ${plan.highlighted ? styles["planCard--highlighted"] : ""}`}
          >
            {plan.badge && (
              <span className={styles.planBadge}>{plan.badge}</span>
            )}

            <p className={styles.planName}>{plan.name}</p>
            <p className={styles.planDesc}>{plan.description}</p>

            <div className={styles.planPrice}>
              <span className={styles.planAmount}>
                {plan.priceMonthly === 0 && plan.priceAnnual === 0
                  ? "Gratis"
                  : `$${(isAnnual ? plan.priceAnnual : plan.priceMonthly).toLocaleString("es-CO")}`}
              </span>
              <span className={styles.planPer}>/mes</span>
            </div>
            <p className={styles.planNote}>{plan.priceNote}</p>

            <ul className={styles.planFeatures}>
              {plan.features.map((f, i) => (
                <li key={i} className={styles.planFeature}>
                  <span className="material-icons-outlined">check_circle</span>
                  {f}
                </li>
              ))}
            </ul>

            <button
              className={
                plan.ctaVariant === "accent"
                  ? styles.btnAccent
                  : plan.ctaVariant === "navy"
                    ? styles.btnNavy
                    : styles.btnOutline
              }
            >
              {plan.ctaLabel}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison table */}
      <section className={styles.compareSection}>
        <div className="container">
          <div
            className="section-tag section-tag--accent"
            style={{ marginBottom: "2rem" }}
          >
            Comparación detallada
          </div>
          <div className={styles.compareWrap}>
            <table className={styles.compareTable}>
              <thead>
                <tr>
                  <th>Característica</th>
                  <th>Inicial</th>
                  <th className={styles.colHighlight}>Estándar</th>
                  <th>Completo</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((row, i) => (
                  <tr key={i}>
                    <td>{row.label}</td>
                    {row.type === "bool" ? (
                      <>
                        <td>
                          <span
                            className={`material-icons-outlined ${row.inicial ? styles.checkIcon : styles.crossIcon}`}
                          >
                            {row.inicial ? "check_circle" : "remove"}
                          </span>
                        </td>
                        <td className={styles.colHighlight}>
                          <span
                            className={`material-icons-outlined ${row.estandar ? styles.checkIcon : styles.crossIcon}`}
                          >
                            {row.estandar ? "check_circle" : "remove"}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`material-icons-outlined ${row.completo ? styles.checkIcon : styles.crossIcon}`}
                          >
                            {row.completo ? "check_circle" : "remove"}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{row.inicial}</td>
                        <td className={styles.colHighlight}>{row.estandar}</td>
                        <td>{row.completo}</td>
                      </>
                    )}
                  </tr>
                ))}
                <tr className={styles.ctaRow}>
                  <td />
                  <td>
                    <button
                      className={styles.btnOutline}
                      style={{ fontSize: "0.82rem", padding: "0.6rem 1rem" }}
                    >
                      Elegir Inicial
                    </button>
                  </td>
                  <td className={styles.colHighlight}>
                    <button
                      className={styles.btnAccent}
                      style={{ fontSize: "0.82rem", padding: "0.6rem 1rem" }}
                    >
                      Elegir Estándar
                    </button>
                  </td>
                  <td>
                    <button
                      className={styles.btnNavy}
                      style={{ fontSize: "0.82rem", padding: "0.6rem 1rem" }}
                    >
                      Elegir Completo
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
