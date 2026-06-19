import { BlogManager } from "@/components/admin/BlogManager";
import { listAllPosts } from "@/server/blog";
import { requirePermission } from "@/server/session";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
  const user = await requirePermission("blog:manage");
  const posts = await listAllPosts({ actorRole: user.role });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Blog / CMS</h1>
        <p className="text-sm text-slate-400">
          Write posts, set a category and SEO fields, and publish. Reading time is estimated
          automatically from the body unless you override it.
        </p>
      </div>
      <BlogManager
        initialPosts={posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: post.status,
          category: post.category,
          body: post.body,
          coverImage: post.coverImage,
          metaTitle: post.metaTitle,
          metaDescription: post.metaDescription,
          ogImageUrl: post.ogImageUrl,
          estimatedReadMinutes: post.estimatedReadMinutes,
        }))}
      />
    </div>
  );
}
