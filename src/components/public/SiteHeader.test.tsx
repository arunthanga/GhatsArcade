import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  it("renders the brand and primary nav links with correct hrefs", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Ghats Arcade" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Listings" })).toHaveAttribute("href", "/listings");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
  });
});
