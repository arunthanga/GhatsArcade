# Security Policy

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report suspected vulnerabilities privately via GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
(the **Security** tab -> **Report a vulnerability**), or by emailing the maintainer
at `security@example.com` (replace with the real contact before launch).

Please include steps to reproduce, affected routes/components, and impact. We aim to
acknowledge reports within a few business days.

## Security-critical areas

The following are treated as security-critical and require extra scrutiny and
100% branch test coverage (see [prj.md](prj.md) Section 9):

- `src/lib/roles.ts` - role/permission checks, fail-closed default.
- The **single-Owner invariant** - exactly one Owner; the Owner role can never be
  assigned, deleted, or duplicated through any code path.
- Owner-only operations - Admin management and data export.
- Authentication/session handling (`src/lib/auth.ts`).

## Supported versions

This project is pre-1.0 and under active development; only the latest `main` is supported.
