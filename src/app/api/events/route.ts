import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/errors";
import { createEventSchema } from "@/lib/validation";
import { createEvent, listPublicEvents } from "@/server/events";
import { getCurrentUser } from "@/server/session";

// Public: list publicly-visible events.
export async function GET() {
  return NextResponse.json({ events: await listPublicEvents() });
}

// Owner/Admin: create an event.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createEventSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const event = await createEvent({ actorRole: user.role, createdById: user.id, data: parsed.data });
    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
