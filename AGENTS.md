# AGENTS.md

## Cursor Cloud specific instructions

### What this is
`ghats-arcade` — a single Next.js (App Router) app: a public marketing/lead-gen
website (`src/app/(public)/`) plus an admin/CRM (`src/app/admin/`, `src/app/api/`).
Storage is a local SQLite file via Prisma (`DATABASE_URL="file:./dev.db"`). Auth is
Better Auth (in-app, no external service). Everything runs in one Next process on
port 3000. See `README.md` and `prj.md` for product detail.

### Standard commands (see `package.json` scripts)
- Run dev: `pnpm dev` (http://localhost:3000)
- Lint/format check: `pnpm check` (or `pnpm lint`); typecheck: `pnpm typecheck`
- Tests: `pnpm test:run` (unit/component/integration), `pnpm test:integration` (DB-backed only)
- Build: `pnpm build`
- DB (local dev): `pnpm prisma db push` then `pnpm prisma db seed`

### Non-obvious gotchas
- **Dependencies are pinned, not `latest`.** The repo's `package.json` originally
  pinned every dep to `"latest"` with no committed lockfile, which resolves to
  incompatible majors. Working pins (in this branch) + a committed `pnpm-lock.yaml`:
  - `prisma` / `@prisma/client` / `@prisma/adapter-libsql` → `^6.19.3` (the schema
    uses `datasource { url = env(...) }`, which **Prisma 7 removed**).
  - `better-auth` → **exactly `1.4.5`** (>=1.4.6 requires every `adminRoles` entry to
    be defined in a `roles` access-control config; the app uses `adminRoles: ["OWNER"]`
    without one, so newer versions throw `Invalid admin roles: OWNER`).
  - `@biomejs/biome` → `2.0.6` (matches `biome.json`'s `2.0.0` schema).
  Keep these pins; do not "upgrade to latest" without also migrating the code.
- **`pnpm.onlyBuiltDependencies`** in `package.json` lets `sharp`/`prisma`/`esbuild`/
  `msw` run their install scripts non-interactively. Do not run `pnpm approve-builds`
  (interactive).
- **Integration tests need a Prisma consent env var.** `tests/helpers/global-setup.ts`
  runs `prisma db push --force-reset` on a throwaway `file:./test.db`. Prisma 6.19+
  blocks this in agent environments unless you set
  `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION="<reason>"`. Example:
  `PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION="run integration tests" pnpm test:integration`.
  This only ever touches the local `test.db`, never production.
- **`.env` and `dev.db` are gitignored** and live only in the VM snapshot (not the
  repo). If they go missing, recreate: `cp .env.example .env` (set `BETTER_AUTH_SECRET`
  and an `OWNER_PASSWORD`), then `pnpm prisma db push && pnpm prisma db seed`.
- **Running `next dev`/`next build` rewrites `tsconfig.json`** (jsx → `react-jsx`,
  adds `.next/dev/types`). That edit is expected/harmless; leave it uncommitted.

### KNOWN BROKEN: app cannot render/build yet (missing source files)
This is an incomplete scaffold. Several imported modules were **never committed**, so
the dev server boots but every route 500s and `pnpm build` fails with "Module not
found". This is a code-completeness issue, **not** an environment problem. Missing:
- `src/components/public/BuyerTypePersonalization` (`BuyerTrustSnippet`, `BuyerTypeSelector`)
- `src/components/public/HomeHowItWorks`
- `src/components/public/EligibilityServiceNote`
- `src/components/public/FarmhouseSupportNote`
- `src/components/public/RelatedArticles`
- `src/components/admin/RichTextEditor`
- `src/lib/rate-limit`

The rest of the stack is verified working: `pnpm test:run` passes 127 tests (the only
failing suite, `ListingCard.test.tsx`, is blocked solely by the missing files above),
`pnpm test:integration` passes 56 DB-backed tests, and the Prisma + SQLite + Better
Auth runtime (lead capture, CRM listing, owner login) works. Create the files above to
make the UI build and run.
