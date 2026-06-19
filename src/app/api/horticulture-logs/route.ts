import { NextResponse } from "next/server";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { createHorticultureLogSchema } from "@/lib/validation";
import { createHorticultureLog, listHorticultureLogs } from "@/server/horticulture";
import { getCurrentUser } from "@/server/session";

// Admin only: list logs (internal data), optionally filtered by ?projectId=.
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projectId = new URL(request.url).searchParams.get("projectId") ?? undefined;
  try {
    const logs = await listHorticultureLogs({ actorRole: user.role, projectId });
    return NextResponse.json({ logs });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}

// Admin only: create a log.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createHorticultureLogSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const log = await createHorticultureLog({
      actorRole: user.role,
      loggedById: user.id,
      data: parsed.data,
    });
    return NextResponse.json({ log }, { status: 201 });
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
