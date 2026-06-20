import Link from "next/link";
import { SITE_OWNER } from "@/lib/site-contact";

type TrustProofStripProps = {
  className?: string;
  compact?: boolean;
};

const PROOF_ITEMS = [
  {
    label: "Meet the owner",
    value: `${SITE_OWNER.name} · ${SITE_OWNER.phoneDisplay}`,
  },
  {
    label: "Clean titles",
    value: "Title, land class, road access, water source",
  },
  {
    label: "Trusted developer",
    value: "No online payment, no forced booking, no return promises",
  },
];

export function TrustProofStrip({ className = "", compact = false }: TrustProofStripProps) {
  return (
    <section
      aria-label="Trust and verification proof"
      className={`border-y border-brand-100 bg-white ${className}`}
    >
      <div className={`mx-auto max-w-5xl px-4 ${compact ? "py-5" : "py-8"}`}>
        <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-500">
              Proof before pitch
            </p>
            <h2 className="mt-2 text-xl font-semibold text-brand-900">
              See the facts, meet the person responsible, then decide.
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-600">
              We keep the business clean: verify clean titles, understand the maintenance scope,
              and walk the site before any serious decision. For your family, investment security
              starts with paperwork you can review and people you can meet.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {PROOF_ITEMS.map((item) => (
              <div key={item.label} className="rounded-xl border border-brand-100 bg-brand-50 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-brand-500">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-brand-900">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          <Link className="font-medium text-brand-700 hover:text-brand-900" href="/legal-checklist">
            Read the legal checklist →
          </Link>
          <Link
            className="font-medium text-brand-700 hover:text-brand-900"
            href="/what-managed-means"
          >
            See what managed means →
          </Link>
        </div>
      </div>
    </section>
  );
}
