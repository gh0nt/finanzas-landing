import { services } from "@/data/mockContent";
import { classNames } from "@/lib/classNames";

export function ServicesSection() {
  return (
    <section className="section section--light" id="servicios">
      <div className="container stack">
        <div className="stack text-center">
          <h2 className="section-title">Soluciones Financieras a su Medida</h2>
          <p className="section-subtitle">
            Compare y elija los mejores productos del mercado colombiano con
            total transparencia.
          </p>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <article
              key={service.title}
              className={classNames(
                "service-card",
                service.variant === "accent" && "service-card--accent",
              )}
            >
              <div
                className={classNames(
                  "icon-box",
                  service.variant === "accent" && "icon-box--accent",
                )}
              >
                <span className="material-icons-outlined" aria-hidden="true">
                  {service.icon}
                </span>
              </div>
              <h3>{service.title}</h3>
              <p className="section-subtitle">{service.description}</p>
              <a className="accent-link" href="#">
                {service.linkLabel}
                <span className="material-icons-outlined" aria-hidden="true">
                  arrow_forward_ios
                </span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
