import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { listPublishedPosts } from "@/server/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Guides and updates on managed farmland investing in Kerala and the Kerala-Tamil Nadu border region.",
  alternates: { canonical: absoluteUrl("/blog") },
};

function excerpt(body: string): string {
  return body.length > 180 ? `${body.slice(0, 180).trimEnd()}…` : body;
}

export default async function BlogPage() {
  const posts = await listPublishedPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-900">Blog</h1>
      <p className="mt-2 text-brand-700">
        Guides and updates on managed farmland investing in the Kerala-Tamil Nadu border region.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-brand-600">No posts published yet. Check back soon.</p>
      ) : (
        <ul className="mt-10 space-y-8">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-brand-100 pb-8 last:border-b-0">
              <h2 className="text-xl font-semibold text-brand-800">
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              {post.publishedAt ? (
                <time
                  dateTime={post.publishedAt.toISOString()}
                  className="mt-1 block text-sm text-brand-500"
                >
                  {post.publishedAt.toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              ) : null}
              <p className="mt-3 text-brand-700">{excerpt(post.body)}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-3 inline-block text-sm font-medium text-brand-700 hover:underline"
              >
                Read more →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
