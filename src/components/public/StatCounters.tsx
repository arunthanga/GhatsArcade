"use client";

import { useEffect, useRef, useState } from "react";

// Block 4 — animated social-proof counters (prj.md Section 3.1). Counts up once when the
// strip scrolls into view. Values are passed in (currently static; admin-editable later).
export type Stat = { label: string; value: number; suffix?: string };

const DURATION_MS = 1200;

export function StatCounters({ stats }: { stats: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = Math.min(1, (now - start) / DURATION_MS);
            // easeOutCubic for a pleasant deceleration.
            setProgress(1 - (1 - elapsed) ** 3);
            if (elapsed < 1) {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-4xl font-bold text-brand-50 tabular-nums">
            {Math.round(stat.value * progress).toLocaleString("en-IN")}
            {stat.suffix ?? ""}
          </p>
          <p className="mt-1 text-sm text-brand-200">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
