import { describe, expect, it } from "vitest";
import { buildWhatsAppLink, normalizePhone } from "./whatsapp";

describe("normalizePhone", () => {
  it("strips spaces, plus signs, and punctuation", () => {
    expect(normalizePhone("+91 98765-43210")).toBe("919876543210");
    expect(normalizePhone("(044) 1234 5678")).toBe("04412345678");
  });
});

describe("buildWhatsAppLink", () => {
  it("builds a bare link when no message is given", () => {
    expect(buildWhatsAppLink("+91 98765 43210")).toBe("https://wa.me/919876543210");
  });

  it("appends a URL-encoded pre-filled message", () => {
    const link = buildWhatsAppLink("919876543210", "Hi, I'm interested in Listing A & B");
    expect(link).toBe(
      "https://wa.me/919876543210?text=Hi%2C%20I'm%20interested%20in%20Listing%20A%20%26%20B",
    );
  });

  it("ignores a whitespace-only message", () => {
    expect(buildWhatsAppLink("919876543210", "   ")).toBe("https://wa.me/919876543210");
  });

  it("throws when the phone has no digits", () => {
    expect(() => buildWhatsAppLink("not-a-number")).toThrow();
  });
});
