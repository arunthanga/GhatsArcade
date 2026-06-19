import { NextResponse } from "next/server";
import { AuthorizationError, NotFoundError } from "@/lib/errors";
import { updateHorticultureLogSchema } from "@/lib/validation";
import { deleteHorticultureLog, updateHorticultureLog } from "@/server/horticulture";
import { getCurrentUser } from "@/server/session";

type Ctx = { params: Promise<{ id: string }> };

// Admin only: update a log.
export async function PATCH(request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = updateHorticultureLogSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { id } = await params;
  try {
    const log = await updateHorticultureLog({ actorRole: user.role, id, data: parsed.data });
    return NextResponse.json({ log });
  } catch (error) {
    return mapError(error);
  }
}

// Admin only: delete a log.
export async function DELETE(_request: Request, { params }: Ctx) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  try {
    await deleteHorticultureLog({ actorRole: user.role, id });
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
