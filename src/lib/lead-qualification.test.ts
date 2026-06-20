import { describe, expect, it } from "vitest";
import { appendLeadQualification } from "./lead-qualification";

describe("appendLeadQualification", () => {
  it("appends selected qualification details after the buyer message", () => {
    const message = appendLeadQualification("Please call me.", {
      buyingTimeline: "Ready in 1-3 months",
      budgetRange: "₹50 lakh-₹1 crore",
      wantsProofPack: true,
    });

    expect(message).toContain("Please call me.");
    expect(message).toContain("Lead qualification:");
    expect(message).toContain("When you'd like to join: Ready in 1-3 months");
    expect(message).toContain("Budget range: ₹50 lakh-₹1 crore");
    expect(message).toContain("Requested proof pack/factsheet before follow-up.");
  });

  it("returns undefined when there is no message or qualification detail", () => {
    expect(appendLeadQualification("", {})).toBeUndefined();
  });

  it("keeps the composed CRM note within the lead message limit", () => {
    const message = appendLeadQualification("x".repeat(2100), {
      visitReadiness: "Send project facts first",
    });

    expect(message).toHaveLength(2000);
  });
});
