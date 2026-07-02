import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { listPublishedPosts } from "@/server/blog";
import { BLOG_CATEGORY_LABELS, type BlogCategory } from "@/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "The Farmlands Journal",
  description:
    "The Farmlands Journal — guides and stories for co-farmer families on managed farmland in Kerala and the Kerala–Tamil Nadu border region.",
  alternates: { canonical: absoluteUrl("/blog") },
};

function excerpt(body: string, max = 180): string {
  const text = body
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function categoryLabel(category: string): string {
  return BLOG_CATEGORY_LABELS[category as BlogCategory] ?? category;
}

export default async function BlogPage() {
  const posts = await listPublishedPosts();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-semibold text-brand-900">The Farmlands Journal</h1>
      <p className="mt-2 text-brand-700">
        Guides and stories for co-farmer families on managed farmland in the Kerala–Tamil Nadu
        border region.
      </p>

      {posts.length === 0 ? (
        <p className="mt-10 text-brand-600">No posts published yet. Check back soon.</p>
      ) : (
        <ul className="mt-10 space-y-8">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-brand-100 pb-8 last:border-b-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                  {categoryLabel(post.category)}
                </span>
                {post.estimatedReadMinutes ? (
                  <span className="text-xs text-brand-500">
                    {post.estimatedReadMinutes} min read
                  </span>
                ) : null}
              </div>
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
