import { NextResponse } from "next/server";

// OWNER-ONLY data export (prj.md Section 9). TODO (TDD): stream CSV via src/lib/csv.ts,
// guarded by can(role, "data:export"); Admins must receive 403.
export function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
