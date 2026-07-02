import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, articleJsonLd } from "@/lib/seo";
import { getPublicPostBySlug } from "@/server/blog";
import { BLOG_CATEGORY_LABELS, type BlogCategory } from "@/types";

export const dynamic = "force-dynamic";

function excerpt(body: string, max = 160): string {
  const text = body
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function categoryLabel(category: string): string {
  return BLOG_CATEGORY_LABELS[category as BlogCategory] ?? category;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) {
    return { title: "Post not found" };
  }
  const url = absoluteUrl(`/blog/${slug}`);
  // Author-set SEO overrides win; otherwise fall back to the title/excerpt/cover image.
  const title = post.metaTitle ?? post.title;
  const description = post.metaDescription ?? excerpt(post.body);
  const ogImage = post.ogImageUrl ?? post.coverImage;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicPostBySlug(slug);
  if (!post) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <JsonLd
        data={articleJsonLd({
          slug: post.slug,
          title: post.title,
          excerpt: post.metaDescription ?? excerpt(post.body),
          publishedAt: post.publishedAt,
          image: post.ogImageUrl ?? post.coverImage,
          section: categoryLabel(post.category),
        })}
      />

      <Link
        href="/blog"
        className="mb-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-900"
      >
        ← The Farmlands Journal
      </Link>

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
            {categoryLabel(post.category)}
          </span>
          {post.estimatedReadMinutes ? (
            <span className="text-xs text-brand-500">{post.estimatedReadMinutes} min read</span>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold text-brand-900">{post.title}</h1>
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
      </header>

      {post.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverImage}
          alt={post.title}
          className="mb-6 h-72 w-full rounded-lg object-cover"
        />
      ) : null}

      <article className="whitespace-pre-line leading-relaxed text-brand-800">{post.body}</article>
    </main>
  );
}
