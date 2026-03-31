/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { getPublishedGuides } from "@/lib/cms/guides";
import { levelToDots } from "@/lib/cms/utils";

export async function NewsSection() {
  const guides = await getPublishedGuides();
  const featuredGuide = guides.find((guide) => guide.featured) ?? guides[0] ?? null;
  const secondaryGuides = featuredGuide
    ? guides.filter((guide) => guide.slug !== featuredGuide.slug).slice(0, 3)
    : [];

  if (!featuredGuide) {
    return null;
  }

  const featuredLevelDots = levelToDots(featuredGuide.level);

  return (
    <section className="section section--white" id="guias">
      <div className="container stack">
        <div className="news-header">
          <div>
            <h2 className="section-title">Guías Educativas</h2>
            <p className="section-subtitle">
              Aprenda finanzas personales a su ritmo, con guías claras y prácticas.
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
              style={{ background: featuredGuide.cover_gradient }}
            >
              {featuredGuide.og_image_url ? (
                <img
                  src={featuredGuide.og_image_url}
                  alt={featuredGuide.title}
                  loading="lazy"
                />
              ) : (
                <span
                  className="material-icons-outlined guide-hero-icon"
                  aria-hidden="true"
                >
                  {featuredGuide.cover_icon}
                </span>
              )}

              <span className="badge badge--hero news-tag">
                {featuredGuide.category}
              </span>
            </div>

            <div className="guide-card__meta">
              <span className="guide-level">
                {Array.from({ length: featuredLevelDots }).map((_, i) => (
                  <span key={`active-${i}`} className="guide-dot guide-dot--active" />
                ))}
                {Array.from({ length: 3 - featuredLevelDots }).map((_, i) => (
                  <span key={`inactive-${i}`} className="guide-dot" />
                ))}
                {featuredGuide.level}
              </span>
              <span className="news-meta">
                {featuredGuide.chapters} capítulos · {featuredGuide.reading_minutes} min de
                lectura
              </span>
            </div>

            <h3>{featuredGuide.title}</h3>
            <p className="section-subtitle">{featuredGuide.excerpt}</p>

            <Link
              href={`/guides/${featuredGuide.slug}`}
              className="btn btn--primary guide-btn"
            >
              Leer guía
              <span className="material-icons-outlined" aria-hidden="true">
                arrow_forward
              </span>
            </Link>
          </article>

          <div className="news-list">
            {secondaryGuides.map((guide) => (
              <article className="news-item" key={guide.slug}>
                <div
                  className="news-thumb guide-thumb"
                  style={{ background: guide.cover_gradient }}
                >
                  {guide.og_image_url ? (
                    <img src={guide.og_image_url} alt={guide.title} loading="lazy" />
                  ) : (
                    <span
                      className="material-icons-outlined guide-thumb-icon"
                      aria-hidden="true"
                    >
                      {guide.cover_icon}
                    </span>
                  )}
                </div>

                <div>
                  <span className="news-category">{guide.category}</span>
                  <h4>{guide.title}</h4>
                  <div className="guide-item-footer">
                    <span className="news-meta">
                      {guide.chapters} cap. · {guide.reading_minutes} min
                    </span>
                    <Link href={`/guides/${guide.slug}`} className="guide-item-link">
                      Leer
                      <span className="material-icons-outlined" aria-hidden="true">
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
