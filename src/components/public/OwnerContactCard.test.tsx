import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OwnerContactCard } from "./OwnerContactCard";

describe("OwnerContactCard", () => {
  it("shows the owner name, email, and phone", () => {
    render(<OwnerContactCard />);
    expect(screen.getByText("Contact Arun T.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "mailarunthangavel@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:mailarunthangavel@gmail.com",
    );
    expect(screen.getByRole("link", { name: "9901955667" })).toHaveAttribute(
      "href",
      "tel:+919901955667",
    );
  });
});
