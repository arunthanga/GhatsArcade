import { NextResponse } from "next/server";

// TODO (TDD): GET (public, published) + POST (Owner/Admin) via src/server/blog.ts.
export function GET() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
