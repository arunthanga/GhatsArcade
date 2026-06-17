import { NextResponse } from "next/server";

// TODO (TDD): GET (public, published only) + POST (Owner/Admin) via src/server/listings.ts.
export function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
