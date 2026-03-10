import Link from "next/link";
import { serviceProducts } from "@/data/mockContent";

export function ServicesHighlightSection() {
  const featured = serviceProducts[0];
  const sideItems = serviceProducts.slice(1, 4);

  return (
    <section className="section services-hl" id="productos">
      <div className="container">
        <div className="services-hl__header">
          <div>
            <div className="section-tag section-tag--accent">
              Productos de Inversión
            </div>
            <h2 className="section-title services-hl__title">
              Su dinero, trabajando para usted
            </h2>
            <p className="section-subtitle services-hl__subtitle">
              Acceda a los mejores instrumentos financieros del mercado
              colombiano, supervisados y transparentes.
            </p>
          </div>
          <Link href="/services" className="btn btn--ghost services-hl__cta">
            Ver todos los productos
            <span className="material-icons-outlined" aria-hidden="true">
              arrow_forward
            </span>
          </Link>
        </div>

        <div className="services-hl__grid">
          {/* Featured product */}
          <article className="services-hl__featured">
            <div className="services-hl__icon-wrap">
              <span className="material-icons-outlined" aria-hidden="true">
                {featured.icon}
              </span>
            </div>
            <span className="badge services-hl__badge">{featured.badge}</span>
            <h3 className="services-hl__name">{featured.name}</h3>
            <p className="services-hl__desc">{featured.description}</p>
            <ul className="services-hl__features">
              {featured.features.map((f) => (
                <li key={f}>
                  <span className="material-icons-outlined" aria-hidden="true">
                    check_circle
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Link
              href={`/services/${featured.id}`}
              className="btn btn--primary"
            >
              {featured.ctaLabel}
              <span className="material-icons-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </article>

          {/* Side product cards */}
          <div className="services-hl__side">
            {sideItems.map((product) => (
              <article className="services-hl__card" key={product.id}>
                <div className="services-hl__card-icon">
                  <span className="material-icons-outlined" aria-hidden="true">
                    {product.icon}
                  </span>
                </div>
                <div className="services-hl__card-body">
                  <span className="news-category">{product.badge}</span>
                  <h4 className="services-hl__card-name">{product.name}</h4>
                  <p className="services-hl__card-desc">
                    {product.description}
                  </p>
                </div>
                <Link
                  href={`/services/${product.id}`}
                  className="services-hl__card-link"
                  aria-label={`Ver ${product.name}`}
                >
                  <span className="material-icons-outlined" aria-hidden="true">
                    arrow_forward_ios
                  </span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
