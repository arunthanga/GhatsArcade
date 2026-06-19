import { describe, expect, it } from "vitest";
import { formatAcres, formatInr } from "./format";

describe("formatInr", () => {
  it("uses Indian digit grouping", () => {
    expect(formatInr(7500000)).toBe("Rs 75,00,000");
    expect(formatInr(1000)).toBe("Rs 1,000");
    expect(formatInr(100000)).toBe("Rs 1,00,000");
  });

  it("rounds and handles zero", () => {
    expect(formatInr(0)).toBe("Rs 0");
    expect(formatInr(99.6)).toBe("Rs 100");
  });
});

describe("formatAcres", () => {
  it("trims trailing zeros", () => {
    expect(formatAcres(5)).toBe("5 acres");
    expect(formatAcres(2.5)).toBe("2.5 acres");
    expect(formatAcres(3.0)).toBe("3 acres");
  });
});
