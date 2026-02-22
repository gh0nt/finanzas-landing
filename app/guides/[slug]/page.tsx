type GuidePageProps = {
  params: { slug: string };
};

export default function GuidePage({ params }: GuidePageProps) {
  return (
    <main>
      <h1>Guide</h1>
      <p>Slug: {params.slug}</p>
    </main>
  );
}
