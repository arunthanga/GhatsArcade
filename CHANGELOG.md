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
- Prisma schema and seed for the single Owner account.
- Repository hygiene: CI workflow, CONTRIBUTING, SECURITY, proprietary LICENSE, Dependabot,
  CODEOWNERS, PR template, `.editorconfig`, `.gitattributes`, typed env validation.
