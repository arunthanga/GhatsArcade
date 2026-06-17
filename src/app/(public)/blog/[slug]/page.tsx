import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, articleJsonLd } from "@/lib/seo";
import { getPublicPostBySlug } from "@/server/blog";

export const dynamic = "force-dynamic";

function excerpt(body: string): string {
  return body.length > 160 ? `${body.slice(0, 160).trimEnd()}…` : body;
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
  const description = excerpt(post.body);
  return {
    title: post.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      type: "article",
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
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
          excerpt: excerpt(post.body),
          publishedAt: post.publishedAt,
        })}
      />

      <header className="mb-6">
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
