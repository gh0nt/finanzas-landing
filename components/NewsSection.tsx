import Link from "next/link";
import { guideFeatured, guidesList } from "@/data/mockContent";

export function NewsSection() {
  return (
    <section className="section section--white" id="guias">
      <div className="container stack">
        <div className="news-header">
          <div>
            <h2 className="section-title">Guías Educativas</h2>
            <p className="section-subtitle">
              Aprenda finanzas personales a su ritmo, con guías claras y
              prácticas.
            </p>
          </div>
          <Link className="news-link" href="/guides">
            Ver todas las guías
          </Link>
        </div>
        <div className="news-grid">
          <article className="news-card">
            <div
              className="news-image guide-image--gradient"
              style={{ background: guideFeatured.gradient }}
            >
              <span
                className="material-icons-outlined guide-hero-icon"
                aria-hidden="true"
              >
                {guideFeatured.icon}
              </span>
              <span className="badge badge--hero news-tag">
                {guideFeatured.category}
              </span>
            </div>
            <div className="guide-card__meta">
              <span className="guide-level">
                {Array.from({ length: guideFeatured.levelDots }).map((_, i) => (
                  <span key={i} className="guide-dot guide-dot--active" />
                ))}
                {Array.from({
                  length: 3 - guideFeatured.levelDots,
                }).map((_, i) => (
                  <span key={i} className="guide-dot" />
                ))}
                {guideFeatured.level}
              </span>
              <span className="news-meta">
                {guideFeatured.chapters} capítulos · {guideFeatured.readTime} de
                lectura
              </span>
            </div>
            <h3>{guideFeatured.title}</h3>
            <p className="section-subtitle">{guideFeatured.excerpt}</p>
            <Link
              href={`/guides/${guideFeatured.slug}`}
              className="btn btn--primary guide-btn"
            >
              Leer guía
              <span className="material-icons-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </article>
          <div className="news-list">
            {guidesList.map((guide) => (
              <article className="news-item" key={guide.slug}>
                <div
                  className="news-thumb guide-thumb"
                  style={{ background: guide.gradient }}
                >
                  <span
                    className="material-icons-outlined guide-thumb-icon"
                    aria-hidden="true"
                  >
                    {guide.icon}
                  </span>
                </div>
                <div>
                  <span className="news-category">{guide.category}</span>
                  <h4>{guide.title}</h4>
                  <div className="guide-item-footer">
                    <span className="news-meta">
                      {guide.chapters} cap. · {guide.readTime}
                    </span>
                    <Link
                      href={`/guides/${guide.slug}`}
                      className="guide-item-link"
                    >
                      Leer
                      <span
                        className="material-icons-outlined"
                        aria-hidden="true"
                      >
                        arrow_forward_ios
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
