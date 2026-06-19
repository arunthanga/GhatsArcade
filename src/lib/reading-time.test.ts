import { describe, expect, it } from "vitest";
import { countWords, estimateReadMinutes } from "./reading-time";

describe("countWords", () => {
  it("counts plain words", () => {
    expect(countWords("one two three")).toBe(3);
  });

  it("ignores HTML tags and entities", () => {
    expect(countWords("<p>Hello&nbsp;<strong>brave</strong> world</p>")).toBe(3);
  });

  it("returns 0 for empty/whitespace/markup-only bodies", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n  ")).toBe(0);
    expect(countWords("<br/>")).toBe(0);
  });
});

describe("estimateReadMinutes", () => {
  it("is 0 for an empty body", () => {
    expect(estimateReadMinutes("")).toBe(0);
  });

  it("rounds up with a floor of 1 minute", () => {
    expect(estimateReadMinutes("just a few words")).toBe(1);
    expect(estimateReadMinutes(Array.from({ length: 201 }, () => "word").join(" "))).toBe(2);
  });
});
