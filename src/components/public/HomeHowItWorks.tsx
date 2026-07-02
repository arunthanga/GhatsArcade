// Plain-language "How it works" explainer for the home page (prj.md-1) — a simple 3-step
// summary that sits above the deeper ownership-journey prose.

const STEPS = [
  {
    title: "1. Discover clean-title farmland",
    body: "Browse managed farmland with verified titles across Kerala and the Kerala–Tamil Nadu border, and tell us what fits your family.",
  },
  {
    title: "2. We plant and manage",
    body: "Our team prepares the soil, plants, waters, and maintains the land — with regular updates so you always know how your plot is doing.",
  },
  {
    title: "3. You visit and harvest",
    body: "Arrive for peaceful weekends, pluck fruit from your own trees, and grow your land's value over time — no full-time farming required.",
  },
];

export function HomeHowItWorks() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="text-center text-2xl font-semibold text-brand-900 sm:text-3xl">
        How it works
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {STEPS.map((step) => (
          <div
            key={step.title}
            className="rounded-xl border border-brand-100 bg-white p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-brand-800">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-brand-700">{step.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
