# prj.md — Ghats Arcade

---

## 1. Project Overview

**Name:** Ghats Arcade
**Tagline:** "Tranquility meets high-yields"

**Purpose:** A marketing and lead-generation website for a managed farmland business that lists agricultural land properties (primarily in Kerala, also Kerala–Tamil Nadu border areas) for sale/investment, targeted at:
- Buyers from metro cities in India
- NRIs (Non-Resident Indians) in Europe, Gulf, and the US
- Foreign citizens / OCI cardholders interested in Indian agri-land investment

The site's job is to showcase listings attractively, rank well in search engines via fresh content (blog/CMS), capture visitor/lead information, and feed that data into a CRM-style admin panel so the business owner can follow up and convert deals — including via direct WhatsApp contact.

**This is not an e-commerce/transactional property marketplace.** No online payments, escrow, or legal title transfer happens on the site. It is a lead-generation and content marketing platform with an admin backend for managing listings, leads, and follow-ups.

---

## 2. Target Users

| Segment | Description | Primary Need |
|---|---|---|
| Metro India buyers | Investors in Bangalore, Mumbai, Delhi, Chennai, etc. seeking land/farm investment or weekend retreat | Browse listings, compare, inquire, schedule visits |
| NRIs (Europe, Gulf, US) | Diaspora Indians seeking land investment, often with Kerala/TN roots | Remote browsing, WhatsApp/video contact, eligibility clarity |
| Foreign citizens / OCI | Smaller segment, same general need as NRIs | Same as above, with extra legal-eligibility caution |
| Site Owner (Super Admin) | Business owner running Ghats Arcade | Manage listings, leads, admins, content, exports |
| Admin(s) | Future hires/agents (not at launch — solo for now) | Manage listings/leads day to day, no destructive/export rights |

---

## 3. Core Features (In Scope)

### Public-facing website
- Home page: hero, value proposition ("Tranquility meets high-yields"), featured listings, trust signals
- Listings page: browse/filter agri-land properties (location, size, price range, land type)
- Listing detail page: photos, description, location/map, price, land classification (agricultural/converted), buyer-eligibility disclaimer, inquiry form, WhatsApp click-to-chat button
- About page: company story, team, why Kerala/TN border region
- Contact page: phone, email, WhatsApp, physical address (if any), office hours, embedded map
- Blog/CMS section: articles for SEO (land investment guides, region spotlights, legal FAQs, etc.), admin-publishable
- Legal disclaimer: prominent, persistent (footer + listing pages + inquiry form), covering NRI/FEMA eligibility caveat
- Lead capture: inquiry forms on listings, contact page, and a general "request a callback" form
- WhatsApp integration: `wa.me` click-to-chat links with pre-filled message context (e.g., listing name)
- SEO fundamentals: meta tags, Open Graph tags (for social sharing), sitemap.xml, robots.txt, semantic HTML, fast page loads, structured data (schema.org RealEstateListing/Article where applicable)

### Admin / CRM backend
- Authentication: email/password login for Owner and Admins
- Role-based access:
  - **Owner (Super Admin)** — exactly one such role/account at any time. Can: create/edit/delete listings, create/edit/delete blog posts, manage leads, **add or delete Admin accounts**, **export any data (leads, listings) — export is Owner-only**, view all activity. Cannot be demoted, deleted, or duplicated through any code path (see Section 9, Permissions Matrix).
  - **Admin** — Can: create/edit/delete listings, create/edit/delete blog posts, manage leads (view, update status, add follow-up notes), click-to-chat with leads. Cannot: add/delete other Admins, cannot export data, cannot access Owner-only settings.
- Listings management: CRUD for property listings (photos, details, pricing, status: Draft/Published/Under Offer/Sold)
- Lead/CRM management: view captured leads, see source (which listing/form), update lead status (New → Contacted → Negotiating → Converted/Lost), add follow-up notes, log WhatsApp/call contact attempts manually
- Data export: CSV export of leads and/or listings — **restricted to Owner role only**
- Blog/CMS management: create/edit/delete/publish blog posts, basic rich text + image upload

### Explicitly Out of Scope (Non-Goals) for this phase
- Online payments, booking deposits, or escrow
- Legal document generation, contract management, or e-signing
- Property title verification or legal due-diligence tooling
- Automated WhatsApp Business API messaging/chatbots (Phase 2 candidate — see Section 11)
- Multi-language i18n (Phase 2 candidate)
- Mobile native apps (web-responsive only at launch)
- Buyer-side accounts/logins (public visitors do not log in; only Owner/Admin log in)
- Automated drip-email/marketing-automation sequences (Phase 2 candidate; manual follow-up logging only at launch)
- Multi-tenant/multi-business support (single business: Ghats Arcade only)

---

## 4. Expected Scale

- **Launch scale:** Solo operator (the user) as Owner. A handful of listings (estimate: 5–20 properties) at launch. No Admins initially, but the role/permission system must exist and be tested from day one since Admins are expected to be added later.
- **Traffic:** Public marketing site, expect low-to-moderate initial traffic (pre-SEO-traction), scaling as content/SEO efforts mature. No specific traffic SLA at this stage.
- **Data volume:** Small at launch (low hundreds of leads expected in first phase, not high-volume transactional data).

---

## 5. Constraints

- **Budget:** Free/open-source tooling strongly preferred per standing rules. No paid/proprietary service introduced without explicit flagged approval.
- **Legal:** See Section 2 — eligibility disclaimer is a hard requirement, not optional.
- **Domain & branding:** Not yet acquired — **TBD**. Placeholder branding (name "Ghats Arcade", tagline) will be used in code/content until real assets are provided. This is a known gap to revisit before public launch.
- **Deployment:** Self-hostable via Docker, or free tiers (Render/Vercel-equivalent open options) — per standing tech rules.
- **Timeline:** No hard deadline specified by user yet.
- **Team:** Solo developer/operator at launch — development pace and complexity should reflect that (avoid over-engineering for a team that doesn't exist yet).

---

## 6. Development Methodology — Test-Driven Development (TDD)

**This project follows strict Test-Driven Development. This methodology is fixed and is independent of the chosen tech stack (Section 7), which is provisional and may change.**

### The Red → Green → Refactor cycle is mandatory
1. **RED** — Before writing any production code, translate the relevant prj.md requirement(s) into one or more *failing* automated tests. Every test must be observed failing for the right reason first.
2. **GREEN** — Write the *minimum* production code required to make the failing test(s) pass. No code is written that is not driven by a currently-failing test.
3. **REFACTOR** — With all tests green, improve the design/structure. Tests must stay green throughout.

### Hard rules
- **No production code without a failing test first.** A feature's first commit/change is always its test(s), not its implementation.
- **prj.md is the source of truth for tests.** Each feature begins by deriving a concrete test list from its prj.md requirement(s) (functional behavior, roles/permissions, validation, edge cases, fail-closed defaults).
- **Ambiguity resolution:** If a requirement is unclear, clarify it and encode the agreed behavior as a test before implementing.
- **Definition of Done:** A feature may only be marked **Done** in Section 10 when its full derived test suite passes. **In Progress** must explicitly state which sub-tasks have tests written/passing vs. not.
- **Coverage:** Security-critical logic (roles/permissions, the single-Owner invariant, the fail-closed default — see Section 9) requires **100% branch coverage** and lives in pure, independently testable modules (e.g., `lib/roles.ts`) with co-located tests, never inline in UI only.

### Test layers (write at the lowest sufficient layer first)
| Layer | Scope | When | Location |
|---|---|---|---|
| Unit | Pure logic (roles, validation, CSV serialization, WhatsApp link builder, SEO helpers) | Always, first; every commit | Co-located (`*.test.ts`) |
| Component | UI components and their behavior/states | For each component; every commit | Co-located (`*.test.tsx`) |
| Integration | API routes / server services + DB interactions | For each endpoint/flow; every commit | Co-located (`*.test.ts`) |
| Regression | Cross-cutting suites guarding against re-introduced bugs | **On demand** (e.g., pre-release), not every commit | `tests/regression/` |
| E2E | Full user journeys across the app | Phase 2 (deferred — see Section 11) | `tests/e2e/` |

**Test layout:** unit/component/integration tests are **co-located** with their source (`*.test.ts(x)`) and run on every commit/CI. The top-level `tests/` folder holds only cross-cutting suites — `regression/` (run on demand) and `e2e/` (Phase 2) — plus generated **reports** in `tests/reports/` (produced on demand; gitignored).

### Workflow per feature
`Read prj.md requirement → derive test list → write failing tests (RED) → implement minimum code (GREEN) → refactor (still GREEN) → update Section 10 status`

---

## 7. Tech Stack

**NOTE: The tech stack below is PROVISIONAL and NOT final. It may be revised. The strict TDD methodology in Section 6 applies regardless of which tools are ultimately chosen.**

| Layer | Choice | Reasoning |
|---|---|---|
| Frontend | **Next.js (React)** | Server-side rendering + static generation is important for SEO (a core project goal) and social-share previews (Open Graph), which plain client-rendered React/Vite handles poorly. Next.js's file-based routing and built-in image optimization also suit a content+listings site well. Open-source, free. |
| Backend | **Next.js API routes** (Node.js), no separate Express service initially | Keeps a solo developer's surface area small — one deployable app instead of two. Revisit as a separate FastAPI/Express service only if backend complexity grows (e.g., heavy CRM logic later). Documented here explicitly so this isn't a silent stack change later. |
| Database | **Primary (lightweight path): SQLite** (public domain) locally as a single file / in-memory for tests, with **Turso / libSQL** (MIT) as the same-engine cloud copy (free tier, commercial use allowed). **Scale-up path (documented): PostgreSQL** (PostgreSQL License) via Neon/Supabase free tier. | Data is relational (lead → listing, admin → role, follow-up note → lead), so a SQL engine — not document storage — fits. SQLite is the lightest option, runs identically locally and in the cloud via Turso/libSQL, and its in-memory mode gives fast, isolated databases per test (ideal for the strict TDD workflow in Section 6). Switch to PostgreSQL if concurrency, complex queries, or full-text/geo search outgrow SQLite. **Keep the same engine in local and cloud** (no SQLite-local + Postgres-cloud mixing) to avoid SQL dialect drift. |
| ORM | **Prisma** (Apache-2.0; Drizzle, Apache-2.0, is an acceptable alternative) | Type-safe queries, migrations, and schema-as-code; integrates well with Next.js. Abstracts the SQLite ↔ Postgres swap down to mostly a connection-string/adapter change, so the scale-up path stays low-friction. |
| Auth | **Better Auth** (MIT) | TypeScript-first, framework-agnostic, owns your database (email/password + role/session support maps directly to the Owner/Admin model). Replaces Lucia, which was **deprecated in March 2025** and is no longer a maintained library. Auth.js/NextAuth (ISC) is the fallback only if many OAuth/SSO providers are needed later. |
| Image/Media storage | **Local disk / Docker volume at launch**; if scale grows, use **SeaweedFS** (Apache-2.0) or a free object-storage tier (e.g., Cloudflare R2 / Supabase Storage). **Do NOT build on self-hosted MinIO — it is AGPL-3.0** (network copyleft) and conflicts with the License Policy below. | Avoids introducing a paid cloud storage dependency at launch; the scale-up option is kept permissively licensed so it never threatens keeping the application code private. |
| Blog/CMS | **Built into the Next.js app** (custom, not a separate headless CMS) | Given solo-operator scale and the need for tight integration with SEO metadata/sitemap, a custom lightweight CMS module avoids adding another paid/complex service (e.g., Contentful). Revisit if content team grows. |
| WhatsApp | **`wa.me` click-to-chat links** (no API) at launch | Free, zero setup, no Meta Business verification delay — appropriate for solo operator with low-to-moderate lead volume. WhatsApp Business API (open-source gateway, e.g., Baileys or official Cloud API free tier) documented as a **Phase 2** option once lead volume justifies automation (see Section 11). |
| Testing | **Vitest** (unit/logic), **React Testing Library** (components), **Playwright** (E2E, Phase 2+) | Per standing test stack rules; fast, native ESM, integrates cleanly with Next.js. |
| Deployment | **Docker Compose** (self-hostable: Next.js app + SQLite volume, or a Postgres service on the scale-up path), with self-host on a low-cost VPS or **Coolify** (Apache-2.0) as the primary option. Free cloud tiers (e.g., Render) are documented alternatives — but **note Vercel's free Hobby tier prohibits commercial use**, and Ghats Arcade is commercial, so Hobby is not an option. | Matches the "free wherever possible" requirement; Docker keeps the app fully self-hostable with no vendor lock-in. Truly-free-and-commercial hosting is limited, so a low-cost VPS (a few USD/month) is the realistic baseline. |
| SEO tooling | **next-sitemap**, **next-seo**, schema.org JSON-LD (hand-rolled) | Open-source, directly supports the project's core SEO goal. |

**No paid/proprietary service is included in this stack.** If any future feature requires one (e.g., a paid email-sending service for transactional confirmation emails, or a paid map API beyond free tiers), it will be explicitly flagged for approval before integration.

### License Policy

The final application code is intended to remain **private/proprietary** (not shared after development). Technologies must be free but need not be strictly open-source. To protect the ability to keep the code closed:

- **Prefer permissive licenses:** MIT, Apache-2.0, BSD, ISC, PostgreSQL License. These impose no source-disclosure obligation.
- **Avoid building on / modifying AGPL or SSPL software** (network/service copyleft) — e.g., self-hosted MinIO (AGPL-3.0), MongoDB server (SSPL). Using such software as an unmodified external service may be acceptable, but it must never be a dependency the app is built on or links into.
- **Plain GPL/LGPL** is avoided by default to keep licensing simple, even though a non-distributed hosted app typically would not trigger disclosure.
- **Verify the license of every new dependency before adoption.** If a desired tool is copyleft or otherwise restrictive, it must be explicitly flagged for approval before integration.

---

## 8. Data Model (initial draft — will expand as features are built)

### User (Owner/Admin accounts)
- id, name, email, password_hash, role (`OWNER` | `ADMIN`), created_at, is_active

### Listing
- id, title, slug, description, location (district, nearest town, Kerala/TN border flag), land_type (`agricultural` | `converted_non_agricultural`), size_acres, price, status (`draft` | `published` | `under_offer` | `sold`), photos[], created_by (User), created_at, updated_at

### Lead
- id, name, email, phone (with country code), buyer_type (`resident_indian` | `nri` | `oci` | `foreign_citizen`), source_listing (nullable FK to Listing), message, status (`new` | `contacted` | `negotiating` | `converted` | `lost`), follow_up_notes[], created_at, updated_at

### BlogPost
- id, title, slug, body, cover_image, status (`draft` | `published`), author (User FK), published_at, created_at, updated_at

### FollowUpNote (sub-entity of Lead)
- id, lead_id (FK), author (User FK), note_text, contact_method (`whatsapp` | `call` | `email` | `in_person`), created_at

*(This will be formalized into a proper schema/ERD with exact types once development begins, and updated here per Section 11 rules as it evolves.)*

---

## 9. Roles & Permissions Matrix

| Action | Owner (Super Admin) | Admin |
|---|---|---|
| Log in to admin panel | ✅ | ✅ |
| Create/edit/delete listings | ✅ | ✅ |
| Create/edit/delete blog posts | ✅ | ✅ |
| View leads / CRM | ✅ | ✅ |
| Update lead status, add follow-up notes | ✅ | ✅ |
| **Add a new Admin account** | ✅ | ❌ |
| **Delete an Admin account** | ✅ | ❌ |
| **Export any data (leads, listings, CSV/etc.)** | ✅ | ❌ |
| Promote/demote the Owner role | ❌ (not possible through any code path) | ❌ |
| Delete the Owner account | ❌ (not possible through any code path) | ❌ |
| Duplicate/create a second Owner | ❌ (not possible through any code path) | ❌ |

**Hard invariant:** There must always be **exactly one** Owner account in the system. No code path may demote, delete, or duplicate the Owner role. This is security-critical logic, requires 100% branch coverage per the standing test rules, and will be implemented as a pure, extractable, independently tested module (e.g., `lib/roles.ts` + co-located tests) — never embedded only inline in a UI component.

**Fail-closed rule:** Any undefined/unknown role must be denied all permissions by default (explicit test case required).

---

## 10. Feature Status

| Feature | Status | Tests |
|---|---|---|
| prj.md drafted | Done | N/A |
| Project scaffolding (Next.js + Prisma + tooling) | In Progress | Structure + configs created; deps not yet installed/built (no `pnpm install` run) |
| Repo hygiene (CI, Dependabot, CONTRIBUTING, SECURITY, LICENSE, editor configs) | Done | N/A |
| Roles/permissions module (`src/lib/roles.ts`) | In Progress | Tests written (`roles.test.ts`: Owner/Admin, fail-closed, single-Owner invariant); pending first run/CI to confirm green + 100% branch coverage |
| Typed env validation (`src/lib/env.ts`) | In Progress | Implemented (zod); tests not yet written |
| Auth (Owner/Admin login) | In Progress | Better Auth email/password + admin plugin, client (`auth-client.ts`), server session/role guards (`server/session.ts`), `/admin/login` form, and guarded `admin/(dashboard)` layout implemented; `session.test.ts` written; pending verified green run |
| Admin management (Owner-only add/remove) | In Progress | Pure guard rules (`server/admin-rules.ts`) + service (`server/admins.ts`) + Owner-only API routes + Owner-only UI; unit tests (`admin-rules.test.ts`) and DB integration tests (`admins.integration.test.ts`) written; pending verified green run |
| Listing CRUD | In Progress | Service (`server/listings.ts`: gated CRUD, auto-slug, status transitions, public visibility + filters), API (`/api/listings` + `/api/listings/[id]`), public browse + detail pages, admin `ListingManager`. Pure tests (`slug`, `listing-status`, `validation`, `format`, `ListingCard`) + `listings.integration.test.ts` written; pending verified green run. Photos are URL-only (no upload yet) |
| Lead capture + CRM | In Progress | Service (`server/leads.ts`: open capture w/ source-listing resolution, gated list/get, status pipeline, follow-up notes), pure `lib/lead-status.ts`, API (`/api/leads`, `/api/leads/[id]`, `/api/leads/[id]/notes`), public `LeadInquiryForm` (honeypot) on listing detail + contact, admin `LeadManager`. Unit tests (`lead-status`, `lead-validation`) + `leads.integration.test.ts` written; pending verified green run |
| Blog/CMS module | In Progress | Pure `lib/blog-status.ts` (visibility + `resolvePublishedAt` lifecycle), validation (`createBlogPostSchema`/`updateBlogPostSchema`), service (`server/blog.ts`: gated CRUD, auto-slug, publish/unpublish handling, published-only public reads), API (`/api/blog` + `/api/blog/[id]`), public blog list + post pages (Article JSON-LD, metadata, sitemap slugs), admin `BlogManager`. Unit tests (`blog-status`, `blog-validation`) + `blog.integration.test.ts` written; pending verified green run. Body is plain text (no markdown yet) |
| WhatsApp click-to-chat | In Progress | Link builder (`src/lib/whatsapp.ts`) + tests written; `WhatsAppButton` component stub. Pending first run/CI |
| SEO (sitemap, meta, schema.org) | In Progress | `seo.ts` implemented (absoluteUrl, RealEstateListing/BlogPosting/Organization/WebSite JSON-LD, `buildSitemapEntries`) + `seo.test.ts`; `JsonLd` component + test; dynamic `sitemap.ts` (published listing slugs); `generateMetadata` + JSON-LD on listing detail; org/website JSON-LD on home; static metadata + canonicals on about/contact/listings/blog. Pending verified green run |
| Public site shell + polish | In Progress | `(public)/layout.tsx` with `SiteHeader`/`SiteFooter`, calm green/earth Tailwind theme, home hero + featured listings + trust signals, About content, styled cards/forms. `SiteHeader.test.tsx` written; pending verified run |
| Data export (Owner-only) | In Progress | Pure RFC-4180 `csv.ts` (`toCsv`) + `csv.test.ts`; Owner-gated `server/export.ts` (`exportCsv` for leads/listings, fixed columns) + `export.integration.test.ts`; `/api/export` (text/csv + attachment, 401/400/403); guarded `admin/(dashboard)/export` page. Pending verified green run |
| Legal disclaimer component | In Progress | `LegalDisclaimer` rendered in the public `SiteFooter` (moved out of the root layout so it no longer shows in the admin area); tests not yet written |

*(Per the strict TDD methodology in Section 6: every feature starts with failing tests derived from this prj.md, then implementation. No feature may be marked "Done" without its full derived test suite passing — and "passing" means actually executed (locally / in CI), not merely written. "In Progress" notes which sub-tasks have tests written/passing vs. not yet. Scaffolding is "In Progress" until `pnpm install` + a green `pnpm test:run` and build have been verified.)*

---

## 11. Phase 2 / Future Considerations (not in scope now, noted for later)

- WhatsApp Business API (open-source gateway or official Cloud API free tier) for templated/automated follow-ups, once lead volume justifies it
- Automated email drip sequences for lead nurturing
- Multi-language support (Malayalam, Tamil, Hindi, Arabic for Gulf NRIs)
- Multiple Admins / regional agents with possibly finer-grained permissions
- Playwright E2E test suite (explicitly deferred per standing test stack until core flows stabilize)
- Possible company/share-based investment structure for NRI buyers (pending legal advice — see Section 2)
- Permissively-licensed self-hosted object storage (e.g., SeaweedFS, Apache-2.0) or a free object-storage tier if media volume grows beyond Docker volume comfort (not MinIO — AGPL-3.0, per the Section 7 License Policy)

---
