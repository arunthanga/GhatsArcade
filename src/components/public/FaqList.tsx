import type { FaqItem } from "@/lib/faq-data";

// Accessible, no-JS FAQ accordion using native <details>. Reusable on the standalone /faq
// page and (later) inline on the home page (prj.md Section 3.7).
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-brand-100 rounded-xl border border-brand-100 bg-white">
      {items.map((item) => (
        <details key={item.question} className="group p-5 [&_summary]:cursor-pointer">
          <summary className="flex items-center justify-between gap-4 font-medium text-brand-900 marker:content-['']">
            <span>{item.question}</span>
            <span
              aria-hidden="true"
              className="shrink-0 text-brand-500 transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-brand-700">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
