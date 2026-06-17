"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      data-testid="sign-out"
      onClick={async () => {
        await signOut();
        router.push("/admin/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
