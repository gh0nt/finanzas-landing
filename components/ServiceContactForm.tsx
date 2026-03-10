"use client";

import { useState, useId } from "react";
import styles from "./ServiceContactForm.module.css";
import { serviceProducts } from "@/data/mockContent";

interface ServiceContactFormProps {
  defaultServiceId: string;
}

export function ServiceContactForm({
  defaultServiceId,
}: ServiceContactFormProps) {
  const formId = useId();
  const [fields, setFields] = useState({
    name: "",
    email: "",
    phone: "",
    service: defaultServiceId,
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next: Record<string, string> = {};
    if (!fields.name.trim()) next.name = "Tu nombre es requerido.";
    if (!fields.email.trim()) {
      next.email = "El correo electrónico es requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
      next.email = "Ingresa un correo electrónico válido.";
    }
    if (!fields.message.trim())
      next.message = "Cuéntanos en qué podemos ayudarte.";
    return next;
  }

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }
    setSubmitting(true);
    // Simulate network request
    await new Promise((r) => setTimeout(r, 900));
    setSubmitting(false);
    setSubmitted(true);
  }

  const selectedService = serviceProducts.find((s) => s.id === fields.service);

  if (submitted) {
    return (
      <div className={styles.success}>
        <span className={`material-icons-outlined ${styles.successIcon}`}>
          check_circle
        </span>
        <h3 className={styles.successTitle}>¡Mensaje recibido!</h3>
        <p className={styles.successText}>
          Gracias, <strong>{fields.name}</strong>. Nuestro equipo revisará tu
          consulta sobre{" "}
          <strong>{selectedService?.name ?? fields.service}</strong> y te
          contactará en menos de 24 horas hábiles al correo{" "}
          <strong>{fields.email}</strong>.
        </p>
        <button
          className={styles.resetBtn}
          onClick={() => {
            setSubmitted(false);
            setFields({
              name: "",
              email: "",
              phone: "",
              service: defaultServiceId,
              message: "",
            });
          }}
        >
          Enviar otra consulta
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <span className={`material-icons-outlined ${styles.formHeaderIcon}`}>
          support_agent
        </span>
        <div>
          <p className={styles.formHeaderLabel}>Consulta sin compromiso</p>
          <p className={styles.formHeaderSub}>
            Respuesta en menos de 24 h hábiles
          </p>
        </div>
      </div>

      {/* Name */}
      <div className={styles.field}>
        <label htmlFor={`${formId}-name`} className={styles.label}>
          Nombre completo <span className={styles.required}>*</span>
        </label>
        <input
          id={`${formId}-name`}
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Ej. Ana Martínez"
          value={fields.name}
          onChange={handleChange}
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
        />
        {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
      </div>

      {/* Email */}
      <div className={styles.field}>
        <label htmlFor={`${formId}-email`} className={styles.label}>
          Correo electrónico <span className={styles.required}>*</span>
        </label>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={fields.email}
          onChange={handleChange}
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
        />
        {errors.email && (
          <span className={styles.errorMsg}>{errors.email}</span>
        )}
      </div>

      {/* Phone */}
      <div className={styles.field}>
        <label htmlFor={`${formId}-phone`} className={styles.label}>
          Teléfono / WhatsApp{" "}
          <span className={styles.optional}>(opcional)</span>
        </label>
        <input
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+57 300 000 0000"
          value={fields.phone}
          onChange={handleChange}
          className={styles.input}
        />
      </div>

      {/* Service */}
      <div className={styles.field}>
        <label htmlFor={`${formId}-service`} className={styles.label}>
          Servicio de interés <span className={styles.required}>*</span>
        </label>
        <div className={styles.selectWrapper}>
          <select
            id={`${formId}-service`}
            name="service"
            value={fields.service}
            onChange={handleChange}
            className={styles.select}
          >
            {serviceProducts.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <span className={`material-icons-outlined ${styles.selectChevron}`}>
            expand_more
          </span>
        </div>
      </div>

      {/* Message */}
      <div className={styles.field}>
        <label htmlFor={`${formId}-message`} className={styles.label}>
          ¿En qué podemos ayudarte? <span className={styles.required}>*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={4}
          placeholder="Cuéntanos tu situación, monto a invertir, plazo o cualquier pregunta que tengas…"
          value={fields.message}
          onChange={handleChange}
          className={`${styles.textarea} ${errors.message ? styles.inputError : ""}`}
        />
        {errors.message && (
          <span className={styles.errorMsg}>{errors.message}</span>
        )}
      </div>

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? (
          <>
            <span className={`material-icons-outlined ${styles.spin}`}>
              sync
            </span>
            Enviando…
          </>
        ) : (
          <>
            Solicitar información gratuita
            <span className="material-icons-outlined">arrow_forward</span>
          </>
        )}
      </button>

      <p className={styles.disclaimer}>
        <span className="material-icons-outlined">lock</span>
        Tu información es confidencial y nunca la compartiremos con terceros.
      </p>
    </form>
  );
}
