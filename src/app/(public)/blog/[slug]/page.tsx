export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main>
      <h1>Post: {slug}</h1>
      {/* TODO: render post body + Article JSON-LD (prj.md Section 3) */}
    </main>
  );
}
