import { NextResponse } from "next/server";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { followUpNoteSchema } from "@/lib/validation";
import { addFollowUpNote } from "@/server/leads";
import { getCurrentUser } from "@/server/session";

type Ctx = { params: Promise<{ id: string }> };

// Owner/Admin: attach a follow-up note to a lead (author = current user).
export async function POST(request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = followUpNoteSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id } = await params;
  try {
    const note = await addFollowUpNote({
      actorRole: user.role,
      authorId: user.id,
      leadId: id,
      noteText: parsed.data.noteText,
      contactMethod: parsed.data.contactMethod,
    });
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    if (error instanceof NotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    throw error;
  }
}
