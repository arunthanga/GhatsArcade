# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Blog/CMS module: pure status/publish rules (`lib/blog-status.ts`: published-only visibility
  and a `resolvePublishedAt` lifecycle — stamped on first publish, preserved across edits,
  cleared on unpublish); validation (`createBlogPostSchema`/`updateBlogPostSchema`); gated
  service (`server/blog.ts`) with auto-generated unique slugs, publish handling, and
  published-only public reads; `GET`(public)/`POST`(gated) `/api/blog` and `PATCH`/`DELETE`
  `/api/blog/[id]`; public blog list + post pages (Article JSON-LD, metadata, sitemap slugs);
  Owner/Admin `BlogManager` UI. Unit tests (`blog-status`, `blog-validation`) plus
  `blog.integration.test.ts`. Body is plain text for now (no markdown).
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
- Data export (Owner-only CSV): pure RFC-4180 serializer (`lib/csv.ts`), Owner-gated export
  service (`server/export.ts`) for the `leads` and `listings` datasets with fixed columns,
  `GET /api/export?dataset=` streaming a CSV download (403 for non-Owners), and a guarded
  Owner-only `admin/(dashboard)/export` page. Unit tests (`csv`) + `export.integration.test.ts`.
- Public site polish + SEO: implemented `lib/seo.ts` (absolute URLs, RealEstateListing /
  BlogPosting / Organization / WebSite JSON-LD, `buildSitemapEntries`) + `JsonLd` component;
  dynamic `sitemap.ts` (published listing slugs); per-page metadata/canonical/OG (listing
  detail `generateMetadata`, home org/website JSON-LD, static metadata on about/contact/
  listings/blog). Added a shared public shell (`(public)/layout.tsx`, `SiteHeader`,
  `SiteFooter`) with a calm green/earth Tailwind theme, home hero + featured listings, About
  content, and styled cards/forms; moved `LegalDisclaimer` from the root layout into the
  public footer. Unit tests: `seo`, `JsonLd`, `SiteHeader`.
- Lead capture + CRM: open capture service (`server/leads.ts`) with source-listing
  resolution and a pure status pipeline (`lib/lead-status.ts`); gated list/get, status
  updates, and follow-up notes; `POST`/`GET /api/leads`, `PATCH /api/leads/[id]`,
  `POST /api/leads/[id]/notes`; public `LeadInquiryForm` (with honeypot) on listing detail
  and contact pages; Owner/Admin `LeadManager` CRM UI. Unit tests (`lead-status`,
  `lead-validation`) plus `leads.integration.test.ts`.
- Listings feature: gated CRUD service (`server/listings.ts`) with auto-generated unique
  slugs, status-transition rules, and public-visibility filtering; pure helpers
  (`lib/slug.ts`, `lib/listing-status.ts`, `lib/format.ts`); listing/filter Zod schemas;
  `GET`/`POST /api/listings` + `PATCH`/`DELETE /api/listings/[id]`; public browse + detail
  pages (`ListingCard`, WhatsApp + legal disclaimer); Owner/Admin `ListingManager` UI.
  Unit tests for utils/validation/`ListingCard` plus `listings.integration.test.ts`.
- Test harness: SQLite integration config (`vitest.integration.config.ts`) with a
  `prisma db push` global setup, `tests/helpers` (DB reset + user factories), and a
  `test:integration` script; unit tests for `admin-rules` and `session`, plus
  `admins.integration.test.ts`.
- Repository hygiene: CI workflow, CONTRIBUTING, SECURITY, proprietary LICENSE, Dependabot,
  CODEOWNERS, PR template, `.editorconfig`, `.gitattributes`, typed env validation.
