import Link from "next/link";
import { site } from "@/data/site";

export function Navbar() {
  return (
    <nav className="navbar" aria-label="Principal">
      <div className="container navbar__inner">
        <Link className="logo" href="/">
          <span className="logo__icon">
            <img src="/finanzas-logo.png" alt="Finanzas sin Ruido logo" />
          </span>
          <span>
            Finanzas<span className="logo__light">sinRuido</span>
          </span>
        </Link>
        <div className="nav-links">
          {site.navLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
