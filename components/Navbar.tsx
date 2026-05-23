"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/data/site";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="navbar" aria-label="Principal">
      <div className="container navbar__inner">
        <Link className="logo" href="/" onClick={closeMenu}>
          <span className="logo__icon">
            <img src="/finanzas-logo.png" alt="Finanzas sin Ruido logo" />
          </span>
          <span>
            Finanzas<span className="logo__light">sinRuido</span>
          </span>
        </Link>
        <div className="nav-links" id="main-navigation">
          {site.navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </div>
        <button
          className="nav-toggle"
          type="button"
          aria-label={isMenuOpen ? "Cerrar menu" : "Abrir menu"}
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
          <span className="nav-toggle__bar" />
        </button>
      </div>
      <div
        className={`mobile-nav${isMenuOpen ? " mobile-nav--open" : ""}`}
        id="mobile-navigation"
      >
        <div className="container mobile-nav__inner">
          {site.navLinks.map((link) => (
            <Link key={link.label} href={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
