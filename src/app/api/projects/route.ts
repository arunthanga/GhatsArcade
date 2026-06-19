import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/errors";
import { createProjectSchema, projectFilterSchema } from "@/lib/validation";
import { createProject, listPublicProjects } from "@/server/projects";
import { getCurrentUser } from "@/server/session";

// Public: list publicly-visible projects (optional filters).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const parsed = projectFilterSchema.safeParse(Object.fromEntries(url.searchParams));
  const filters = parsed.success ? parsed.data : {};
  return NextResponse.json({ projects: await listPublicProjects(filters) });
}

// Owner/Admin: create a project.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createProjectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const project = await createProject({
      actorRole: user.role,
      createdById: user.id,
      data: parsed.data,
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
