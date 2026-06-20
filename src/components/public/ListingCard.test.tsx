import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ListingCard, type ListingCardData } from "./ListingCard";

const base: ListingCardData = {
  slug: "5-acre-estate",
  title: "5 Acre Estate",
  district: "Idukki",
  sizeAcres: 5,
  priceInr: 7500000,
  status: "published",
};

describe("ListingCard", () => {
  it("renders title, location, acreage and Indian-formatted price with a detail link", () => {
    render(<ListingCard listing={base} />);
    expect(screen.getByText("5 Acre Estate")).toBeInTheDocument();
    expect(screen.getByText("Idukki")).toBeInTheDocument();
    expect(screen.getByText("5 acres")).toBeInTheDocument();
    expect(screen.getByText("₹75,00,000")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/listings/5-acre-estate");
  });

  it("shows an 'Under offer' badge only for under_offer listings", () => {
    const { rerender } = render(<ListingCard listing={base} />);
    expect(screen.queryByTestId("badge-under-offer")).not.toBeInTheDocument();

    rerender(<ListingCard listing={{ ...base, status: "under_offer" }} />);
    expect(screen.getByTestId("badge-under-offer")).toBeInTheDocument();
  });
});
