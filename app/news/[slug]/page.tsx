import type { Metadata } from "next";

type NewsArticlePageProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const title = slug.replace(/-/g, " ");
  return {
    title,
    description: `Noticia sobre ${title} en el mercado financiero colombiano — Finanzas sin Ruido.`,
    alternates: { canonical: `https://www.finanzassinruido.co/news/${slug}` },
    openGraph: {
      title,
      url: `https://www.finanzassinruido.co/news/${slug}`,
      type: "article",
    },
    robots: { index: false },
  };
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  return (
    <main>
      <h1>News Article</h1>
      <p>Slug: {params.slug}</p>
    </main>
  );
}
