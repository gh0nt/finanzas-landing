type BlogCategoryPageProps = {
  params: { slug: string };
};

export default function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  return (
    <main>
      <h1>Blog Category</h1>
      <p>Category: {params.slug}</p>
    </main>
  );
}
