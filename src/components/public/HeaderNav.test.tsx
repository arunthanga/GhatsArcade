import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { HeaderNav, type NavLink } from "./HeaderNav";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ refresh: vi.fn() }),
}));

const links: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/listings", label: "Listings" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function renderNav() {
  return render(
    <LocaleProvider locale="en">
      <HeaderNav brand="Ghats Arcade" links={links} menuLabels={{ open: "Open", close: "Close" }} />
    </LocaleProvider>,
  );
}

function renderNavWithCta() {
  return render(
    <LocaleProvider locale="en">
      <HeaderNav
        brand="Ghats Arcade"
        links={links}
        cta={{ href: "/contact#site-visit", label: "Schedule a site visit" }}
        menuLabels={{ open: "Open", close: "Close" }}
      />
    </LocaleProvider>,
  );
}

describe("HeaderNav", () => {
  it("renders the brand and primary nav links with correct hrefs", () => {
    renderNav();

    expect(screen.getByRole("link", { name: "Ghats Arcade" })).toHaveAttribute("href", "/");
    // The desktop nav renders the link set (the mobile panel is collapsed by default).
    expect(screen.getByRole("link", { name: "Listings" })).toHaveAttribute("href", "/listings");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });

  it("marks the current page and exposes a primary visit CTA", () => {
    renderNavWithCta();

    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Schedule a site visit" })).toHaveAttribute(
      "href",
      "/contact#site-visit",
    );
  });

  it("exposes a language switcher", () => {
    renderNav();
    // There is at least one language <select> (mobile + desktop both render one).
    expect(screen.getAllByLabelText("Language").length).toBeGreaterThan(0);
  });
});
