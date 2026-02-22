type BlogPostPageProps = {
  params: { slug: string };
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  return (
    <main>
      <h1>Blog Post</h1>
      <p>Slug: {params.slug}</p>
    </main>
  );
}
