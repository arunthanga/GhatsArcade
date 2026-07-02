import Link from "next/link";

// Contextual blog links shown below a listing inquiry (prj.md-1). Renders nothing when
// there are no related posts, so the caller can drop it in unconditionally.

type RelatedArticle = {
  slug: string;
  title: string;
};

export function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (articles.length === 0) {
    return null;
  }
  return (
    <section className="mt-10 border-t border-brand-100 pt-8">
      <h2 className="text-xl font-semibold text-brand-900">Related reading</h2>
      <ul className="mt-4 space-y-2">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/blog/${article.slug}`}
              className="text-brand-700 underline-offset-2 hover:text-brand-900 hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/blog"
        className="mt-4 inline-block text-sm font-medium text-brand-700 hover:text-brand-900"
      >
        Read all articles →
      </Link>
    </section>
  );
}
