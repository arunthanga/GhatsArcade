# Ghats Arcade

> **Tranquility meets high-yields**

A marketing and lead-generation website for a managed farmland business that lists agricultural land properties (primarily in Kerala, also the Kerala–Tamil Nadu border region) for sale/investment.

> This is **not** an e-commerce or transactional property marketplace. There are no online payments, escrow, or legal title transfers. Ghats Arcade is a lead-generation and content-marketing platform with an admin/CRM backend for managing listings, leads, and follow-ups — including direct WhatsApp contact.

The canonical, always-up-to-date project specification lives in [prj.md](prj.md). This README is a generated summary of it.

---

## Table of Contents

- [Overview](#overview)
- [Target Users](#target-users)
- [Features](#features)
- [Out of Scope (this phase)](#out-of-scope-this-phase)
- [Tech Stack](#tech-stack)
- [Development Methodology (TDD)](#development-methodology-tdd)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Testing](#testing)
- [Roles & Permissions](#roles--permissions)
- [Data Model](#data-model)
- [Deployment](#deployment)
- [License Policy](#license-policy)
- [Roadmap (Phase 2)](#roadmap-phase-2)
- [License & Branding](#license--branding)

---

## Overview

The site's job is to showcase land listings attractively, rank well in search engines via fresh content (blog/CMS), capture visitor/lead information, and feed that data into a CRM-style admin panel so the business owner can follow up and convert deals.

**Audience:**
- Buyers from metro cities in India
- NRIs (Non-Resident Indians) in Europe, the Gulf, and the US
- Foreign citizens / OCI cardholders interested in Indian agri-land investment

---

## Target Users

| Segment | Primary Need |
|---|---|
| Metro India buyers | Browse listings, compare, inquire, schedule visits |
| NRIs (Europe, Gulf, US) | Remote browsing, WhatsApp/video contact, eligibility clarity |
| Foreign citizens / OCI | Same as NRIs, with extra legal-eligibility caution |
| Site Owner (Super Admin) | Manage listings, leads, admins, content, exports |
| Admin(s) (future hires) | Manage listings/leads day to day; no destructive/export rights |

---

## Features

### Public-facing website
- **Home page** — hero, value proposition, featured listings, trust signals
- **Listings page** — browse/filter by location, size, price range, land type
- **Listing detail** — photos, description, location/map, price, land classification, buyer-eligibility disclaimer, inquiry form, WhatsApp click-to-chat
- **About** and **Contact** pages (phone, email, WhatsApp, address, hours, embedded map)
- **Blog / CMS** — SEO articles (investment guides, region spotlights, legal FAQs), admin-publishable
- **Legal disclaimer** — prominent and persistent (footer + listing pages + inquiry form), covering NRI/FEMA eligibility caveats
- **Lead capture** — inquiry forms on listings, contact page, and a general "request a callback" form
- **WhatsApp integration** — `wa.me` click-to-chat links with pre-filled message context
- **SEO fundamentals** — meta tags, Open Graph, `sitemap.xml`, `robots.txt`, semantic HTML, fast loads, schema.org JSON-LD (`RealEstateListing` / `Article`)

### Admin / CRM backend
- **Authentication** — email/password login for Owner and Admins
- **Role-based access** — Owner (Super Admin) vs Admin (see [Roles & Permissions](#roles--permissions))
- **Listings management** — CRUD with status: Draft / Published / Under Offer / Sold
- **Lead / CRM management** — view captured leads with source, update status (New → Contacted → Negotiating → Converted/Lost), add follow-up notes, log WhatsApp/call contact attempts
- **Data export** — CSV export of leads/listings, **Owner-only**
- **Blog / CMS management** — create/edit/delete/publish posts, rich text + image upload

---

## Out of Scope (this phase)

- Online payments, booking deposits, or escrow
- Legal document generation, contract management, or e-signing
- Property title verification or legal due-diligence tooling
- Automated WhatsApp Business API messaging/chatbots (Phase 2)
- Multi-language i18n (Phase 2)
- Mobile native apps (web-responsive only at launch)
- Buyer-side accounts/logins (only Owner/Admin log in)
- Automated drip-email / marketing-automation sequences (Phase 2)
- Multi-tenant / multi-business support (single business only)

---

## Tech Stack

> The stack is **provisional** and may be revised; the strict TDD methodology applies regardless of tooling. All dependencies are free and permissively licensed — see the [License Policy](#license-policy).

| Layer | Choice | License |
|---|---|---|
| Language | **TypeScript** | Apache-2.0 |
| Framework (UI + API) | **Next.js (App Router) + React** | MIT |
| Database (primary, lightweight) | **SQLite** locally (file / in-memory for tests) + **Turso / libSQL** in the cloud | Public domain / MIT |
| Database (scale-up path) | **PostgreSQL** via Neon / Supabase | PostgreSQL License |
| ORM | **Prisma** (Drizzle acceptable alternative) | Apache-2.0 |
| Auth | **Better Auth** (Auth.js/NextAuth as fallback) | MIT |
| Validation | **Zod** | MIT |
| Styling / UI | **Tailwind CSS** + **shadcn/ui** | MIT |
| Forms | **React Hook Form** | MIT |
| Rich text (blog) | **Tiptap (core)** or **Lexical** | MIT |
| Media storage | **Local disk / Docker volume** (SeaweedFS / object-storage tier later) | Apache-2.0 (scale-up) |
| Testing | **Vitest**, **React Testing Library**, **Playwright** (E2E, Phase 2) | MIT / Apache-2.0 |
| Lint / format | **Biome** (or ESLint + Prettier) | permissive |
| SEO | Next.js Metadata API, **next-sitemap**, schema.org JSON-LD | MIT |
| Deployment | **Docker Compose** (self-host / VPS / Coolify) | Apache-2.0 |

> **Database rule:** keep the **same engine in local and cloud** (SQLite ↔ Turso, or Postgres ↔ Neon) to avoid SQL-dialect drift. Prisma abstracts the swap down to mostly a connection-string/adapter change.

---

## Development Methodology (TDD)

This project follows **strict Test-Driven Development**. This is a fixed requirement, independent of the (provisional) tech stack.

**Red → Green → Refactor:**
1. **RED** — Translate the relevant `prj.md` requirement(s) into *failing* tests before writing any production code.
2. **GREEN** — Write the minimum code to make the tests pass.
3. **REFACTOR** — Improve the design with tests staying green.

Hard rules:
- No production code without a failing test first.
- `prj.md` is the source of truth from which test lists are derived.
- Security-critical logic (roles/permissions, single-Owner invariant, fail-closed default) requires **100% branch coverage** and lives in a pure, independently tested module (`src/lib/roles.ts`), never inline in UI only.
- A feature is **Done** only when its full derived test suite passes.

See Section 6 of [prj.md](prj.md) for the complete methodology.

---

## Project Structure

A single Next.js App Router app (frontend + API routes together), with Prisma, co-located tests, and Docker self-hosting.

```text
GhatsArcade/
├─ README.md
├─ prj.md                        # canonical spec (source of truth)
├─ CONTRIBUTING.md               # TDD workflow + quality gate
├─ SECURITY.md                   # vulnerability reporting policy
├─ CHANGELOG.md
├─ LICENSE                       # proprietary / all rights reserved
├─ package.json
├─ next.config.mjs
├─ tsconfig.json
├─ biome.json                    # lint + format config
├─ .editorconfig
├─ .gitattributes                # line-ending normalization (LF)
├─ .nvmrc                        # pinned Node version
├─ .env.example                  # DB url (SQLite file / Turso), auth secrets, WhatsApp number, site URL
├─ .gitignore
├─ .dockerignore
├─ docker-compose.yml            # Next.js app + SQLite volume (Postgres service on scale-up path)
├─ Dockerfile
├─ vitest.config.ts
├─ next-sitemap.config.js
│
├─ .github/
│  ├─ workflows/ci.yml           # install, prisma generate, biome check, typecheck, tests
│  ├─ dependabot.yml             # weekly dependency + actions updates
│  ├─ CODEOWNERS
│  └─ pull_request_template.md   # TDD + license checklist
│
├─ .vscode/                      # recommended extensions + Biome-on-save settings
│
├─ prisma/
│  ├─ schema.prisma              # User, Listing, Lead, BlogPost, FollowUpNote
│  ├─ migrations/
│  └─ seed.ts                    # seeds the single OWNER account
│
├─ public/
│  ├─ images/                    # static/brand assets (placeholder branding)
│  ├─ robots.txt
│  └─ favicon.ico
│
├─ src/
│  ├─ app/
│  │  ├─ (public)/               # public marketing site (SSR/SSG for SEO)
│  │  │  ├─ page.tsx             # Home (hero, featured listings, trust signals)
│  │  │  ├─ listings/
│  │  │  │  ├─ page.tsx          # browse/filter
│  │  │  │  └─ [slug]/page.tsx   # listing detail + inquiry + WhatsApp + disclaimer
│  │  │  ├─ blog/
│  │  │  │  ├─ page.tsx
│  │  │  │  └─ [slug]/page.tsx
│  │  │  ├─ about/page.tsx
│  │  │  └─ contact/page.tsx
│  │  │
│  │  ├─ admin/                  # auth-gated CRM backend
│  │  │  ├─ layout.tsx           # session + role guard
│  │  │  ├─ login/page.tsx
│  │  │  ├─ dashboard/page.tsx
│  │  │  ├─ listings/            # CRUD UI
│  │  │  ├─ leads/               # CRM: status, follow-up notes
│  │  │  ├─ blog/                # CMS CRUD
│  │  │  └─ admins/page.tsx      # Owner-only: add/delete admins
│  │  │
│  │  ├─ api/
│  │  │  ├─ auth/                # login/logout/session (Better Auth)
│  │  │  ├─ listings/
│  │  │  ├─ leads/               # public POST (capture) + admin routes
│  │  │  ├─ blog/
│  │  │  ├─ admins/              # Owner-only
│  │  │  └─ export/              # Owner-only CSV export
│  │  │
│  │  ├─ sitemap.ts
│  │  ├─ layout.tsx              # root layout + persistent legal disclaimer footer
│  │  └─ globals.css
│  │
│  ├─ components/
│  │  ├─ public/                 # Hero, ListingCard, InquiryForm, WhatsAppButton, LegalDisclaimer, SeoJsonLd
│  │  ├─ admin/                  # tables, forms, status badges
│  │  └─ ui/                     # shared primitives (shadcn/ui)
│  │
│  ├─ lib/
│  │  ├─ roles.ts                # SECURITY-CRITICAL pure permissions module (100% branch cov)
│  │  ├─ roles.test.ts           # co-located tests (fail-closed + single-Owner invariant)
│  │  ├─ env.ts                  # typed, validated env vars (zod) - fail fast on misconfig
│  │  ├─ auth.ts                 # Better Auth setup + session helpers
│  │  ├─ db.ts                   # Prisma client singleton (SQLite/libSQL; Postgres on scale-up)
│  │  ├─ csv.ts                  # export serialization (Owner-only)
│  │  ├─ seo.ts                  # meta/OpenGraph/JSON-LD helpers
│  │  ├─ whatsapp.ts             # wa.me link builder w/ pre-filled context
│  │  └─ validation/             # zod schemas for forms/inputs
│  │
│  ├─ server/                    # service-layer logic callable from API routes/actions
│  │  ├─ listings.ts
│  │  ├─ leads.ts
│  │  ├─ blog.ts
│  │  └─ admins.ts
│  │
│  └─ types/                     # shared TS types/enums
│
│  # Unit / component / integration tests are CO-LOCATED with source as *.test.ts(x)
│  # e.g. src/lib/roles.test.ts, src/components/public/ListingCard.test.tsx
│
├─ tests/                        # suites that don't map to a single source file
│  ├─ regression/                # regression suites (run on demand, not every commit)
│  ├─ e2e/                       # Playwright end-to-end (Phase 2, deferred)
│  └─ reports/                   # generated test/coverage reports (on demand, gitignored)
│
└─ docs/
   └─ ERD.md                     # data model / ERD as it formalizes
```

Key conventions:
- The `(public)` route group is statically generated / server-rendered for SEO.
- `app/` is kept **thin** (routing only) — pages compose UI and delegate logic to `src/lib` / `src/server`.
- Permissions live **only** in `src/lib/roles.ts` as a pure, independently tested module — never inline in UI.
- All write APIs go through `src/server/*` so role checks and the single-Owner invariant are enforced server-side.
- Environment variables are validated once in `src/lib/env.ts` (zod) and read from there, never via raw `process.env`.
- **Tests:** unit, component, and integration tests are **co-located** with their source as `*.test.ts(x)`. The top-level `tests/` folder holds only cross-cutting suites — `regression/`, `e2e/`, and generated `reports/`.

> Architecture note: this uses a **layer-based** structure (`lib` / `server` / `components`) rather than full feature-sliced (`src/features/*`). For a solo-operator app of this size that is the simpler, lower-overhead choice and matches the `lib/roles.ts` path called out in the spec. If the domain grows substantially, migrating to feature folders is a natural next step.

---

## Getting Started

> The repository is scaffolded (structure, configs, Prisma schema, the `roles` and `whatsapp`
> modules + tests). Dependencies are **not installed yet** — `package.json` pins third-party
> versions as `"latest"`, so run `pnpm install` once and commit the generated `pnpm-lock.yaml`
> to lock them. Tests are written but have not been executed/verified here.

### Prerequisites
- Node.js 20 (see [.nvmrc](.nvmrc)) and **pnpm** (>=9)
- Docker + Docker Compose (for self-hosting / local Postgres on the scale-up path)

### Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Create your environment file and fill in values
cp .env.example .env

# 3. Generate the Prisma client, run migrations, and seed the single Owner
pnpm prisma generate
pnpm prisma migrate dev
pnpm prisma db seed

# 4. Start the dev server
pnpm dev
```

`.env` (illustrative):

```bash
# SQLite (local file)
DATABASE_URL="file:./dev.db"
# Turso / libSQL (cloud) — used in production instead of the local file
# DATABASE_URL="libsql://<your-db>.turso.io"
# DATABASE_AUTH_TOKEN="<turso-token>"

BETTER_AUTH_SECRET="<random-secret>"
BETTER_AUTH_URL="http://localhost:3000"

NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_WHATSAPP_NUMBER="<country-code-and-number>"
```

### Run with Docker

```bash
docker compose up --build
```

---

## Testing

Per the strict TDD workflow — write failing tests first, then implement.

**Test locations:**
- **Unit / component / integration** tests are **co-located** with their source as `*.test.ts(x)` (e.g., `src/lib/roles.test.ts`). These run on every commit/CI.
- **Regression** suites live in `tests/regression/` and are run **on demand** (e.g., before a release), not on every commit.
- **Reports** (coverage / regression output) are generated **on demand** into `tests/reports/` (gitignored).
- **E2E** (`tests/e2e/`) is Playwright, deferred to Phase 2.

```bash
pnpm test                 # Vitest co-located unit + component + integration (watch)
pnpm test run             # single run (CI)
pnpm test --coverage      # coverage report (roles/permissions must hit 100% branches)
pnpm test:regression      # run regression suite on demand (tests/regression/)
pnpm test:report          # generate test/coverage report into tests/reports/
# pnpm test:e2e           # Playwright end-to-end (Phase 2, deferred)
```

| Layer | Tool | Location | When |
|---|---|---|---|
| Unit | Vitest | Co-located (`*.test.ts`) | Every commit |
| Component | React Testing Library | Co-located (`*.test.tsx`) | Every commit |
| Integration | Vitest + MSW | Co-located (`*.test.ts`) | Every commit |
| Regression | Vitest | `tests/regression/` | On demand (pre-release) |
| Reports | Vitest coverage / reporters | `tests/reports/` | On demand |
| E2E | Playwright | `tests/e2e/` | Phase 2 |

> Note: these scripts are defined in `package.json`. They run once dependencies are installed (`pnpm install`).

**Continuous Integration:** [`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on pushes and PRs to `main` — it installs deps (frozen lockfile), runs `prisma generate`, `pnpm check` (Biome), `pnpm typecheck`, and `pnpm test:coverage`. See [CONTRIBUTING.md](CONTRIBUTING.md) for the TDD workflow and pre-PR checklist.

---

## Roles & Permissions

| Action | Owner (Super Admin) | Admin |
|---|---|---|
| Log in to admin panel | Yes | Yes |
| Create/edit/delete listings | Yes | Yes |
| Create/edit/delete blog posts | Yes | Yes |
| View leads / CRM | Yes | Yes |
| Update lead status, add follow-up notes | Yes | Yes |
| Add a new Admin account | Yes | No |
| Delete an Admin account | Yes | No |
| Export any data (leads, listings, CSV) | Yes | No |
| Promote/demote the Owner role | No (impossible by design) | No |
| Delete the Owner account | No (impossible by design) | No |
| Duplicate/create a second Owner | No (impossible by design) | No |

**Hard invariant:** there must always be **exactly one** Owner account. No code path may demote, delete, or duplicate the Owner. This is security-critical and implemented as a pure, independently tested module with 100% branch coverage.

**Fail-closed rule:** any undefined/unknown role is denied all permissions by default (explicit test case required).

---

## Data Model

Initial draft (formalized as development proceeds — see [prj.md](prj.md) Section 8 and the ERD in [docs/ERD.md](docs/ERD.md); authoritative schema is [prisma/schema.prisma](prisma/schema.prisma)):

- **User** — `id, name, email, password_hash, role (OWNER | ADMIN), created_at, is_active`
- **Listing** — `id, title, slug, description, location, land_type, size_acres, price, status (draft | published | under_offer | sold), photos[], created_by, created_at, updated_at`
- **Lead** — `id, name, email, phone, buyer_type (resident_indian | nri | oci | foreign_citizen), source_listing?, message, status (new | contacted | negotiating | converted | lost), follow_up_notes[], created_at, updated_at`
- **BlogPost** — `id, title, slug, body, cover_image, status (draft | published), author, published_at, created_at, updated_at`
- **FollowUpNote** — `id, lead_id, author, note_text, contact_method (whatsapp | call | email | in_person), created_at`

---

## Deployment

- **Primary:** self-host via **Docker Compose** on a low-cost VPS, or use **Coolify** (Apache-2.0) as a self-hosted PaaS. The app ships with a SQLite volume; the Postgres scale-up path adds a Postgres service.
- **Cloud database:** **Turso** (SQLite/libSQL) or **Neon / Supabase** (Postgres) free tiers — both permit commercial use.
- **Caveat:** **Vercel's free Hobby tier prohibits commercial use.** Since Ghats Arcade is a commercial site, Hobby is not an option; use a paid tier or self-host. Truly-free-and-commercial hosting is limited, so a low-cost VPS (a few USD/month) is the realistic baseline.

---

## License Policy

The final application code is intended to remain **private/proprietary**. Technologies must be free but need not be strictly open-source. To protect the ability to keep the code closed:

- **Prefer permissive licenses:** MIT, Apache-2.0, BSD, ISC, PostgreSQL License.
- **Avoid building on / modifying AGPL or SSPL software** (network/service copyleft) — e.g., self-hosted MinIO (AGPL-3.0), MongoDB server (SSPL). Using such software as an unmodified external service may be acceptable, but it must never be a dependency the app links into.
- **Plain GPL/LGPL** is avoided by default to keep licensing simple.
- **Verify the license of every new dependency before adoption.** Flag anything copyleft/restrictive for approval before integration.

---

## Roadmap (Phase 2)

- WhatsApp Business API (open-source gateway or official Cloud API free tier) for templated/automated follow-ups
- Automated email drip sequences for lead nurturing
- Multi-language support (Malayalam, Tamil, Hindi, Arabic)
- Multiple Admins / regional agents with finer-grained permissions
- Playwright E2E test suite
- Possible company/share-based investment structure for NRI buyers (pending legal advice)
- Permissively-licensed self-hosted object storage (e.g., SeaweedFS) or a free object-storage tier if media volume grows

---

## License & Branding

- **Project license:** **proprietary / all rights reserved** — see [LICENSE](LICENSE). `package.json` is marked `"private": true` and `"license": "UNLICENSED"` so it is never accidentally published. This applies to the project's own code; third-party dependencies remain under their permissive licenses (see [License Policy](#license-policy)).
- **Domain & branding:** not yet acquired — **TBD**. Placeholder branding (name "Ghats Arcade", tagline "Tranquility meets high-yields") is used until real assets are provided. This is a known gap to revisit before public launch.
