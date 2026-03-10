import type { Metadata } from "next";

type BlogCategoryPageProps = {
  params: { slug: string };
};

const categoryLabels: Record<string, string> = {
  ahorro: "Ahorro",
  inversion: "Inversión",
  credito: "Crédito",
  mercados: "Mercados",
  seguros: "Seguros",
  impuestos: "Impuestos",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = categoryLabels[slug] ?? slug;
  return {
    title: `${label} — Blog de Finanzas`,
    description: `Artículos y análisis sobre ${label.toLowerCase()} en Colombia. Aprende a tomar mejores decisiones financieras con Finanzas sin Ruido.`,
    alternates: {
      canonical: `https://www.finanzassinruido.co/blog/category/${slug}`,
    },
    openGraph: {
      title: `${label} — Blog de Finanzas | Finanzas sin Ruido`,
      description: `Artículos sobre ${label.toLowerCase()} en el mercado colombiano.`,
      url: `https://www.finanzassinruido.co/blog/category/${slug}`,
      type: "website",
    },
  };
}

export default function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  return (
    <main>
      <h1>Blog Category</h1>
      <p>Category: {params.slug}</p>
    </main>
  );
}
