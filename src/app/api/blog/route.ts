import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/errors";
import { createBlogPostSchema } from "@/lib/validation";
import { createBlogPost, listPublishedPosts } from "@/server/blog";
import { getCurrentUser } from "@/server/session";

// Public: list published posts.
export async function GET() {
  return NextResponse.json({ posts: await listPublishedPosts() });
}

// Owner/Admin: create a post.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createBlogPostSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const post = await createBlogPost({
      actorRole: user.role,
      authorId: user.id,
      data: parsed.data,
    });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
