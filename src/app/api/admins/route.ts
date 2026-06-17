import { NextResponse } from "next/server";

// OWNER-ONLY. TODO (TDD): POST add Admin / DELETE remove Admin via src/server/admins.ts,
// guarded by can(role, "admin:add" | "admin:delete") and the single-Owner invariant.
export function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
