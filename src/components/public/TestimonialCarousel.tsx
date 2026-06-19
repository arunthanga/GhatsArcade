"use client";

import { useState } from "react";
import { TESTIMONIAL_BUYER_TYPE_LABELS } from "@/types";

export type PublicTestimonial = {
  id: string;
  quoteText: string;
  buyerName: string;
  buyerCity: string | null;
  buyerType: string;
  videoUrl: string | null;
};

function buyerTypeLabel(buyerType: string): string {
  return (
    TESTIMONIAL_BUYER_TYPE_LABELS[buyerType as keyof typeof TESTIMONIAL_BUYER_TYPE_LABELS] ??
    buyerType
  );
}

function attribution(t: PublicTestimonial): string {
  const parts = [buyerTypeLabel(t.buyerType)];
  if (t.buyerCity) {
    parts.push(t.buyerCity);
  }
  return parts.join(" · ");
}

export function TestimonialCarousel({ testimonials }: { testimonials: PublicTestimonial[] }) {
  const [index, setIndex] = useState(0);

  if (testimonials.length === 0) {
    return null;
  }

  const count = testimonials.length;
  const current = testimonials[Math.min(index, count - 1)];
  const go = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <div data-testid="testimonial-carousel" className="mx-auto max-w-3xl">
      <figure className="rounded-2xl border border-brand-100 bg-white p-8 text-center shadow-sm">
        <blockquote className="text-lg leading-relaxed text-brand-800">
          “{current.quoteText}”
        </blockquote>
        <figcaption className="mt-6">
          <p className="font-semibold text-brand-900">{current.buyerName}</p>
          <p className="text-sm text-brand-500">{attribution(current)}</p>
        </figcaption>
        {current.videoUrl ? (
          <a
            href={current.videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-900"
          >
            ▶ Watch their story
          </a>
        ) : null}
      </figure>

      {count > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-700 transition-colors hover:bg-brand-50"
          >
            ‹
          </button>
          <div className="flex gap-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i === index ? "bg-brand-700" : "bg-brand-200 hover:bg-brand-300"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-700 transition-colors hover:bg-brand-50"
          >
            ›
          </button>
        </div>
      ) : null}
    </div>
  );
}
