import Link from "next/link";
import { FaqList } from "@/components/public/FaqList";
import { HomeHowItWorks } from "@/components/public/HomeHowItWorks";
import { HomeVisitForm } from "@/components/public/HomeVisitForm";
import { LeadInquiryForm } from "@/components/public/LeadInquiryForm";
import { ProjectCard } from "@/components/public/ProjectCard";
import { StatCounters } from "@/components/public/StatCounters";
import { TestimonialCarousel } from "@/components/public/TestimonialCarousel";
import { TrustProofStrip } from "@/components/public/TrustProofStrip";
import { WhatsAppButton } from "@/components/public/WhatsAppButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicEnv } from "@/lib/env";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { getTranslations } from "@/lib/i18n/server";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { listPublishedPosts } from "@/server/blog";
import { listPublicEvents } from "@/server/events";
import { listPublicProjects } from "@/server/projects";
import { listActiveTestimonials } from "@/server/testimonials";
import { BLOG_CATEGORY_LABELS, type BlogCategory } from "@/types";

export const dynamic = "force-dynamic";

// --- Static block content (prj.md Section 3.1) -----------------------------

const FEARS: { fear: string; answer: string }[] = [
  {
    fear: "Unclear or disputed land titles",
    answer: "Individual freehold titles, verified by us before we ever acquire the land.",
  },
  {
    fear: "No one to manage the land in my absence",
    answer: "A resident team on-site with structured monthly maintenance.",
  },
  {
    fear: "Developers who sell and disappear",
    answer: "We live near this land. Our phone number doesn't change after you register.",
  },
  {
    fear: "Can I put a structure on it?",
    answer:
      "Some projects may include a clubhouse, and we can guide co-farmers on small farm-use structures while the legal permissions remain with the owner.",
  },
  {
    fear: "Plot sizes don't fit my budget",
    answer: "Plots from 10 to 50 cents — you choose what suits your family.",
  },
  {
    fear: "Hidden charges",
    answer: "Land price + maintenance fee + registration charges. That's it.",
  },
];

const DISCIPLINES = [
  "Agronomy",
  "Civil / Infrastructure",
  "Legal",
  "Operations",
  "Survey",
  "Customer Success",
  "Horticulture",
];

const PILLARS: { title: string; body: string }[] = [
  {
    title: "Organic living",
    body: "Grow closer to food, fruit, and produce your family can trust.",
  },
  { title: "Peaceful living", body: "Slow down and reconnect with something real." },
  {
    title: "Weekend rhythm",
    body: "Let the body follow the land's natural rhythm on visits and quiet weekends.",
  },
  { title: "Legacy", body: "A place where your family's story continues." },
  { title: "Balance", body: "The seasons set the pace; you simply keep it." },
  {
    title: "Vacation home feeling",
    body: "On the farm, every moment asks you to just be here — without pretending it is residential land.",
  },
];

const STEPS: { title: string; body: string }[] = [
  {
    title: "Behold the land",
    body: "Schedule a visit — our team walks the land with you, in person.",
  },
  {
    title: "Choose your plot",
    body: "Pick the size, position, and plantation that suit your family.",
  },
  {
    title: "Register your land",
    body: "Freehold title, no hidden charges — we walk you through every step.",
  },
  {
    title: "Enjoy for generations",
    body: "We manage it; you visit when you want; it grows while you rest.",
  },
];

const STATS = [
  { label: "Acres developed", value: 120 },
  { label: "Plots sold", value: 240 },
  { label: "Co-farmer families", value: 180 },
  { label: "Years in the region", value: 12, suffix: "+" },
];

const HERO_PROOF_POINTS = [
  "Clean-title documents reviewed before visits",
  "Managed by a resident on-ground team",
  "WhatsApp follow-up within 24 hours",
];

const QUICK_PATHS = [
  {
    href: "/projects",
    label: "Compare managed projects",
    description: "See plot availability, pricing, and project status.",
  },
  {
    href: "/listings",
    label: "Browse individual listings",
    description: "Filter by district, budget, acreage, and land type.",
  },
  {
    href: "/legal-checklist",
    label: "Check legal basics",
    description: "Understand title, land-use, and buyer-eligibility questions.",
  },
];

function excerpt(body: string, max = 120): string {
  const text = body
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z0-9#]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max).trimEnd()}…` : text;
}

function categoryLabel(category: string): string {
  return BLOG_CATEGORY_LABELS[category as BlogCategory] ?? category;
}

export default async function HomePage() {
  const [projects, posts, events, testimonials] = await Promise.all([
    listPublicProjects(),
    listPublishedPosts(),
    listPublicEvents(),
    listActiveTestimonials(),
  ]);

  const featuredProjects = projects.slice(0, 3);
  const recentPosts = posts.slice(0, 3);
  const communityEvents = events.slice(0, 3);
  const projectNames = projects.map((p) => p.title);
  const whatsappNumber = publicEnv.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const { t } = await getTranslations();

  return (
    <main>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />

      {/* Block 1 — Hero (two CTAs, no form) */}
      <section className="bg-brand-900 text-brand-50">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:py-28">
          <p className="text-sm font-medium uppercase tracking-widest text-brand-300">
            {t("home.heroEyebrow")}
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            {t("home.heroTitle")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100/85">
            {t("home.heroSubtitle")}
          </p>
          <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-3 text-sm text-brand-100">
            {HERO_PROOF_POINTS.map((point) => (
              <li
                key={point}
                className="rounded-full border border-brand-300/40 bg-brand-800/70 px-3 py-1"
              >
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact#site-visit"
              className="rounded-lg bg-brand-50 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-white"
            >
              {t("home.heroCtaVisit")}
            </Link>
            <Link
              href="/projects"
              className="rounded-lg border border-brand-200 px-6 py-3 font-medium text-brand-50 transition-colors hover:bg-brand-800"
            >
              {t("home.heroCtaProjects")}
            </Link>
          </div>
          <div className="mx-auto mt-10 grid max-w-4xl gap-3 text-left sm:grid-cols-3">
            {QUICK_PATHS.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="rounded-xl border border-brand-300/30 bg-brand-800/70 p-4 transition-colors hover:bg-brand-800"
              >
                <span className="text-sm font-semibold text-brand-50">{path.label}</span>
                <span className="mt-1 block text-sm leading-relaxed text-brand-100/80">
                  {path.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <TrustProofStrip />

      <HomeHowItWorks />

      {/* Block 2 — Reframe the time objection (poetic prose) */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-2xl font-light leading-relaxed text-brand-800 sm:text-3xl">
          We prepare the soil. We plant the crops. We water, nurture, and maintain. You arrive when
          it matters — to pluck fruit from your own trees, to watch your children run between rows
          of green, to host slow lunches under open Kerala skies, and to feel the peace of a weekend
          home rooted in real farmland.
        </p>
        <p className="mt-6 text-lg font-medium text-brand-900">
          You live the farm life. We manage the farm work.
        </p>
        <Link
          href="/what-is-managed-farmland"
          className="mt-6 inline-block text-sm font-medium text-brand-700 hover:text-brand-900"
        >
          See how it works →
        </Link>
      </section>

      {/* Block 3 — Buyer-fear reframe grid */}
      <section className="border-y border-brand-100 bg-brand-50/60">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-brand-900">
            The fears you arrive with — answered
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-brand-600">
            Clean titles, trusted developer guidance, investment security, and honest land-use
            limits are part of the conversation before any family becomes a co-farmer.
          </p>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEARS.map((item) => (
              <div key={item.fear} className="rounded-xl border border-brand-100 bg-white p-6">
                <p className="text-sm font-medium text-stone-500 line-through decoration-stone-300">
                  {item.fear}
                </p>
                <p className="mt-2 font-medium text-brand-900">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 4 — Animated social-proof counters */}
      <section className="bg-brand-900">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <StatCounters stats={STATS} />
        </div>
      </section>

      {/* Block 5 — Land that comes with a team */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-2xl font-semibold text-brand-900">
          Land that comes with a team
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-brand-600">
          You're joining a co-farming community with a full team behind your land — seven
          disciplines on every project.
        </p>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
          {DISCIPLINES.map((discipline) => (
            <div
              key={discipline}
              className="flex flex-col items-center gap-2 rounded-xl border border-brand-100 bg-white p-4 text-center"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700">
                {discipline.charAt(0)}
              </span>
              <span className="text-xs font-medium text-brand-800">{discipline}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Block 6 — Holistic living / why farmland */}
      <section className="border-y border-brand-100 bg-brand-50/60">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-brand-900">
            More than land — a way to live together
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="rounded-xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-brand-900">{pillar.title}</h3>
                <p className="mt-2 text-sm text-brand-600">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Block 7 — Featured projects grid */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold text-brand-900">Featured projects</h2>
          <Link
            href="/projects"
            className="text-sm font-medium text-brand-600 hover:text-brand-900"
          >
            View all
          </Link>
        </div>
        {featuredProjects.length === 0 ? (
          <p className="text-brand-600">New projects are coming soon — check back shortly.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Block 8 — How to own + FIRST lead capture */}
      <section className="border-y border-brand-100 bg-brand-50/60">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-2xl font-semibold text-brand-900">
            How to own your plot
          </h2>
          <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <li key={step.title} className="rounded-xl border border-brand-100 bg-white p-6">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 font-semibold text-brand-50">
                  {index + 1}
                </span>
                <h3 className="mt-3 font-semibold text-brand-900">{step.title}</h3>
                <p className="mt-1 text-sm text-brand-600">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-brand-900">
              Start with step one — come see the land
            </h3>
            <p className="mt-1 text-sm text-brand-600">
              No commitment. Just an invitation to walk the land with our team. Leave your details
              and we'll set it up.
            </p>
            <div className="mt-4">
              <HomeVisitForm projects={projectNames} />
            </div>
          </div>
        </div>
      </section>

      {/* Block 9 — Owner testimonials (SECOND capture: floating WhatsApp appears below) */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-2xl font-semibold text-brand-900">
          It's managed for you, not without you
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-center text-brand-600">
          Hear it from co-farmers themselves — families and professionals who own here and visit
          when it suits them.
        </p>
        <div className="mt-10">
          {testimonials.length > 0 ? (
            <TestimonialCarousel
              testimonials={testimonials.map((t) => ({
                id: t.id,
                quoteText: t.quoteText,
                buyerName: t.buyerName,
                buyerCity: t.buyerCity,
                buyerType: t.buyerType,
                videoUrl: t.videoUrl,
              }))}
            />
          ) : (
            <p className="mx-auto max-w-xl rounded-xl border border-brand-100 bg-brand-50 p-6 text-center text-brand-600">
              Co-farmer stories are being added. In the meantime, ask us to connect you with an
              existing co-farmer — we're happy to.
            </p>
          )}
        </div>
      </section>

      {/* Block 10 — Google reviews (third-party validation) */}
      <section className="border-y border-brand-100 bg-brand-50/60">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-2xl font-semibold text-brand-900">What co-farmers say on Google</h2>
          <p className="mt-2 text-brand-600">
            We'd rather you read unfiltered, third-party reviews than only our own words. See what
            co-farmers say about us on our Google Business profile.
          </p>
          <a
            href={publicEnv.NEXT_PUBLIC_GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-block rounded-lg border border-brand-300 px-5 py-2.5 text-sm font-medium text-brand-800 transition-colors hover:bg-white"
          >
            Read our Google reviews
          </a>
        </div>
      </section>

      {/* Block 11 — Stories from our community (events strip) */}
      {communityEvents.length > 0 ? (
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="text-2xl font-semibold text-brand-900">Stories from our community</h2>
            <Link
              href="/events"
              className="text-sm font-medium text-brand-600 hover:text-brand-900"
            >
              All events
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {communityEvents.map((event) => {
              const cover = event.photos?.[0]?.url;
              return (
                <Link
                  key={event.id}
                  href={`/events/${event.slug}`}
                  className="group overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={cover} alt={event.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="h-40 w-full bg-brand-100" />
                  )}
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wide text-brand-500">
                      {event.status === "upcoming" ? "Upcoming" : "Past event"}
                    </p>
                    <h3 className="mt-1 font-semibold text-brand-900 group-hover:text-brand-700">
                      {event.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      {/* Block 12 — Blog preview strip */}
      {recentPosts.length > 0 ? (
        <section className="border-y border-brand-100 bg-brand-50/60">
          <div className="mx-auto max-w-5xl px-4 py-16">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="text-2xl font-semibold text-brand-900">From the Farmlands Journal</h2>
              <Link
                href="/blog"
                className="text-sm font-medium text-brand-600 hover:text-brand-900"
              >
                Read all articles
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {recentPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl border border-brand-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="h-40 w-full bg-brand-100" />
                  )}
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                        {categoryLabel(post.category)}
                      </span>
                      {post.estimatedReadMinutes ? (
                        <span className="text-xs text-brand-500">
                          {post.estimatedReadMinutes} min read
                        </span>
                      ) : null}
                    </div>
                    <h3 className="font-semibold text-brand-900 group-hover:text-brand-700">
                      {post.title}
                    </h3>
                    <p className="mt-2 text-sm text-brand-600">{excerpt(post.body)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Block 13 — Inline FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center text-2xl font-semibold text-brand-900">
          Questions co-farmers ask us
        </h2>
        <div className="mt-8">
          <FaqList items={FAQ_ITEMS} />
        </div>
        <p className="mt-4 text-center text-sm text-brand-600">
          <Link href="/faq" className="font-medium text-brand-700 hover:text-brand-900">
            See all frequently asked questions →
          </Link>
        </p>
      </section>

      {/* Block 14 — Final CTA + THIRD lead capture */}
      <section className="bg-brand-900 text-brand-50">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-semibold">Ready to see it for yourself?</h2>
              <p className="mt-3 text-brand-100/85">
                You've read the whole story. The next step is simple — come walk the land. Our team
                will be there with you.
              </p>
              {whatsappNumber ? (
                <div className="mt-6 space-y-3">
                  <a
                    href={`tel:${whatsappNumber}`}
                    className="inline-block rounded-lg bg-brand-50 px-6 py-3 font-medium text-brand-900 transition-colors hover:bg-white"
                  >
                    Call {whatsappNumber}
                  </a>
                  <div>
                    <WhatsAppButton
                      phone={whatsappNumber}
                      message="I'm interested in visiting a Ghats Arcade project."
                      label="Message us on WhatsApp"
                      className="inline-block rounded-lg border border-brand-200 px-6 py-3 font-medium text-brand-50 transition-colors hover:bg-brand-800"
                    />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="rounded-2xl bg-white p-6 text-brand-900 shadow-lg">
              <LeadInquiryForm
                heading="Tell us a little, and we'll be in touch"
                submitLabel="Send enquiry"
                askWhatsApp
                sourcePage="/"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
