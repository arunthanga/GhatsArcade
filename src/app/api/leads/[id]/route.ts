import { NextResponse } from "next/server";
import { AuthorizationError, NotFoundError, ValidationError } from "@/lib/errors";
import { leadStatusUpdateSchema } from "@/lib/validation";
import { updateLeadStatus } from "@/server/leads";
import { getCurrentUser } from "@/server/session";

type Ctx = { params: Promise<{ id: string }> };

// Owner/Admin: move a lead along the status pipeline.
export async function PATCH(request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = leadStatusUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id } = await params;
  try {
    const lead = await updateLeadStatus({ actorRole: user.role, id, status: parsed.data.status });
    return NextResponse.json({ lead });
  } catch (error) {
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
}
