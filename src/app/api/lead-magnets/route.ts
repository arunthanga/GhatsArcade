import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/errors";
import { createLeadMagnetSchema } from "@/lib/validation";
import { createLeadMagnet, listActiveLeadMagnets } from "@/server/lead-magnets";
import { getCurrentUser } from "@/server/session";

// Public: list active lead magnets (title + id only; the file URL stays gated).
export async function GET() {
  return NextResponse.json({ leadMagnets: await listActiveLeadMagnets() });
}

// Owner/Admin: create a lead magnet.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createLeadMagnetSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const leadMagnet = await createLeadMagnet({
      actorRole: user.role,
      createdById: user.id,
      data: parsed.data,
    });
    return NextResponse.json({ leadMagnet }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
