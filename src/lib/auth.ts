import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins";
import { prisma } from "@/lib/db";
import { serverEnv } from "@/lib/env";

// Better Auth configuration (prj.md Section 7). Email/password only at launch.
// Owner/Admin role lives on the User model; FEATURE permission checks always go
// through src/lib/roles.ts. The admin plugin only gates Better Auth's own admin
// endpoints, restricted here to the OWNER role.
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true, // accounts are created by the Owner, never self-service
  },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "ADMIN", input: false },
      isActive: { type: "boolean", required: false, defaultValue: true, input: false },
    },
  },
  plugins: [
    admin({
      defaultRole: "ADMIN",
      adminRoles: ["OWNER"],
    }),
  ],
  secret: serverEnv.BETTER_AUTH_SECRET,
  baseURL: serverEnv.BETTER_AUTH_URL,
});
