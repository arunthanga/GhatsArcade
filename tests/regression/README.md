# Regression suites

Cross-cutting regression tests that guard against previously-fixed bugs reappearing.

- **Run on demand** (e.g. before a release), not on every commit: `pnpm test:regression`.
- Each test should reference the issue/bug it locks down.
- Keep unit/component/integration tests **co-located** with their source instead (`src/**/*.test.ts(x)`); only put broad, cross-module regression checks here.
