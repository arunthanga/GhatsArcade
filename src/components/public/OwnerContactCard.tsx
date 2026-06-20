import { SITE_OWNER } from "@/lib/site-contact";

export function OwnerContactCard() {
  return (
    <section
      data-testid="owner-contact"
      className="mt-8 rounded-xl border border-brand-100 bg-white p-6"
    >
      <h2 className="text-lg font-semibold text-brand-900">Contact {SITE_OWNER.name}</h2>
      <p className="mt-1 text-sm text-brand-600">
        Reach the owner directly by email or phone — we usually reply the same day.
      </p>
      <ul className="mt-4 space-y-2 text-sm text-brand-800">
        <li>
          <span className="font-medium text-brand-900">Email:</span>{" "}
          <a
            href={`mailto:${SITE_OWNER.email}`}
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            {SITE_OWNER.email}
          </a>
        </li>
        <li>
          <span className="font-medium text-brand-900">Phone:</span>{" "}
          <a
            href={`tel:${SITE_OWNER.phoneTel}`}
            className="text-brand-700 underline-offset-2 hover:underline"
          >
            {SITE_OWNER.phoneDisplay}
          </a>
        </li>
      </ul>
    </section>
  );
}
