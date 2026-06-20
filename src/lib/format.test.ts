import { describe, expect, it } from "vitest";
import { formatAcres, formatInr } from "./format";

describe("formatInr", () => {
  it("uses Indian (lakh) digit grouping with a rupee symbol", () => {
    expect(formatInr(7500000)).toBe("₹75,00,000");
    expect(formatInr(3500000)).toBe("₹35,00,000");
    expect(formatInr(1000)).toBe("₹1,000");
    expect(formatInr(100000)).toBe("₹1,00,000");
  });

  it("rounds and handles zero", () => {
    expect(formatInr(0)).toBe("₹0");
    expect(formatInr(99.6)).toBe("₹100");
  });
});

describe("formatAcres", () => {
  it("trims trailing zeros", () => {
    expect(formatAcres(5)).toBe("5 acres");
    expect(formatAcres(2.5)).toBe("2.5 acres");
    expect(formatAcres(3.0)).toBe("3 acres");
  });
});
