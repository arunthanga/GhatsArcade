// "How to Register" step-by-step (prj.md Section 3.4, line 313): KYC → booking → payment
// options → sale deed → sub-registrar → ownership. Making the process visible removes the
// buyer paralysis described in prj.md ("they don't know how to buy it"). Generic + reusable.

const STEPS: { title: string; detail: string }[] = [
  {
    title: "KYC & eligibility",
    detail:
      "Share your ID and address proof. We confirm buyer eligibility (resident, NRI, or OCI) before registration.",
  },
  {
    title: "Booking",
    detail: "Reserve your chosen plot with a booking advance — it's then held in your name.",
  },
  {
    title: "Payment options",
    detail:
      "Pay in full or via a milestone plan. Pricing is transparent: land price + maintenance fee + registration charges.",
  },
  {
    title: "Sale deed",
    detail: "We prepare the sale deed with clear-title documentation for your review.",
  },
  {
    title: "Sub-registrar",
    detail:
      "Registration is completed at the sub-registrar's office, including stamp duty and registration charges.",
  },
  {
    title: "Ownership",
    detail: "You receive the registered deed and become the registered owner of your plot.",
  },
];

export function RegistrationSteps() {
  return (
    <section aria-labelledby="how-to-register" className="mb-10">
      <h2 id="how-to-register" className="mb-3 text-xl font-semibold text-brand-900">
        How to register — step by step
      </h2>
      <p className="mb-5 max-w-2xl text-sm text-brand-600">
        Knowing exactly what happens next removes the guesswork. Here's the full path from first
        enquiry to owning your plot.
      </p>
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="rounded-xl border border-brand-100 bg-white p-5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-700 text-sm font-semibold text-brand-50">
              {index + 1}
            </span>
            <h3 className="mt-3 font-semibold text-brand-800">{step.title}</h3>
            <p className="mt-1 text-sm text-brand-600">{step.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
