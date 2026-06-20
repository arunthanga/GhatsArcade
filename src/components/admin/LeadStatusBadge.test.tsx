import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LeadStatusBadge } from "./LeadStatusBadge";

describe("LeadStatusBadge", () => {
  it("renders a human label and colour class per known status", () => {
    render(<LeadStatusBadge status="negotiating" />);
    const badge = screen.getByTestId("lead-status-badge");
    expect(badge).toHaveTextContent("Negotiating");
    expect(badge).toHaveAttribute("data-status", "negotiating");
    expect(badge.className).toContain("orange");
  });

  it("falls back to a de-underscored label for unknown statuses", () => {
    render(<LeadStatusBadge status="some_new_state" />);
    const badge = screen.getByTestId("lead-status-badge");
    expect(badge).toHaveTextContent("some new state");
  });
});
