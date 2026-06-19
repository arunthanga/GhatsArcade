# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project aims to
follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Demo video recorder** (`scripts/demo-video.mjs`, `pnpm demo:video`): drives a real browser
  through the public site page-by-page with smooth scrolling and saves a `.webm` walkthrough via
  Playwright's built-in recording. Output is gitignored under `tests/demo-video/`.
- **Embedded location maps (OpenStreetMap/Leaflet).** A reusable `LocationMap` (the client-only
  `LeafletMap` loaded via `next/dynamic` `ssr:false`, with a marker popup + "View larger map" link)
  is now rendered in two places:
  - **Project detail** — `Project` gains optional `latitude`/`longitude` columns; the map shows when
    both are set. The admin `ProjectEditor` gains lat/lng inputs, validated server-side
    (`-90..90` / `-180..180`). Requires a Prisma client regen + `db push` on the host for the new
    columns.
  - **Contact page** — shows the office location from new public env vars
    `NEXT_PUBLIC_OFFICE_LAT` / `NEXT_PUBLIC_OFFICE_LNG` (+ optional `NEXT_PUBLIC_OFFICE_ADDRESS`),
    rendered under a "Where to find us" heading. Empty values are treated as unset so the map simply
    hides.

### Removed
- Dropped the unused **TipTap** dependencies (`@tiptap/pm`, `@tiptap/react`, `@tiptap/starter-kit`).
  They were never wired; rich-text authoring remains a sanitised-HTML `<textarea>`. A WYSIWYG editor
  can be reintroduced when actually built.

### Documentation
- **Project audit & doc sync.** Reconciled `prj.md` and `README.md` with the actual code:
  TipTap (`@tiptap/*`) and Leaflet (`leaflet`/`react-leaflet`) are **installed but not yet wired**,
  so the tech-stack tables now describe rich text as "raw HTML in a `<textarea>`, sanitised
  server-side with `sanitize-html`" (blog bodies are plain text), and maps as a pending Phase-2
  enhancement. Added explicit "Embedded location maps" and "WYSIWYG rich-text editor" rows to the
  Feature Status table (Not started) and to the README roadmap. Filled in the README permissions
  table (lead magnets, horticulture logs).

### Changed
- Renamed the public blog brand to **"The Farmlands Journal"**: list page title/heading, metadata
  description, the footer navigation label, and a "← The Farmlands Journal" back link on each post.
  The `/blog` URLs and the internal admin "Blog" label are intentionally unchanged to preserve
  existing links and SEO.

### Added
- **Horticulture log** CRUD: an internal operational record of on-the-ground activity (plantation,
  maintenance, harvest, irrigation, pest control) per project and, optionally, per plot. Gated under
  the existing `project:manage` permission (logs are project sub-records). Adds
  `HORTICULTURE_ACTIVITY_TYPES`/labels, Zod create/update schemas, and `server/horticulture.ts`
  (CRUD with a project-existence check and an optional plot link resolved fail-open and scoped to its
  project). API: `GET`(auth, optional `?projectId=`)/`POST`(gated) `/api/horticulture-logs` and
  `PATCH`/`DELETE /api/horticulture-logs/[id]`. Admin `HorticultureLogManager` (table + create /
  inline-edit / delete with dependent project→plot dropdowns) on a guarded `/admin/horticulture`
  page. No public surface.
- **Resale & Exit** page (`/resale`): an explicit commitment to facilitate resale, a 5-step resale
  process, a "why land here appreciates" rationale, NRI liquidity reassurance, an honest
  no-guarantee note, and a `CallbackForm` end CTA. Added to the footer's Guidance nav, the sitemap,
  and the always-on floating-WhatsApp routes. This was the last outstanding public page.
- Testimonials CMS, end to end: a new `testimonial:manage` permission (Owner + Admin), Zod schemas,
  and a gated `server/testimonials.ts` (CRUD with plain-text quotes, an active flag, a display-order
  field, an optional YouTube video URL, and an optional project link resolved fail-open). API:
  `GET`(public)/`POST`(gated) `/api/testimonials` and `PATCH`/`DELETE /api/testimonials/[id]`. Admin
  `TestimonialManager` (list, create, inline edit, reorder, show/hide toggle) on a guarded
  `/admin/testimonials` page. Public `TestimonialCarousel` now powers home **Block 9** with real
  owner stories (prev/next + dots, optional "Watch their story" link), falling back to an invite to
  connect with an owner when none are published yet.
- Tag-filtered **Gallery** page (`/gallery`): aggregates photos from public projects (using the
  `ProjectPhoto.tag` taxonomy — land/road/water/clubhouse/plantation/landscape/aerial/seasonal/
  community) and event photos (an `events` tag) into a client-side `GalleryGrid` with filter chips,
  a lazy-loaded responsive grid, hover captions, and click-to-open. Linked from the footer's
  Explore nav and added to the sitemap.
- Context-aware floating WhatsApp button is now route-aware via `PublicWhatsAppFloat` in the public
  layout: scroll-triggered on the home page, **always-on** on project-detail and education/region
  pages, and hidden on nav/list/contact pages so it never competes with on-page forms. (The home
  page no longer renders its own copy.)
- Home page rebuilt as the full 14-block psychological sequence (prj.md Section 3.1): hero,
  time-objection reframe, 6-panel buyer-fear grid, animated social-proof counters (`StatCounters`,
  count-up on scroll), 7-discipline "Land That Comes With a Team" grid, 6-pillar holistic-living
  block, live featured-projects grid, "How to Own" 4 steps, owner video-testimonial strip
  (placeholder until the testimonials CMS lands), a Google-reviews block, a live community/events
  strip, a live blog preview, an inline FAQ, and a final CTA. Three lead-capture moments are wired:
  **Block 8** `HomeVisitForm` (name/phone/WhatsApp/project → `site_visit_request`), **Block 9**
  `FloatingWhatsAppButton` (appears on scroll), and **Block 14** full `LeadInquiryForm` plus
  click-to-call and WhatsApp CTAs. This closes out the SEO and public-site-shell tracks.
- Education + region public pages, each with a contextual CTA (prj.md Section 3.4):
  **`/what-is-managed-farmland`** (model explainer + honest "not suitable for" section + a new
  `CallbackForm` posting a `callback` lead), **`/why-invest`** (4 pillars + 14 investor profiles,
  ending in the lead-magnet PDF gate with a `/resources` fallback), **`/who-should-buy`** (6 buyer
  profiles each deep-linking to `/contact#site-visit`), **`/legal-checklist`** (due-diligence
  disclosure + reused `RegistrationSteps` + a WhatsApp document-review deep-link),
  **`/what-managed-means`** (scope/fee/handover + site-visit form), **`/horticulture`** (zone crops,
  harvest calendar, owner options), and **`/in-and-around`** (nearby destinations with drive times).
- Standalone **`/faq`** page: 12 Q&A from a shared, reusable `lib/faq-data.ts` rendered via a no-JS
  `FaqList` accordion, with schema.org **FAQPage JSON-LD** (`faqPageJsonLd`). Ready to reuse inline
  on the home page later.
- All eight new pages are in the sitemap (`STATIC_PATHS`), and the footer gained a third
  **Guidance** column linking them (plus FAQ under Learn). `WhatsAppButton` now accepts an optional
  `className`, and the contact page's site-visit form has a `#site-visit` anchor for deep-links.
- Project detail page completed: a new **"How to register — step by step"** section
  (`RegistrationSteps`: KYC → booking → payment options → sale deed → sub-registrar → ownership)
  to remove process paralysis before the final ask, plus a **mobile-only sticky CTA**
  (`StickyProjectCta`) that keeps "Book a visit" + remaining-plots in reach while scrolling. The
  mid-page `PlotHoldForm` capture and bottom inquiry form were already in place.
- Events module, end to end: a new `event:manage` permission (Owner + Admin), Zod schemas, and a
  gated `server/events.ts` (CRUD with sanitized rich-text description, an optional project link
  resolved fail-open, and a photo gallery). API: `GET`(public)/`POST`(gated) `/api/events` and
  `PATCH`/`DELETE /api/events/[id]`. Admin `EventManager` (list, create, quick status change,
  inline full edit with the `GalleryUploader` and a project-link select) on a guarded
  `/admin/events` page. Public `/events` (upcoming + past-gallery sections) and `/events/[slug]`
  detail (sanitized description, photo grid, project deep-link, site-visit CTA). Events are in the
  header + footer nav and the sitemap, and there's a new **Events** CSV export dataset (date,
  status, theme, project, photo count). Pure `lib/event-status.ts` for public-visibility rules.
- Two content hubs that build on the Blog/CMS: **"Farmland — Real or Hype?"** (`/farmland-real-or-hype`,
  category `myth_busting`) and **"Farming Guides / Knowledge Base"** (`/farming-guides`, category
  `farming_guides`). Both are server-rendered landing pages powered by a reusable `CategoryHub`
  component (hero intro + published-post grid + site-visit/free-guides CTA) and a new
  `listPublishedPostsByCategory` read. Added to the footer nav (new "Explore"/"Learn" columns) and
  the sitemap.
- Owner CSV export now includes a **Projects** dataset (`?dataset=projects`): location, land-revenue
  classification, road status, total/available plot counts, and starting price (min plot total).
  The Owner-only export page was restyled to the Control Room with one card per dataset.
- Construction disclaimer is now rendered on the **listing detail** page too (it was already on
  project detail), satisfying the prj.md requirement that it appear on every listing + project page.
- Blog/CMS module completed: posts now carry an editorial **category** (9 buckets incl.
  `myth_busting` and `farming_guides`, which back the upcoming content hubs), **SEO overrides**
  (`metaTitle`/`metaDescription`/`ogImageUrl`), and **estimated reading time**. Reading time is
  auto-estimated from the body (`src/lib/reading-time.ts`, ~200 wpm, HTML-stripped, floor of 1
  min) with an optional manual override. `BLOG_CATEGORIES` + labels added to `types`; create/update
  Zod schemas extended; `server/blog.ts` persists the fields and (re)computes read time on save.
  The admin `BlogManager` is rebuilt with a full create form **and per-post editing** of every
  field (category, SEO, cover image via the upload pipeline, read-time override). Public blog list
  and post pages show a category badge + read time and honour the SEO overrides (falling back to
  the title, an HTML-stripped excerpt, and the cover image), including JSON-LD `image`/`articleSection`.
- Media Library admin page (`/admin/media`): browse every uploaded asset across all category
  folders, filter by category, copy a public URL to reuse an asset, open it in a new tab, or
  delete it. Includes an inline uploader (pick a category, then upload). Backed by server-only
  `server/media.ts` (`listMedia`/`deleteMedia`, both path-traversal hardened) and an auth-gated
  `GET`/`DELETE /api/media`. Added a "Media Library" link to the Control Room sidebar.
- Media upload pipeline: server-only `lib/uploads.ts` stores files on local disk / a Docker
  volume (`UPLOAD_DIR`, served at `UPLOAD_PUBLIC_BASE`, default `public/uploads` → `/uploads`).
  Images are re-encoded to WebP with `sharp` (auto-orient, EXIF stripped, capped at 2000px);
  PDFs and short MP4/WebM videos are stored behind an allowlist + per-kind size caps (env
  `MAX_IMAGE/PDF/VIDEO_UPLOAD_MB`). Auth-gated `POST /api/uploads` (Node runtime, multipart).
  Assets are filed into named **category folders** (`UPLOAD_CATEGORIES`:
  `projects`/`listings`/`blog`/`events`/`testimonials`/`lead-magnets`/`misc`) so the media
  library stays browsable for non-developer admins/ops; the API falls back to `misc` for any
  value outside the allowlist. Reusable admin `MediaUploader` + `GalleryUploader` components
  (each takes a `category`), wired into the lead-magnet PDF field and a new Project
  details+media editor (cover photo, video embed/upload, tagged gallery). `public/uploads` is
  git-ignored (kept via `.gitkeep`); Docker mounts a volume at `/app/public/uploads`.
- Admin "Control Room": the admin area is now a dark, sidebar-driven shell that is visually
  distinct from the public marketing site, with an overview dashboard (live counts +
  latest leads), active-route nav, a restyled standalone login, and an `/admin` → dashboard
  redirect. The public website has no login link or auth surface anywhere — admin is reached
  directly at `/admin`. Per-project admin page gained a full details editor alongside plots.
- Lead-magnet PDF gate: `leadMagnet:manage` permission (Owner + Admin) added to `lib/roles.ts`;
  Zod schemas (`createLeadMagnetSchema`/`updateLeadMagnetSchema`/`leadMagnetDownloadSchema`);
  gated service (`server/lead-magnets.ts`) with CRUD, active-only public reads (id + title; the
  file URL stays gated), and `recordDownload` (captures a `lead_magnet_download` lead, bumps
  `downloadCount`, returns the file URL — withdrawn/inactive assets resolve to a 404).
  API: `GET`(public)/`POST`(gated) `/api/lead-magnets`, `PATCH`/`DELETE /api/lead-magnets/[id]`,
  and public `POST /api/lead-magnets/[id]/download` (honeypot-guarded). Public `LeadMagnetGate`
  component + `/resources` "Free Guides" page (in footer nav + sitemap). Owner/Admin
  `LeadMagnetManager` (create, toggle active, delete, download counts) + guarded admin page.
- Owner CSV export: the `leads` dataset now exports the v4 fields (whatsapp, lead_type,
  is_cofarmer, project_interest, plot_interest, preferred_date, source_page) and resolves the
  project and blog-post sources alongside the listing source.
- Project-aware lead capture: expanded the lead model across the app layer to match the v4
  schema — `LEAD_TYPES` (`inquiry`/`site_visit_request`/`callback`/`lead_magnet_download`),
  `site_visit_scheduled` lead status (with transitions: schedulable from `new`/`contacted`,
  then to `negotiating`/`converted`), and `site_visit` contact method. `leadInquirySchema` is
  now a shared superset (whatsapp, leadType, isCofarmer, preferredDate, projectInterest,
  plotInterest, sourcePage, sourceProject/sourceBlogPost), with `buyerType` defaulted so short
  forms validate. `captureLead` persists these and fail-open resolves listing/project/blog
  sources. New public surfaces: `PlotHoldForm` (3-field "hold a plot 48h", mid project page),
  `SiteVisitForm` (distinct `site_visit_request`), and a project/blog-aware `LeadInquiryForm`.
  Project detail now has mid-page + bottom capture and a "Schedule a Site Visit for This
  Project" deep-link that pre-fills the contact-page site-visit form. Admin `LeadManager`
  surfaces lead type, project/plot interest, preferred date, WhatsApp, and project/blog source.
- Projects & Plots module: pure rules (`lib/project-status.ts` — `draft` hidden, `published`/
  `sold_out`/`coming_soon` public, fail-closed transition graph; `lib/plot-status.ts` —
  `countAvailablePlots` drives the "X plots remaining" indicator). Server-only rich-text
  sanitiser (`lib/sanitize.ts`, sanitize-html) applied to project descriptions on write.
  `project:manage` permission (Owner + Admin) added to `lib/roles.ts`. Zod schemas
  (`createProjectSchema`/`updateProjectSchema` with `location_distances`/`nearby_attractions`
  JSON arrays, `createPlotSchema`/`updatePlotSchema`, `projectFilterSchema`). Gated service
  (`server/projects.ts`) with auto-unique slugs, status-transition guard, public reads, and
  plot CRUD (auto-computed `total_price`). API: `GET`(public)/`POST`(gated) `/api/projects`,
  `PATCH`/`DELETE /api/projects/[id]`, `POST /api/projects/[id]/plots`, `PATCH`/`DELETE
  `/api/plots/[id]`. Public projects list + project detail (plots-remaining badge, plot table,
  estate specs, distances/attractions, metadata/OG, plus the two distinct hard-requirement
  disclaimers — `ConstructionDisclaimer` + FEMA `LegalDisclaimer`); `ProjectCard`; Projects in
  public nav/footer + sitemap. Owner/Admin `ProjectManager` + per-project `PlotManager` pages.
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
