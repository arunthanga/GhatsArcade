import { NextResponse } from "next/server";

// TODO (TDD): POST (public lead capture, validated by leadInquirySchema) +
// GET (Owner/Admin) via src/server/leads.ts.
export function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
