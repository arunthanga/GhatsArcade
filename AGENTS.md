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
- **Dependencies are pinned to semver ranges + a committed `pnpm-lock.yaml`.**
  The critical, non-obvious pin:
  - `better-auth` → **exactly `1.4.5`** (do NOT widen to `^1.3.9`/latest). `>=1.4.6`
    requires every `adminRoles` entry to be defined in a `roles` access-control config;
    `src/lib/auth.ts` uses `adminRoles: ["OWNER"]` without one, so newer versions throw
    `Invalid admin roles: OWNER` at seed/auth time. (better-auth 1.4.5 emits a harmless
    unmet-peer warning for `zod@^4` since the app uses zod 3 — safe to ignore.)
  - The Prisma line stays on v6 (`@prisma/client`/`prisma`/`@prisma/adapter-libsql`
    `^6.16.3`); the schema uses `datasource { url = env(...) }`, which **Prisma 7 removed**.
  Keep these pins; do not "upgrade to latest" without also migrating the code.
- **pnpm is `9.15.9` via the `packageManager` field** (corepack). A one-time
  `node_modules` purge prompt appears only when switching pnpm majors; on a warm
  snapshot `pnpm install` runs non-interactively.
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

### Verified working
`pnpm check` (no errors), `pnpm typecheck`, `pnpm test:run` (129 tests), `pnpm build`
(full production build), and `pnpm dev` all pass. The Prisma + SQLite + Better Auth
runtime (lead capture, CRM listing, seeded-owner login) works end-to-end.
