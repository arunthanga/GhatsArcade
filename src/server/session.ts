import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { type Action, can } from "@/lib/roles";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

// Server-side current user (null if not signed in). Use in Server Components,
// route handlers, and server actions - never a React hook.
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return null;
  }
  const { id, email, name, role } = session.user as SessionUser;
  return { id, email, name, role };
}

// Require an authenticated admin-area user; redirect to login otherwise.
export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

// Require a specific permission for a page; send users who lack it back to the
// dashboard. (API routes check `can(...)` directly and return 403 instead.)
export async function requirePermission(action: Action): Promise<SessionUser> {
  const user = await requireUser();
  if (!can(user.role, action)) {
    redirect("/admin/dashboard");
  }
  return user;
}
