import { NextResponse } from "next/server";
import { AuthorizationError } from "@/lib/errors";
import { can } from "@/lib/roles";
import { createAdminSchema } from "@/lib/validation";
import { createAdmin, listAdmins } from "@/server/admins";
import { getCurrentUser } from "@/server/session";

// OWNER-only: list admin accounts.
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!can(user.role, "admin:add")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ admins: await listAdmins() });
}

// OWNER-only: create a new Admin account.
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = createAdminSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const admin = await createAdmin({ actorRole: user.role, ...parsed.data });
    return NextResponse.json({ admin }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    throw error;
  }
}
