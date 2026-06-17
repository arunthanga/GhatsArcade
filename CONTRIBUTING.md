# Contributing to Ghats Arcade

This project follows **strict Test-Driven Development (TDD)**. The full spec lives in
[prj.md](prj.md); this guide is the short, practical version. `prj.md` is the source of
truth — when in doubt, encode the requirement as a test.

## Golden rule

**No production code is written without a failing test first.** A change's first edit is
always its test, never its implementation.

## The Red -> Green -> Refactor loop

For every feature or fix:

1. **RED** — Translate the relevant `prj.md` requirement into one or more tests. Run them
   and watch them fail for the right reason.
2. **GREEN** — Write the minimum code needed to make the test(s) pass.
3. **REFACTOR** — Improve the design while keeping every test green.

```bash
pnpm test            # watch mode while you work
pnpm test:run        # one-shot run (what CI does)
pnpm test:coverage   # coverage report (roles/permissions must hit 100% branches)
```

## Where tests live

| Kind | Location | Runs |
|---|---|---|
| Unit / component / integration | **Co-located** as `src/**/*.test.ts(x)` | Every commit / CI |
| Regression | `tests/regression/` | On demand: `pnpm test:regression` |
| Reports | `tests/reports/` (gitignored) | On demand: `pnpm test:report` |
| E2E (Playwright) | `tests/e2e/` | Phase 2 (deferred) |

## Security-critical code

Roles, permissions, the single-Owner invariant, and the fail-closed default
(`src/lib/roles.ts`) **require 100% branch coverage** and must stay as pure, independently
tested modules — never inline-only in UI or route handlers. See [prj.md](prj.md) Section 9.

## Definition of Done

A feature may be marked **Done** (prj.md Section 10) only when its full derived test suite
passes. "In Progress" must state which sub-tasks have tests written/passing vs. not.

## Before you open a PR

Run the same checks CI runs:

```bash
pnpm check       # Biome lint + format
pnpm typecheck   # tsc --noEmit
pnpm test:run    # tests
```

## Dependency & license policy

- Prefer **permissive** licenses (MIT, Apache-2.0, BSD, ISC, PostgreSQL License).
- **Do not** build on AGPL/SSPL software (e.g., MinIO, MongoDB server) — the application
  code is kept private/proprietary. Verify a dependency's license before adding it; flag
  anything copyleft/restrictive for approval. See [prj.md](prj.md) Section 7 (License Policy).
- Add dependencies via the package manager (`pnpm add`) so versions are pinned in the
  lockfile — do not hand-write version numbers.
