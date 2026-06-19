import { NextResponse } from "next/server";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import { updateProjectSchema } from "@/lib/validation";
import { deleteProject, updateProject } from "@/server/projects";
import { getCurrentUser } from "@/server/session";

type Ctx = { params: Promise<{ id: string }> };

// Owner/Admin: update a project.
export async function PATCH(request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateProjectSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id } = await params;
  try {
    const project = await updateProject({ actorRole: user.role, id, data: parsed.data });
    return NextResponse.json({ project });
  } catch (error) {
    return mapError(error);
  }
}

// Owner/Admin: delete a project (cascades to its plots + photos).
export async function DELETE(_request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteProject({ actorRole: user.role, id });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return mapError(error);
  }
}

function mapError(error: unknown): NextResponse {
  if (error instanceof AuthorizationError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof NotFoundError) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  if (error instanceof ValidationError) {
    return NextResponse.json({ error: error.message }, { status: 422 });
  }
  throw error;
}
