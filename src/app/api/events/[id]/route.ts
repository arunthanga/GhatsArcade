import { NextResponse } from "next/server";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { updateEventSchema } from "@/lib/validation";
import { deleteEvent, updateEvent } from "@/server/events";
import { getCurrentUser } from "@/server/session";

type Ctx = { params: Promise<{ id: string }> };

// Owner/Admin: update an event.
export async function PATCH(request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id } = await params;
  try {
    const event = await updateEvent({ actorRole: user.role, id, data: parsed.data });
    return NextResponse.json({ event });
  } catch (error) {
    return mapError(error);
  }
}

// Owner/Admin: delete an event (cascades to its photos).
export async function DELETE(_request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteEvent({ actorRole: user.role, id });
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
  throw error;
}
