import Link from "next/link";

// Presentational hub used by the content landing pages (myth-busting, farming guides).
// Lists published posts from a single CMS category with a hero intro and a closing CTA.

export type HubPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  coverImage: string | null;
  estimatedReadMinutes: number | null;
  publishedAt: Date | null;
};

function excerpt(body: string, max = 160): string {
  const text = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

export function CategoryHub({
  eyebrow,
  title,
  intro,
  posts,
  emptyMessage = "New articles are on the way. Check back soon.",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  posts: HubPost[];
  emptyMessage?: string;
}) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-500">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold text-brand-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-brand-700">{intro}</p>
      </header>

      {posts.length === 0 ? (
        <p className="rounded-lg border border-brand-100 bg-brand-50 p-6 text-brand-600">
          {emptyMessage}
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2">
          {posts.map((post) => (
            <li
              key={post.id}
              className="flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white transition-shadow hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`} className="flex h-full flex-col">
                {post.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="h-40 w-full object-cover"
                  />
                ) : null}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-semibold text-brand-800">{post.title}</h2>
                  <p className="mt-2 flex-1 text-sm text-brand-600">{excerpt(post.body)}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-brand-500">
                    {post.publishedAt ? (
                      <time dateTime={post.publishedAt.toISOString()}>
                        {post.publishedAt.toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    ) : null}
                    {post.estimatedReadMinutes ? (
                      <span>{post.estimatedReadMinutes} min read</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-12 rounded-xl border border-brand-100 bg-brand-50 p-6 text-center">
        <h2 className="text-xl font-semibold text-brand-900">Still have questions?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-brand-600">
          Talk to our team or book a site visit to see a managed farmland project in person.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-800"
          >
            Book a site visit
          </Link>
          <Link
            href="/resources"
            className="rounded-lg border border-brand-200 px-5 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-white"
          >
            Free guides
          </Link>
        </div>
      </section>
    </main>
  );
}
