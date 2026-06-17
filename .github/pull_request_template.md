## Summary

<!-- What does this PR change, and why? Link the relevant prj.md section(s). -->

## TDD checklist

- [ ] Failing test(s) were written **first** from the prj.md requirement (Red).
- [ ] Minimum implementation makes them pass (Green); refactored with tests green.
- [ ] Unit/component/integration tests are **co-located** with the source.
- [ ] Security-critical logic (`src/lib/roles.ts`, single-Owner invariant) keeps 100% branch coverage.

## Quality gate

- [ ] `pnpm check` (Biome lint + format) passes.
- [ ] `pnpm typecheck` passes.
- [ ] `pnpm test:run` passes.

## Licensing

- [ ] Any new dependency is permissively licensed (MIT/Apache/BSD/ISC/PostgreSQL); no AGPL/SSPL. See prj.md Section 7.

## Notes

<!-- Screenshots, follow-ups, or anything reviewers should know. -->
