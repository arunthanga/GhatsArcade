"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

export type NavLink = { href: string; label: string };

// Responsive primary navigation: an inline row on tablet/desktop and a collapsible
// hamburger panel on mobile. The language switcher is always reachable.
export function HeaderNav({
  brand,
  links,
  cta,
  menuLabels,
}: {
  brand: string;
  links: NavLink[];
  cta?: NavLink;
  menuLabels: { open: string; close: string };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  // Close the mobile menu whenever the route changes.
  // biome-ignore lint/correctness/useExhaustiveDependencies: close on navigation
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-brand-50/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-brand-900">
          {brand}
        </Link>

        {/* Tablet / desktop nav */}
        <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
          <ul className="flex items-center gap-5 text-sm font-medium text-brand-700">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-2.5 py-1 transition-colors ${
                      active
                        ? "bg-brand-100 text-brand-900"
                        : "hover:bg-brand-100/70 hover:text-brand-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {cta ? (
            <Link
              href={cta.href}
              className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-brand-50 transition-colors hover:bg-brand-800"
            >
              {cta.label}
            </Link>
          ) : null}
          <LanguageSwitcher className="text-brand-700" />
        </nav>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitcher className="text-brand-700" />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? menuLabels.close : menuLabels.open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-200 text-brand-800"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open ? (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-brand-100 md:hidden">
          <ul className="mx-auto flex max-w-5xl flex-col px-4 py-2 text-brand-800">
            {links.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-2 py-3 text-base font-medium ${
                      active ? "bg-brand-100 text-brand-900" : "hover:bg-brand-100"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            {cta ? (
              <li className="py-2">
                <Link
                  href={cta.href}
                  className="block rounded-lg bg-brand-700 px-3 py-3 text-center text-base font-medium text-brand-50"
                >
                  {cta.label}
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
