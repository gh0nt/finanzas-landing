type NewsArticlePageProps = {
  params: { slug: string };
};

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  return (
    <main>
      <h1>News Article</h1>
      <p>Slug: {params.slug}</p>
    </main>
  );
}
