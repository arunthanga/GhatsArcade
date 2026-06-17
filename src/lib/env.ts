import { z } from "zod";

// Typed, validated environment variables (fail fast on misconfiguration).
// Server-only values live in `serverEnv`; values safe to expose to the browser
// must be prefixed NEXT_PUBLIC_ and read from `publicEnv`.
//
// Do NOT import `serverEnv` into Client Components - only server code (route
// handlers, server actions, src/server/*, src/lib/auth.ts) should read it.

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DATABASE_AUTH_TOKEN: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(1, "BETTER_AUTH_SECRET is required"),
  BETTER_AUTH_URL: z.string().url("BETTER_AUTH_URL must be a valid URL"),
});

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),
});

function parse<T extends z.ZodTypeAny>(schema: T, source: NodeJS.ProcessEnv): z.infer<T> {
  const result = schema.safeParse(source);
  if (!result.success) {
    const issues = result.error.issues.map((i) => `  - ${i.path.join(".")}: ${i.message}`);
    throw new Error(`Invalid environment variables:\n${issues.join("\n")}`);
  }
  return result.data;
}

export const serverEnv = parse(serverSchema, process.env);
export const publicEnv = parse(publicSchema, process.env);
