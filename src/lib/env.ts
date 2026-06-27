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
  // Media uploads. Files land in UPLOAD_DIR (a Docker volume in production) and are
  // served at UPLOAD_PUBLIC_BASE. Default keeps them under Next's static `public/` dir.
  UPLOAD_DIR: z.string().default("public/uploads"),
  UPLOAD_PUBLIC_BASE: z.string().default("/uploads"),
  MAX_IMAGE_UPLOAD_MB: z.coerce.number().int().positive().default(15),
  MAX_PDF_UPLOAD_MB: z.coerce.number().int().positive().default(25),
  MAX_VIDEO_UPLOAD_MB: z.coerce.number().int().positive().default(200),
  // Transactional email (Resend). Optional: when RESEND_API_KEY is unset, the mailer
  // no-ops so local/dev and tests never attempt to send.
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().default("Ghats Arcade <onboarding@resend.dev>"),
});

// Treat an empty string env var as "unset" so `NEXT_PUBLIC_OFFICE_LAT=""` doesn't coerce to 0.
const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional(),
  // Office / contact location for the map on /contact. Both lat & lng must be set for the
  // map to render; the address is an optional human-readable line shown beside it.
  NEXT_PUBLIC_OFFICE_LAT: z.preprocess(emptyToUndefined, z.coerce.number().min(-90).max(90).optional()),
  NEXT_PUBLIC_OFFICE_LNG: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(-180).max(180).optional(),
  ),
  NEXT_PUBLIC_OFFICE_ADDRESS: z.string().optional(),
  // Public link behind the "Read our Google reviews" CTA. Set this to the real Google
  // Business Profile / Maps reviews URL; defaults to a Google search for the brand.
  NEXT_PUBLIC_GOOGLE_REVIEWS_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().default("https://www.google.com/search?q=Ghats+Arcade+reviews"),
  ),
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
