# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Project scaffold: Next.js (App Router) + TypeScript, Prisma (SQLite/libSQL), Better Auth.
- Strict TDD setup: Vitest + React Testing Library, co-located tests, on-demand regression/reports.
- Security-critical roles/permissions module (`src/lib/roles.ts`) with 100% branch-coverage tests.
- WhatsApp click-to-chat link builder (`src/lib/whatsapp.ts`) with tests.
- Prisma schema and seed for the single Owner account (created with a Better Auth credential).
- Auth + roles foundation: Better Auth email/password with the admin plugin (Owner-gated),
  client (`auth-client.ts`), server session/role guards (`server/session.ts`), `/admin/login`
  form, and a guarded `admin/(dashboard)` route group.
- Owner-only admin management: pure guard rules (`server/admin-rules.ts`), service
  (`server/admins.ts`), `POST`/`GET /api/admins` + `DELETE /api/admins/[id]`, and a minimal
  Owner-only admins UI — enforcing the single-Owner invariant server-side.
- Test harness: SQLite integration config (`vitest.integration.config.ts`) with a
  `prisma db push` global setup, `tests/helpers` (DB reset + user factories), and a
  `test:integration` script; unit tests for `admin-rules` and `session`, plus
  `admins.integration.test.ts`.
- Repository hygiene: CI workflow, CONTRIBUTING, SECURITY, proprietary LICENSE, Dependabot,
  CODEOWNERS, PR template, `.editorconfig`, `.gitattributes`, typed env validation.
