import { BlogManager } from "@/components/admin/BlogManager";
import { listAllPosts } from "@/server/blog";
import { requirePermission } from "@/server/session";

export default async function AdminBlogPage() {
  const user = await requirePermission("blog:manage");
  const posts = await listAllPosts({ actorRole: user.role });

  return (
    <main>
      <h1>Manage Blog</h1>
      <BlogManager
        initialPosts={posts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          status: post.status,
        }))}
      />
    </main>
  );
}
