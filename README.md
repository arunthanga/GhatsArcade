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
- [Development Methodology](#development-methodology)
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
- **Listing detail** — photos, description, location (text), price, land classification, buyer-eligibility disclaimer, inquiry form, WhatsApp click-to-chat *(embedded map is a Phase-2 enhancement)*
- **About** and **Contact** pages (phone, email, WhatsApp, address, hours; the Contact page shows an embedded OpenStreetMap of the office when `NEXT_PUBLIC_OFFICE_LAT`/`_LNG` are configured)
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
- **Blog / CMS management** — create/edit/delete/publish posts with an editorial category, per-post SEO overrides (meta title/description, social image), cover-image upload, and auto-estimated reading time (overridable)

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

> The stack is **provisional** and may be revised. All dependencies are free and permissively licensed — see the [License Policy](#license-policy). v4 added server-side HTML sanitisation, media/PDF upload, and open-source maps (Leaflet, wired on the project-detail page) — all in active use. A rich-text WYSIWYG editor (TipTap) was evaluated but removed from dependencies until it is actually built (no architectural change).

| Layer | Choice | License |
|---|---|---|
| Language | **TypeScript** | Apache-2.0 |
| Framework (UI + API) | **Next.js (App Router) + React** | MIT |
| Database (primary, lightweight) | **SQLite** locally (file / in-memory for tests) + **Turso / libSQL** in the cloud | Public domain / MIT |
| Database (scale-up path) | **PostgreSQL** via Neon / Supabase | PostgreSQL License |
| ORM | **Prisma ≥ 6.2** (native `Json` columns on SQLite need 6.2+) | Apache-2.0 |
| Auth | **Better Auth** (Auth.js/NextAuth as fallback) | MIT |
| Validation | **Zod** | MIT |
| Styling / UI | **Tailwind CSS** + **shadcn/ui** | MIT |
| Forms | **React Hook Form** | MIT |
| Rich text | **As built:** project + event descriptions authored as HTML in a `<textarea>`, sanitised with **sanitize-html** on write, rendered as HTML. Blog bodies are plain text (line breaks preserved). A WYSIWYG editor (TipTap) is a future upgrade — *not a current dependency* | MIT |
| Maps | **Leaflet + react-leaflet** with OpenStreetMap tiles (free, no API key) — *wired on the project-detail page (per-project lat/lng) and the contact page (office location via env)* | BSD-2-Clause |
| Media storage | Upload to **local disk / Docker volume**, processed with **sharp**; lead-magnet PDF + gallery uploads (SeaweedFS / object-storage tier later) | Apache-2.0 |
| Testing | **Vitest**, **React Testing Library**, **Playwright** (E2E, Phase 2) | MIT / Apache-2.0 |
| Lint / format | **Biome** (or ESLint + Prettier) | permissive |
| SEO | Next.js Metadata API, **next-sitemap**, schema.org JSON-LD | MIT |
| Deployment | **Docker Compose** (self-host / VPS / Coolify) | Apache-2.0 |

> **Database rule:** keep the **same engine in local and cloud** (SQLite ↔ Turso, or Postgres ↔ Neon) to avoid SQL-dialect drift. Prisma abstracts the swap down to mostly a connection-string/adapter change.

---

## Development Methodology

> **Current mode (v4): Vibe Coding** — AI-assisted, ship-first. The priority is working software and visible progress, not test-first coverage. TDD is now **opt-in**, to be activated when handing off to a professional dev team.

**In vibe-coding mode:**
- Write code directly — no failing-test-first requirement.
- Iterate on UI/UX through live feedback rather than spec-driven cycles.
- Security-critical paths (auth, role checks, single-Owner invariant) should still be **manually verified** before any real data is stored.
- Vitest + React Testing Library remain installed and usable; existing tests are kept, just not required for every change.

**Switching to strict TDD (when needed):** Red → Green → Refactor, no production code without a failing test first, `prj.md` as the source of truth, and 100% branch coverage for security-critical logic in `src/lib/roles.ts`. See Section 6 of [prj.md](prj.md) for the full methodology and how to activate it.

---

## Project Structure

A single Next.js App Router app (frontend + API routes together), with Prisma, co-located tests, and Docker self-hosting.

```text
GhatsArcade/
├─ README.md
├─ prj.md                        # canonical spec (source of truth)
├─ CONTRIBUTING.md               # workflow + quality gate
├─ SECURITY.md                   # vulnerability reporting policy
├─ CHANGELOG.md
├─ LICENSE                       # proprietary / all rights reserved
├─ package.json
├─ next.config.mjs
├─ tsconfig.json
├─ biome.json                    # lint + format config
├─ .editorconfig · .gitattributes · .nvmrc
├─ .env.example                  # DB, auth, WhatsApp, site URL, UPLOAD_* media settings
├─ .gitignore · .dockerignore
├─ docker-compose.yml            # Next.js app + SQLite volume + /app/public/uploads media volume
├─ Dockerfile
├─ vitest.config.ts
├─ next-sitemap.config.js
│
├─ .github/                      # CI, Dependabot, CODEOWNERS, PR template
├─ .vscode/                      # recommended extensions + Biome-on-save
│
├─ prisma/
│  ├─ schema.prisma              # User, Project, Plot, Listing, Lead, BlogPost, Event, Testimonial, HorticultureLog, LeadMagnetAsset, FollowUpNote
│  ├─ migrations/
│  └─ seed.ts                    # seeds the single OWNER account
│
├─ public/
│  ├─ uploads/                   # >>> ADMIN-UPLOADED MEDIA (gitignored), one folder per content type:
│  │  ├─ projects/               #     cover photos, galleries, project videos
│  │  ├─ listings/               #     listing photos
│  │  ├─ blog/                   #     blog cover/inline images
│  │  ├─ events/ · testimonials/ #     event & testimonial media
│  │  ├─ lead-magnets/           #     gated PDFs
│  │  ├─ misc/                   #     uncategorised fallback
│  │  └─ .gitkeep
│  ├─ robots.txt · favicon.ico
│
├─ src/
│  ├─ app/
│  │  ├─ (public)/               # public marketing site — NO login surface anywhere
│  │  │  ├─ layout.tsx           # SiteHeader + SiteFooter chrome
│  │  │  ├─ page.tsx             # Home — full 14-block sequence + 3 lead-capture moments
│  │  │  ├─ projects/            # list + [slug] detail (plots-remaining, gallery, disclaimers)
│  │  │  ├─ listings/            # list + [slug] detail
│  │  │  ├─ blog/                # list + [slug]
│  │  │  ├─ events/              # list (upcoming + past) + [slug] detail
│  │  │  ├─ farmland-real-or-hype/ # myth-busting hub (CMS category myth_busting)
│  │  │  ├─ farming-guides/      # knowledge-base hub (CMS category farming_guides)
│  │  │  ├─ resources/page.tsx   # "Free Guides" — lead-magnet gated downloads
│  │  │  ├─ what-is-managed-farmland/ · why-invest/ · who-should-buy/ # education pages
│  │  │  ├─ what-managed-means/ · legal-checklist/ · resale/ # education pages
│  │  │  ├─ horticulture/ · in-and-around/ # region pages
│  │  │  ├─ gallery/page.tsx     # tag-filtered photo gallery (project + event photos)
│  │  │  ├─ faq/page.tsx         # 12-question FAQ (FAQPage JSON-LD)
│  │  │  ├─ about/ · contact/    # contact has the site-visit + message forms (#site-visit anchor)
│  │  │
│  │  ├─ admin/                  # the dark "Control Room" — separate from the public site
│  │  │  ├─ page.tsx             # /admin → redirect to dashboard
│  │  │  ├─ login/page.tsx       # standalone staff sign-in
│  │  │  └─ (dashboard)/         # session/role-guarded group (sidebar shell)
│  │  │     ├─ layout.tsx        # guard + AdminNav + sign-out
│  │  │     ├─ dashboard/        # overview: live metrics + latest leads
│  │  │     ├─ projects/         # list + [id] details/media/plots editor
│  │  │     ├─ horticulture/     # internal plantation/maintenance/harvest log
│  │  │     ├─ listings/ · leads/ · blog/ · events/ · testimonials/ · lead-magnets/
│  │  │     ├─ media/           # Media Library: browse/reuse/delete every asset
│  │  │     ├─ admins/           # Owner-only: add/remove admins
│  │  │     └─ export/           # Owner-only CSV export
│  │  │
│  │  ├─ api/
│  │  │  ├─ auth/[...all]/       # Better Auth
│  │  │  ├─ uploads/             # auth-gated media upload (sharp/PDF/video → public/uploads)
│  │  │  ├─ projects/ · plots/   # CRUD (public GET, gated writes)
│  │  │  ├─ listings/ · blog/ · events/ · testimonials/
│  │  │  ├─ horticulture-logs/   # auth GET + gated writes (internal log)
│  │  │  ├─ leads/               # public POST capture + admin status/notes
│  │  │  ├─ media/               # auth-gated list + delete of stored assets
│  │  │  ├─ lead-magnets/        # admin CRUD + public [id]/download (gated capture)
│  │  │  ├─ admins/ · export/    # Owner-only
│  │  │
│  │  ├─ sitemap.ts · layout.tsx · globals.css
│  │
│  ├─ components/
│  │  ├─ public/                 # Hero/cards, forms (Inquiry, PlotHold, SiteVisit, LeadMagnetGate), disclaimers, WhatsApp
│  │  ├─ admin/                  # managers (Project/Plot/Listing/Blog/Lead/LeadMagnet/Horticulture/Admin),
│  │  │                          #   AdminNav, ProjectEditor, MediaUploader, GalleryUploader
│  │  └─ seo/                    # JsonLd
│  │
│  ├─ lib/
│  │  ├─ roles.ts (+test)        # SECURITY-CRITICAL pure permissions module
│  │  ├─ env.ts                  # typed, validated env vars (zod), incl. UPLOAD_* settings
│  │  ├─ uploads.ts              # sharp image pipeline + PDF/video storage + UPLOAD_CATEGORIES
│  │  ├─ sanitize.ts             # sanitize-html for rich-text on write
│  │  ├─ auth.ts · auth-client.ts · db.ts · errors.ts
│  │  ├─ csv.ts · seo.ts · slug.ts · format.ts · whatsapp.ts
│  │  ├─ *-status.ts             # pure status rules: listing/project/plot/lead/blog
│  │  └─ validation/             # zod schemas for forms/inputs/uploads
│  │
│  ├─ server/                    # service layer (role checks enforced here)
│  │  ├─ projects.ts · listings.ts · leads.ts · blog.ts · events.ts · testimonials.ts
│  │  ├─ horticulture.ts         # internal activity-log CRUD (project:manage)
│  │  ├─ lead-magnets.ts · export.ts · admins.ts · admin-rules.ts
│  │  ├─ users.ts · session.ts
│  │
│  └─ types/                     # shared TS enums/unions (single source of truth)
│
│  # Unit / component / integration tests are CO-LOCATED with source as *.test.ts(x)
│
├─ tests/
│  ├─ helpers/                   # db reset + factories for integration tests
│  ├─ regression/ · e2e/         # cross-cutting + Playwright (Phase 2)
│  └─ reports/                   # generated reports (gitignored)
│
└─ docs/
   └─ ERD.md                     # data model / ERD
```

Key conventions:
- The `(public)` route group is server-rendered for SEO and contains **no login or admin link** — staff reach the admin area directly at `/admin`.
- The admin **"Control Room"** is a separate `admin/(dashboard)` route group with its own dark, sidebar shell — deliberately unlike the public marketing site.
- `app/` is kept **thin** (routing only) — pages compose UI and delegate logic to `src/lib` / `src/server`.
- Permissions live **only** in `src/lib/roles.ts` as a pure, independently tested module — never inline in UI.
- All write APIs go through `src/server/*` so role checks and the single-Owner invariant are enforced server-side.
- Environment variables are validated once in `src/lib/env.ts` (zod) and read from there, never via raw `process.env`.
- **Tests:** co-located with their source as `*.test.ts(x)`; `tests/` holds only cross-cutting suites + integration `helpers/`.

> Architecture note: this uses a **layer-based** structure (`lib` / `server` / `components`) rather than full feature-sliced (`src/features/*`). For a solo-operator app of this size that is the simpler, lower-overhead choice. If the domain grows substantially, migrating to feature folders is a natural next step.

### Media & asset uploads (non-developer admins)

Uploading photos, project videos, and PDFs is a **first-class, UI-only task** — a non-technical Owner/Admin never touches the filesystem, Git, or a CLI:

1. Sign in at `/admin`, open the relevant manager (e.g. a Project, or **Lead Magnets**).
2. Use the **drag-and-drop / file-picker** (`MediaUploader` for single files, `GalleryUploader` for multi-image galleries with alt text + tags + reordering).
3. On upload the file is sent to `POST /api/uploads`, which (server-side) **optimises images to WebP with `sharp`** (auto-orients, strips EXIF, caps dimensions), validates PDFs/videos against an allowlist + size caps, and stores the file. The form receives back a URL and saves it with the record.

**Where assets live (the optimised structure):** every upload is filed into a **named category folder** under `UPLOAD_DIR` (default `public/uploads`), never a flat dump:

```text
public/uploads/
├─ projects/        # project cover photos, galleries, videos
├─ listings/        # listing photos
├─ blog/            # blog images
├─ events/          # event media
├─ testimonials/    # testimonial media
├─ lead-magnets/    # gated PDFs
└─ misc/            # fallback for anything uncategorised
```

The category allowlist is defined once in `src/lib/uploads.ts` (`UPLOAD_CATEGORIES`); the API rejects/falls back any value outside it. This keeps the media library **browsable and back-up-friendly** (e.g. snapshot just `projects/`), and maps cleanly onto a single mounted volume in production (`/app/public/uploads`). Swapping to object storage (S3/R2/SeaweedFS) later means changing only `src/lib/uploads.ts`, not any caller.

**Media Library (`/admin/media`).** Beyond the inline uploaders on each form, the Control Room has a dedicated **Media Library** page that lists every stored asset across all category folders. Admins can filter by category, copy a public URL to reuse an existing asset, open it in a new tab, delete what's stale, and upload new files inline (pick a category, then choose a file). It's backed by the server-only `src/server/media.ts` (`listMedia`/`deleteMedia`, both hardened against path traversal) and an auth-gated `GET`/`DELETE /api/media`.

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

# Contact-page map (optional — set both lat & lng to show it; address line is optional)
NEXT_PUBLIC_OFFICE_LAT="10.7867"
NEXT_PUBLIC_OFFICE_LNG="76.6548"
NEXT_PUBLIC_OFFICE_ADDRESS="<office address line>"

# Media uploads (optional — these are the defaults)
# Where uploaded photos/PDFs/videos are written. Served as static files under /uploads.
# In Docker/production, mount a persistent volume at this path.
UPLOAD_DIR="public/uploads"
UPLOAD_PUBLIC_BASE="/uploads"
MAX_IMAGE_UPLOAD_MB="15"
MAX_PDF_UPLOAD_MB="25"
MAX_VIDEO_UPLOAD_MB="200"
```

> **Admin is private and separate.** The public website has no login link or auth surface.
> Staff reach the admin "Control Room" directly at `/admin` (a dark, sidebar UI distinct from
> the marketing site). Media uploads are accepted only from authenticated Owner/Admin users
> via `POST /api/uploads`; images are optimised to WebP with `sharp`, PDFs/videos are stored
> behind an allowlist. For Docker, mount a volume at `/app/public/uploads` so uploads persist.

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
| Create/edit/delete projects & plots | Yes | Yes |
| Create/edit/delete blog posts | Yes | Yes |
| Create/edit/delete events | Yes | Yes |
| Create/edit/delete testimonials | Yes | Yes |
| Create/edit/delete lead magnets | Yes | Yes |
| Create/edit/delete horticulture logs *(under `project:manage`)* | Yes | Yes |
| View leads / CRM | Yes | Yes |
| Update lead status, add follow-up notes | Yes | Yes |
| Add a new Admin account | Yes | No |
| Delete an Admin account | Yes | No |
| Export any data (leads, listings, projects, events CSV) | Yes | No |
| Promote/demote the Owner role | No (impossible by design) | No |
| Delete the Owner account | No (impossible by design) | No |
| Duplicate/create a second Owner | No (impossible by design) | No |

**Hard invariant:** there must always be **exactly one** Owner account. No code path may demote, delete, or duplicate the Owner. This is security-critical and implemented as a pure, independently tested module with 100% branch coverage.

**Fail-closed rule:** any undefined/unknown role is denied all permissions by default (explicit test case required).

---

## Data Model

Full v4 model (see [prj.md](prj.md) Section 8 and the ERD in [docs/ERD.md](docs/ERD.md); authoritative schema is [prisma/schema.prisma](prisma/schema.prisma)):

- **User** — `id, name, email, role (OWNER | ADMIN), is_active, ...`
- **Project** *(parent land parcel → many Plots)* — `id, title, slug, tagline, theme, description (rich text), location_*, latitude?, longitude?, kerala_tn_border, location_distances (JSON), total_area_acres, land_revenue_classification (nilam | purayidam | converted), road_status/spec, clubhouse/water/plantation descriptions, maintenance_fee_*, common_asset_handover_status, road_handover_to_panchayat_status, nearby_attractions (JSON), legal_checklist_summary, status (draft | published | sold_out | coming_soon), cover_photo_url, video_embed_url, photos[], created_by, ...`
- **Plot** *(sub-unit of a Project)* — `id, project_id, plot_number, size_cents, price_per_cent, total_price, position_notes, status (available | reserved | sold)`
- **Listing** *(standalone)* — `id, title, slug, description, district, nearest_town, kerala_tn_border, land_type, land_revenue_classification, size_acres, price, status (draft | published | under_offer | sold), photos[], created_by, ...`
- **Lead** — `id, name, email, phone, whatsapp, buyer_type (resident_indian | nri | oci | foreign_citizen), lead_type (inquiry | site_visit_request | callback | lead_magnet_download), message, status (new | contacted | site_visit_scheduled | negotiating | converted | lost), is_cofarmer, preferred_date, project_interest, plot_interest, source_page, source_listing?, source_project?, source_blog_post?, follow_up_notes[], ...`
- **BlogPost** — `id, title, slug, body (plain text, line breaks preserved on render), cover_image, category (legal_guides | investment | lifestyle | plantation_farming | location_spotlight | nri_corner | community_stories | myth_busting | farming_guides), meta_title, meta_description, og_image_url, estimated_read_minutes, status (draft | published), author, published_at, ...`
- **Event** — `id, title, slug, description (rich text), event_date, theme, status (upcoming | past), project_id?, photos[], created_by, ...`
- **Testimonial** — `id, buyer_name, buyer_city, buyer_type (resident_indian | nri | oci), quote_text, video_url?, display_order, is_active, project_id?, created_by, ...`
- **HorticultureLog** — `id, project_id, plot_id?, activity_type (plantation | maintenance | harvest | irrigation | pest_control), description, activity_date, logged_by, ...`
- **LeadMagnetAsset** — `id, title, file_url, download_count, is_active, created_by, ...`
- **FollowUpNote** *(sub-entity of Lead)* — `id, lead_id, author, note_text, contact_method (whatsapp | call | email | in_person | site_visit), created_at`

> SQLite has no native enums/arrays, so statuses are `String` (validated by Zod + `src/lib/roles.ts`), photo lists are relation tables (`ProjectPhoto`, `ListingPhoto`, `EventPhoto`), and `location_distances`/`nearby_attractions` use Prisma's `Json` scalar (SQLite support requires Prisma ≥ 6.2).

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

- **WYSIWYG rich-text editor** (e.g. TipTap) to replace the raw-HTML textarea for project/event descriptions
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
