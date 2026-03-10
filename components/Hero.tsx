import { heroTrust } from "@/data/mockContent";

export function Hero() {
  return (
    <section className="hero">
      <div className="container section hero__grid">
        <div className="stack">
          <span className="badge badge--hero">
            <span
              className="material-icons-outlined hero-dot"
              aria-hidden="true"
            >
              fiber_manual_record
            </span>
            Datos actualizados: Mercado Europeo
          </span>
          <h1 className="hero__title">
            Tome el control de sus finanzas con datos,{" "}
            <span>no con ruido.</span>
          </h1>
          <p className="hero__lead">
            Somos la plataforma para la comparacion de productos financieros y
            educacion economica. Decisiones claras para un futuro solido.
          </p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="/contact">
              Agendar diagnostico gratuito
              <span className="material-icons-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </a>
            <a className="btn btn--ghost" href="#">
              <span className="material-icons-outlined" aria-hidden="true">
                play_circle
              </span>
              Ver como funciona
            </a>
          </div>
          <div className="hero__trust">
            {heroTrust.map((item) => (
              <span key={item.label}>
                <span className="material-icons-outlined" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
