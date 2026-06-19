import { redirect } from "next/navigation";

// /admin is just an entry point. The dashboard layout guard sends unauthenticated
// visitors on to /admin/login, so we can always aim them at the overview first.
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
