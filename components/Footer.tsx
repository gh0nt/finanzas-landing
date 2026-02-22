import Link from "next/link";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="stack">
            <div className="logo">
              <span className="logo__icon">
                <span className="material-icons-outlined" aria-hidden="true">
                  bar_chart
                </span>
              </span>
              <span>
                Finanzas<span className="logo__light">sinRuido</span>
              </span>
            </div>
            <p className="section-subtitle footer-tagline">{site.tagline}</p>
          </div>
          <div>
            <h4>Empresa</h4>
            <div className="footer-links">
              {site.footer.company.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4>Legal</h4>
            <div className="footer-links">
              {site.footer.legal.map((link) => (
                <Link key={link.label} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4>Contacto</h4>
            <div className="footer-links">
              <span>{site.email}</span>
              <span>{site.location}</span>
              <div className="socials">
                <a aria-label="Facebook" href="#">
                  <span className="material-icons-outlined">facebook</span>
                </a>
                <a aria-label="YouTube" href="#">
                  <span className="material-icons-outlined">smart_display</span>
                </a>
                <a aria-label="Email" href="#">
                  <span className="material-icons-outlined">
                    alternate_email
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="regulator">
            <div className="regulator__badge">
              <strong>VIGILADO</strong>
              <span>Superintendencia Financiera</span>
            </div>
            <p>
              Finanzas sin Ruido no capta dinero del publico. Las entidades
              financieras listadas estan vigiladas por la Superintendencia
              Financiera de Colombia.
            </p>
          </div>
          <p>© 2024 Finanzas sin Ruido SAS. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
