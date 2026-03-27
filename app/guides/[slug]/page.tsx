import type { Metadata } from "next";
import { Children, isValidElement, type ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./guide.module.css";
import { extractMarkdownHeadings, slugify } from "@/lib/cms/utils";
import {
  getGuideBySlug,
  getPublishedGuides,
  getRelatedGuides,
} from "@/lib/cms/guides";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;

  const guide = await getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guia no encontrada",
      description: "La guia solicitada no existe o no esta publicada.",
    };
  }

  const title = guide.seo_title || guide.title;
  const description = guide.seo_description || guide.excerpt;
  const canonical =
    guide.canonical_url || `https://www.finanzassinruido.co/guides/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: guide.og_image_url ? [{ url: guide.og_image_url }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

function authorInitials(name: string) {
  return name
    .split(" ")
    .map((piece) => piece[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function reactNodeToText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (!node) {
    return "";
  }

  if (Array.isArray(node)) {
    return node.map((child) => reactNodeToText(child)).join(" ");
  }

  if (isValidElement(node)) {
    const element = node as { props?: { children?: ReactNode } };
    return reactNodeToText(element.props?.children);
  }

  return "";
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const tocItems = extractMarkdownHeadings(guide.content_markdown);
  const relatedGuides = await getRelatedGuides(guide.slug, guide.category, 3);
  const publishedDate = guide.published_at
    ? new Date(guide.published_at).toLocaleDateString("es-CO", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Sin fecha";

  const allGuides = await getPublishedGuides();
  const sideContent = relatedGuides.length
    ? relatedGuides
    : allGuides.filter((item) => item.slug !== guide.slug).slice(0, 3);

  return (
    <div>
      {/* ── Progress Bar ── */}
      <div className={styles.progressBar}>
        <div className={styles.progressFill} />
      </div>

      <Navbar />

      <main>
        <div className="container">
          {/* ── Breadcrumbs ── */}
          <nav className={styles.breadcrumbs}>
            <Link href="/">Inicio</Link>
            <span
              className="material-icons-outlined"
              style={{ fontSize: "0.85rem" }}
            >
              chevron_right
            </span>
            <Link href="/guides">Guías</Link>
            <span
              className="material-icons-outlined"
              style={{ fontSize: "0.85rem" }}
            >
              chevron_right
            </span>
            <span className={styles.current}>Guia: {guide.title}</span>
          </nav>

          <div className={styles.guideLayout}>
            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
              {/* Guide info card */}
              <div className={styles.guideInfoCard}>
                <div className={styles.guideInfoHero}>
                  <span
                    className="material-icons-outlined"
                    style={{ fontSize: "4.5rem" }}
                  >
                    {guide.cover_icon}
                  </span>
                </div>
                <div className={styles.guideInfoBody}>
                  <p className={styles.guideInfoTitle}>{guide.title}</p>
                  <div className={styles.guideInfoStats}>
                    <span className={styles.guideInfoStat}>
                      <span
                        className={`material-icons-outlined ${styles.statIcon}`}
                      >
                        schedule
                      </span>
                      {guide.reading_minutes} min de lectura
                    </span>
                    <span className={styles.guideInfoStat}>
                      <span
                        className={`material-icons-outlined ${styles.statIcon}`}
                      >
                        list
                      </span>
                      {guide.chapters} capitulos
                    </span>
                    <span className={styles.guideInfoStat}>
                      <span
                        className={`material-icons-outlined ${styles.statIcon}`}
                      >
                        school
                      </span>
                      Nivel: {guide.level}
                    </span>
                    <span className={styles.guideInfoStat}>
                      <span
                        className={`material-icons-outlined ${styles.statIcon}`}
                      >
                        verified
                      </span>
                      Revisado por expertos
                    </span>
                  </div>
                </div>
              </div>

              {/* TOC */}
              <div>
                <p className={styles.tocLabel}>Contenido de la guía</p>
                <ul className={styles.tocList}>
                  {tocItems.map((item, i) => (
                    <li
                      key={item.id}
                      className={`${styles.tocItem} ${i === 0 ? styles.active : ""}`}
                    >
                      <span className={styles.tocNum}>{i + 1}</span>
                      <a href={`#${item.id}`}>{item.label}</a>
                    </li>
                  ))}

                  {!tocItems.length ? (
                    <li className={styles.tocItem}>
                      <span className={styles.tocNum}>1</span>
                      <a href="#contenido">Contenido principal</a>
                    </li>
                  ) : null}
                </ul>
              </div>

              {/* Expert CTA */}
              <div className={styles.expertCta}>
                <p className={styles.expertCtaTitle}>¿Necesita ayuda?</p>
                <p className={styles.expertCtaText}>
                  Nuestros asesores pueden ayudarle a elegir la cuenta que mejor
                  se adapte a su perfil financiero.
                </p>
                <Link href="/contact">
                  <button className={styles.expertCtaBtn}>
                    Hablar con un experto
                  </button>
                </Link>
              </div>
            </aside>

            {/* ── Article ── */}
            <article className={styles.article}>
              <header className={styles.articleHeader}>
                <div className={styles.headerTopRow}>
                  <div className={styles.articleCategory}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {guide.cover_icon}
                    </span>
                    {guide.category}
                  </div>
                  <div className={styles.levelBadge}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.85rem" }}
                    >
                      school
                    </span>
                    {guide.level}
                  </div>
                </div>

                <h1 className={styles.articleTitle}>{guide.title}</h1>

                <div className={styles.articleByline}>
                  <div className={styles.authorChip}>
                    <div className={styles.authorAvatar}>
                      {authorInitials(guide.author_name)}
                    </div>
                    <span className={styles.authorName}>
                      {guide.author_name}
                    </span>
                  </div>
                  <span className={styles.bylineItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      calendar_today
                    </span>
                    {publishedDate}
                  </span>
                  <span className={styles.bylineItem}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      schedule
                    </span>
                    {guide.reading_minutes} min de lectura
                  </span>
                  <span className={styles.bylineVerified}>
                    <span
                      className="material-icons-outlined"
                      style={{ fontSize: "0.9rem" }}
                    >
                      verified
                    </span>
                    {guide.author_role ?? "Revisado por expertos"}
                  </span>
                </div>
              </header>

              {/* Hero image */}
              <div className={styles.articleHeroImage}>
                <span
                  className="material-icons-outlined"
                  style={{ fontSize: "6rem" }}
                >
                  {guide.cover_icon}
                </span>
              </div>

              {/* Body */}
              <div className={styles.body} id="contenido">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h2: ({ children }) => {
                      const text = Children.toArray(children)
                        .map((child) => reactNodeToText(child))
                        .join(" ")
                        .trim();
                      return <h2 id={slugify(text)}>{children}</h2>;
                    },
                    table: ({ children }) => (
                      <table className={styles.compTable}>{children}</table>
                    ),
                    ul: ({ children }) => (
                      <ul className={styles.markdownList}>{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className={styles.markdownList}>{children}</ol>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className={styles.markdownQuote}>
                        {children}
                      </blockquote>
                    ),
                  }}
                >
                  {guide.content_markdown}
                </ReactMarkdown>

                <div className={styles.inlineCta}>
                  <div className={styles.inlineCtaText}>
                    <h4>Necesitas comparar productos antes de decidir?</h4>
                    <p>
                      Usa nuestros comparadores para aterrizar las
                      recomendaciones de esta guia.
                    </p>
                  </div>
                  <Link href="/comparators">
                    <button className={styles.inlineCtaBtn}>
                      Ver comparador
                    </button>
                  </Link>
                </div>
              </div>
            </article>
          </div>

          {/* ── Related Guides ── */}
          <section className={styles.related}>
            <h3 className={styles.relatedHeading}>Continúe aprendiendo</h3>
            <div className={styles.relatedGrid}>
              {sideContent.map((relatedGuide) => (
                <Link
                  key={relatedGuide.slug}
                  href={`/guides/${relatedGuide.slug}`}
                  className={styles.relatedCard}
                >
                  <div
                    className={styles.relatedImageWrapper}
                    style={{ background: relatedGuide.cover_gradient }}
                  >
                    <span
                      className="material-icons-outlined"
                      style={{
                        fontSize: "2.5rem",
                        color: "rgba(255,255,255,0.2)",
                      }}
                    >
                      {relatedGuide.cover_icon}
                    </span>
                  </div>
                  <div className={styles.relatedBody}>
                    <p className={styles.relatedCategory}>
                      {relatedGuide.category}
                    </p>
                    <h4 className={styles.relatedTitle}>
                      {relatedGuide.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
