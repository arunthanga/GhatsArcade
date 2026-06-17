import { NextResponse } from "next/server";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { deleteAdmin } from "@/server/admins";
import { getCurrentUser } from "@/server/session";

// OWNER-only: delete an Admin account. The Owner account can never be deleted.
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteAdmin({ actorRole: user.role, targetUserId: id });
    return new NextResponse(null, { status: 204 });
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
