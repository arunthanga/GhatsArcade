import { describe, expect, it } from "vitest";
import { slugify } from "./slug";

describe("slugify", () => {
  it("lowercases and replaces spaces with dashes", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("collapses runs of punctuation/whitespace into a single dash", () => {
    expect(slugify("5 Acres,  Wayanad!!")).toBe("5-acres-wayanad");
  });

  it("trims leading and trailing dashes", () => {
    expect(slugify("  --Plot 7--  ")).toBe("plot-7");
  });

  it("strips diacritics", () => {
    expect(slugify("Münnar Café")).toBe("munnar-cafe");
  });

  it("keeps digits", () => {
    expect(slugify("Farm 2026")).toBe("farm-2026");
  });

  it("falls back when nothing usable remains", () => {
    expect(slugify("!!!")).toBe("listing");
    expect(slugify("")).toBe("listing");
  });
});
